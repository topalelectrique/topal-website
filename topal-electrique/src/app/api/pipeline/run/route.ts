import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { scrapeNews } from '@/lib/pipeline/scraper';
import { generateArticle, type ArticleType } from '@/lib/pipeline/generator';
import { fetchImage } from '@/lib/pipeline/imager';
import { findInternalLinks } from '@/lib/pipeline/linker';
import { publishArticle, markKeywordUsed, logPipelineRun } from '@/lib/pipeline/publisher';
import { postToFacebook } from '@/lib/pipeline/facebook';

export const maxDuration = 60;

function getTypeFromDay(): ArticleType {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, 3=Wed, 5=Fri
  if (day === 1) return 'evergreen';
  if (day === 3) return 'news';
  if (day === 5) return 'topal';
  return 'evergreen';
}

export async function POST(req: NextRequest) {
  // Auth check
  const secret = req.headers.get('x-pipeline-secret');
  if (secret !== process.env.PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const articleType: ArticleType = body.type ?? getTypeFromDay();

  let keyword: string = '';
  let keywordId: number | undefined;
  let newsContext: { title: string; summary: string; url: string } | undefined;

  try {
    // 1. Determine content source
    if (articleType === 'news') {
      const story = await scrapeNews();
      if (story) {
        keyword = story.title;
        newsContext = story;
      } else {
        // Fallback to evergreen if no news found
        const { data: kw } = await supabase
          .from('keywords')
          .select('id, keyword')
          .is('used_at', null)
          .order('priority', { ascending: false })
          .limit(1)
          .single();
        if (!kw) throw new Error('No keywords available');
        keyword = kw.keyword;
        keywordId = kw.id;
      }
    } else {
      const { data: kw } = await supabase
        .from('keywords')
        .select('id, keyword')
        .is('used_at', null)
        .order('priority', { ascending: false })
        .limit(1)
        .single();
      if (!kw) throw new Error('No keywords available');
      keyword = kw.keyword;
      keywordId = kw.id;
    }

    // 2. Claim keyword immediately so no retry picks it again
    if (keywordId) await markKeywordUsed(keywordId);

    // 3. Find internal links for each locale
    const frLinks = await findInternalLinks('residential', 'fr');
    const enLinks = await findInternalLinks('residential', 'en');

    // 4. Generate FR + EN articles sequentially (memory constraint on 512MB Render)
    const frArticle = await generateArticle(keyword, articleType, 'fr', frLinks, newsContext);
    const enArticle = await generateArticle(keyword, articleType, 'en', enLinks, newsContext);

    // 5. Fetch image — use generated title for better relevance
    const image = await fetchImage(frArticle.title, frArticle.category);

    // 6. Publish both to Supabase + revalidate
    const { frId } = await publishArticle(frArticle, enArticle, image, articleType, newsContext?.url);

    // 7. Cross-post to Facebook (async, non-blocking)
    postToFacebook(frArticle.slug, frArticle.title, frArticle.excerpt, frId, image.url, frArticle.category).catch((err) => {
      console.error('Facebook post failed:', err.message);
    });

    // 8. Log success
    await logPipelineRun(articleType, 'success', frId);

    return NextResponse.json({
      success: true,
      type: articleType,
      keyword,
      frSlug: frArticle.slug,
      enSlug: enArticle.slug,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logPipelineRun(articleType, 'error', undefined, message).catch(() => {});
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

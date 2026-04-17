import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { GeneratedArticle, ArticleType } from './generator';
import type { ImageResult } from './imager';
import { v4 as uuidv4 } from 'uuid';

export async function publishArticle(
  frArticle: GeneratedArticle,
  enArticle: GeneratedArticle,
  image: ImageResult,
  articleType: ArticleType,
  sourceUrl?: string
): Promise<{ frId: number; enId: number }> {
  const pairId = uuidv4();
  const publishedAt = new Date().toISOString();

  // Insert French article
  const { data: frData, error: frError } = await supabase
    .from('articles')
    .insert({
      slug: frArticle.slug,
      title: frArticle.title,
      meta_title: frArticle.meta_title,
      meta_description: frArticle.meta_description,
      content: frArticle.content,
      excerpt: frArticle.excerpt,
      category: frArticle.category,
      type: articleType,
      image_url: image.url,
      image_alt: image.alt,
      locale: 'fr',
      source_url: sourceUrl ?? null,
      published_at: publishedAt,
      pair_id: pairId,
      reading_time: frArticle.reading_time,
    })
    .select('id')
    .single();

  if (frError) throw new Error(`Failed to insert FR article: ${frError.message}`);

  // Insert English article
  const { data: enData, error: enError } = await supabase
    .from('articles')
    .insert({
      slug: enArticle.slug,
      title: enArticle.title,
      meta_title: enArticle.meta_title,
      meta_description: enArticle.meta_description,
      content: enArticle.content,
      excerpt: enArticle.excerpt,
      category: enArticle.category,
      type: articleType,
      image_url: image.url,
      image_alt: image.alt,
      locale: 'en',
      source_url: sourceUrl ?? null,
      published_at: publishedAt,
      pair_id: pairId,
      reading_time: enArticle.reading_time,
    })
    .select('id')
    .single();

  if (enError) throw new Error(`Failed to insert EN article: ${enError.message}`);

  // Revalidate blog pages
  revalidatePath('/fr/conseils');
  revalidatePath('/en/blog');
  revalidatePath(`/fr/conseils/${frArticle.slug}`);
  revalidatePath(`/en/blog/${enArticle.slug}`);

  return { frId: frData.id, enId: enData.id };
}

export async function markKeywordUsed(keywordId: number): Promise<void> {
  await supabase
    .from('keywords')
    .update({ used_at: new Date().toISOString() })
    .eq('id', keywordId);
}

export async function logPipelineRun(
  type: string,
  status: 'success' | 'error',
  articleId?: number,
  error?: string
): Promise<void> {
  await supabase.from('pipeline_runs').insert({
    type,
    status,
    article_id: articleId ?? null,
    error: error ?? null,
  });
}

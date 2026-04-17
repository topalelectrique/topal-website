import { supabase } from '@/lib/supabase';

const GRAPH_API = 'https://graph.facebook.com/v19.0';

async function uploadPhotoToFacebook(
  pageId: string,
  token: string,
  imageUrl: string,
  caption: string
): Promise<string> {
  const res = await fetch(`${GRAPH_API}/${pageId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: imageUrl,
      caption,
      published: true,
      access_token: token,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook photo upload error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.post_id ?? data.id;
}

export async function postToFacebook(
  frSlug: string,
  frTitle: string,
  frExcerpt: string,
  frArticleId: number,
  imageUrl?: string
): Promise<void> {
  const pageId = process.env.META_PAGE_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;

  if (!pageId || !token) {
    throw new Error('META_PAGE_ID or META_PAGE_ACCESS_TOKEN not set');
  }

  const articleUrl = `https://topalelectrique.ca/fr/conseils/${frSlug}`;
  const caption = `${frTitle}\n\n${frExcerpt}\n\n🔗 Lire l'article : ${articleUrl}\n\n#TopalÉlectrique #Électricité #Montréal #Électricien`;

  if (imageUrl) {
    await uploadPhotoToFacebook(pageId, token, imageUrl, caption);
  } else {
    const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: caption, link: articleUrl, access_token: token }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Facebook API error ${res.status}: ${err}`);
    }
  }

  await supabase
    .from('articles')
    .update({ facebook_posted_at: new Date().toISOString() })
    .eq('id', frArticleId);
}

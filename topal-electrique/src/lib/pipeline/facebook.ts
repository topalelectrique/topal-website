import { supabase } from '@/lib/supabase';
import { applyBranding, downloadImage } from './brander';

const GRAPH_API = 'https://graph.facebook.com/v19.0';

async function uploadBrandedPhotoToFacebook(
  pageId: string,
  token: string,
  brandedBuffer: Buffer,
  caption: string
): Promise<string> {
  const formData = new FormData();
  formData.append('source', new Blob([brandedBuffer.buffer as ArrayBuffer], { type: 'image/jpeg' }), 'topal-post.jpg');
  formData.append('caption', caption);
  formData.append('published', 'true');
  formData.append('access_token', token);

  const res = await fetch(`${GRAPH_API}/${pageId}/photos`, {
    method: 'POST',
    body: formData,
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
  imageUrl?: string,
  category?: string
): Promise<void> {
  const pageId = process.env.META_PAGE_ID;
  const token = process.env.META_PAGE_ACCESS_TOKEN;

  if (!pageId || !token) {
    throw new Error('META_PAGE_ID or META_PAGE_ACCESS_TOKEN not set');
  }

  const articleUrl = `https://topalelectrique.ca/fr/conseils/${frSlug}`;
  const caption = `${frTitle}\n\n${frExcerpt}\n\n🔗 Lire l'article : ${articleUrl}\n\n#TopalÉlectrique #Électricité #Montréal #Électricien`;

  if (imageUrl) {
    try {
      const rawBuffer = await downloadImage(imageUrl);
      const brandedBuffer = await applyBranding(rawBuffer, category ?? 'default');
      await uploadBrandedPhotoToFacebook(pageId, token, brandedBuffer, caption);
    } catch (brandErr) {
      // Branding failed — fall back to posting URL directly (no branding)
      console.error('[facebook] branding failed, falling back to URL post:', brandErr);
      const res = await fetch(`${GRAPH_API}/${pageId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, caption, published: true, access_token: token }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Facebook photo upload error ${res.status}: ${err}`);
      }
    }
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

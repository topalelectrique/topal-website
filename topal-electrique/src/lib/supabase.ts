import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export type Article = {
  id: number;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  content: string;
  excerpt: string | null;
  category: string | null;
  type: 'evergreen' | 'news' | 'topal';
  image_url: string | null;
  image_alt: string | null;
  locale: string;
  source_url: string | null;
  published_at: string;
  pair_id: string | null;
  reading_time: number | null;
};

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key || key !== process.env.PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await supabase
    .from('pipeline_runs')
    .select('ran_at, status, type, error')
    .order('ran_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, reason: 'No pipeline runs found' }, { status: 500 });
  }

  const ageHours = (Date.now() - new Date(data.ran_at).getTime()) / 36e5;

  if (data.status === 'error') {
    return NextResponse.json(
      { ok: false, reason: data.error ?? 'Pipeline error', last_run: data.ran_at, type: data.type },
      { status: 500 }
    );
  }

  // Alert if no successful run in the last 5 days (covers Mon/Wed/Fri schedule)
  if (ageHours > 120) {
    return NextResponse.json(
      { ok: false, reason: `No pipeline run in ${Math.round(ageHours)}h`, last_run: data.ran_at },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, last_run: data.ran_at, type: data.type });
}

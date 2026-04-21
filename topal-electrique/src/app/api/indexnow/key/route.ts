import { NextResponse } from 'next/server';

// IndexNow key verification endpoint.
// Search engines GET this URL to confirm we own the key.
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new NextResponse('', { status: 404 });
  return new NextResponse(key, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

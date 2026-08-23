import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  const directory = {
    keys: [],
    version: '1.0',
    description: 'Web Bot Auth directory (RFC 9421 http-message-signatures)',
  };

  return NextResponse.json(directory, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

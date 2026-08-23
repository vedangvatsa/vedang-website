import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  return NextResponse.json(
    { status: 'ok', action, message: 'veda.ng public API requires no credentials.' },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  return NextResponse.json(
    { status: 'ok', action, message: 'veda.ng public API requires no credentials.' },
    { headers: CORS_HEADERS }
  );
}

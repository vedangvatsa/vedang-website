import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  const directory = {
    version: '1.0',
    keys: [
      {
        kty: 'OKP',
        crv: 'Ed25519',
        kid: 'veda-bot-auth-2026',
        use: 'sig',
        alg: 'EdDSA',
        x: '11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo',
        nbf: 1770000000,
        exp: 1890000000,
      },
    ],
  };

  return NextResponse.json(directory, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

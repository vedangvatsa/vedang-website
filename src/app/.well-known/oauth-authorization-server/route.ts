import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const metadata = {
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/api/auth/authorize`,
    token_endpoint: `${SITE_URL}/api/auth/token`,
    registration_endpoint: `${SITE_URL}/api/auth/register`,
    revocation_endpoint: `${SITE_URL}/api/auth/revoke`,
    response_types_supported: ['token'],
    grant_types_supported: ['anonymous', 'urn:ietf:params:oauth:grant-type:token-exchange'],
    agent_auth: {
      auth_type: 'none',
      skill: `${SITE_URL}/auth.md`,
      register_uri: `${SITE_URL}/api/auth/register`,
      claim_uri: `${SITE_URL}/api/auth/claim`,
      revocation_uri: `${SITE_URL}/api/auth/revoke`,
      identity_types_supported: ['anonymous', 'identity_assertion'],
      anonymous: {
        credential_types_supported: ['none'],
      },
      identity_assertion: {
        assertion_types_supported: ['urn:ietf:params:oauth:token-type:id-jag', 'verified_email'],
        credential_types_supported: ['bearer_token'],
      },
    },
  };

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

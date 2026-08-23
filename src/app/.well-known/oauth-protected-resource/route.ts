import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const metadata = {
    resource: SITE_URL,
    authorization_servers: [SITE_URL],
    scopes_supported: ['read:reports', 'read:essays', 'read:glossary'],
    bearer_methods_supported: ['header'],
    resource_documentation: `${SITE_URL}/developers`,
    agent_auth: {
      auth_type: 'none',
      skill: `${SITE_URL}/auth.md`,
      register_uri: `${SITE_URL}/api/auth/register`,
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

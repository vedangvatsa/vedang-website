import dotenv from 'dotenv';
import path from 'node:path';
import { ROOT } from './viz-publishing.js';
import { hashnodeGraphql } from './hashnode-api.js';

dotenv.config({ path: path.join(ROOT, '.env.local'), quiet: true });

async function main() {
  const publicationId = process.env.HASHNODE_PUBLICATION_ID;
  if (!publicationId) throw new Error('Missing HASHNODE_PUBLICATION_ID');
  const identity = await hashnodeGraphql<{ me: { id: string; username: string } }>('query { me { id username } }');
  console.log(`PASS Hashnode identity: ${identity.me.username}`);
  const result = await hashnodeGraphql<{ publication: { id: string; title: string; url: string } }>(
    'query($id: ObjectId!) { publication(id: $id) { id title url } }', { id: publicationId },
  );
  if (result.publication?.id !== publicationId) throw new Error('Hashnode publication identity mismatch');
  console.log(`PASS Hashnode publication access: ${result.publication.url}; no post created`);
}

main().catch(err => { console.error(`FAIL Hashnode preflight: ${(err as Error).message}`); process.exitCode = 1; });

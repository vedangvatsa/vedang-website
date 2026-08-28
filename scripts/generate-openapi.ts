import { GET } from '../src/app/api/openapi/route';
import fs from 'fs';
import path from 'path';

async function main() {
  const res = GET();
  const data = await res.json();
  const outPath = path.join(process.cwd(), 'public', 'openapi.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log('✅ Generated public/openapi.json successfully!');
}

main().catch(err => {
  console.error('Failed to generate openapi.json:', err);
  process.exit(1);
});

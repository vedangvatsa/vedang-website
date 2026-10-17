import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { financeMedia } from '../src/lib/finance-data';

async function download(url: string) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'VedaResearch/1.0 (https://veda.ng/contact)' },
    signal: AbortSignal.timeout(60000),
  });
  assert(response.ok, `${response.status} from ${url}`);
  const body = Buffer.from(await response.arrayBuffer());
  assert(body.length > 0 && body.length < 8 * 1024 * 1024, 'Unexpected asset size');
  return { body, contentType: response.headers.get('content-type') || '' };
}

async function main() {
  const results = [];
  for (const image of financeMedia) {
    const { body, contentType } = await download(image.downloadUrl);
    if (image.localPath.endsWith('.svg')) {
      const svg = body.toString('utf8');
      assert(svg.includes('<svg') && /width="\d+"/.test(svg) && /height="\d+"/.test(svg));
      assert(!/<script\b|\bon\w+\s*=|(?:xlink:)?href\s*=\s*["'](?:https?:|javascript:)/i.test(svg), 'Unexpected active or external SVG content');
    } else {
      assert(contentType.startsWith('image/jpeg') && body[0] === 0xff && body[1] === 0xd8);
    }
    const destination = path.join(process.cwd(), 'public', image.localPath);
    assert(fs.existsSync(path.dirname(destination)), 'Image parent directory must exist');
    fs.writeFileSync(destination, body);
    results.push({ file: image.localPath, bytes: body.length, sha256: createHash('sha256').update(body).digest('hex') });
  }
  const licenseUrl = 'https://raw.githubusercontent.com/google-agentic-commerce/AP2/e1ea56db72a6385bce3e5c1112b3a56ce60acb43/LICENSE';
  const { body: license } = await download(licenseUrl);
  assert(license.toString('utf8').includes('Apache License') && license.toString('utf8').includes('Version 2.0'));
  fs.writeFileSync('public/images/essays/agenticfinance-ap2-LICENSE.txt', license);
  console.log(JSON.stringify({ images: results, license: 'public/images/essays/agenticfinance-ap2-LICENSE.txt' }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {validateCaption,validateVideoOnlyCaption,LIMITS,captionLength} from './viz-captions.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const copy=JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/viz-batch2-concise-copy.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/viz-batch2-assets/manifest.json'),'utf8'));
const review=[];
for(const video of manifest.videos.filter(v=>v.status==='queued')) {
  let lead,definition;
  if(video.indicator.startsWith('FAO.')) {
    const product=copy.production[video.slug];
    assert.ok(product,`Missing product wording for ${video.slug}`);
    const unit=video.measure.includes('million')?'millions of tonnes':video.measure.includes('thousand')?'thousands of tonnes':'tonnes';
    lead=`How the largest ${product} producers changed.`;
    if(video.slug==='coffee') lead='How the biggest coffee producers changed.';
    definition=`${product[0].toUpperCase()+product.slice(1)} production by country, measured in ${unit}.`;
  } else {
    assert.ok(copy.wdi[video.slug],`Missing metric wording for ${video.slug}`);
    [lead,definition]=copy.wdi[video.slug];
  }
  const caption=`${lead}\n\n${video.startYear}-${video.endYear}. ${definition}`;
  validateVideoOnlyCaption(caption);
  for(const platform of Object.keys(LIMITS)) validateCaption(platform,caption);
  review.push({slug:video.slug,caption,maximumPlatformLength:Math.max(...Object.keys(LIMITS).map(p=>captionLength(p,caption)))});
}
assert.equal(review.length,88);
fs.writeFileSync(path.join(ROOT,'scripts/viz-batch2-assets/concise-caption-review.json'),JSON.stringify({style:'concise-v2',status:'review',captions:review},null,2)+'\n');
console.log(JSON.stringify({captions:review.length,platforms:11,longest:Math.max(...review.map(r=>r.maximumPlatformLength)),examples:review.filter(r=>['coffee','women-parliament','natural-rubber','public-consumption'].includes(r.slug))},null,2));

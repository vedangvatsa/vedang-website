#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validateVideoOnlyCaption,LIMITS} from './viz-captions.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.resolve(process.argv[2]);
const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/viz-batch2-assets/manifest.json'),'utf8'));
const review=JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/viz-batch2-assets/concise-caption-review.json'),'utf8'));
const copy=new Map(review.captions.map(p=>[p.slug,p.caption]));
const summaryFile=path.join(out,'revision-summary.json');
if(fs.existsSync(out)) assert.ok(fs.existsSync(summaryFile),'Destination is not an earlier export of this revision');
fs.mkdirSync(out,{recursive:true});
for(const dir of ['captions','previews','verification']) fs.mkdirSync(path.join(out,dir),{recursive:true});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const records=[],cards=[];
for(const item of manifest.videos.filter(v=>v.status==='queued')) {
  const source=path.join(ROOT,item.video),filename=path.basename(source);
  assert.equal(createHash('sha256').update(fs.readFileSync(source)).digest('hex'),item.videoSha256);
  fs.copyFileSync(source,path.join(out,filename));
  fs.copyFileSync(path.join(ROOT,item.thumbnail),path.join(out,'previews',`${item.slug}.png`));
  fs.copyFileSync(path.join(ROOT,'scripts/viz-batch2-assets/audio-revision',`${item.slug}.json`),path.join(out,'verification',`${item.slug}.json`));
  const caption=copy.get(item.slug); validateVideoOnlyCaption(caption);
  for(const platform of Object.keys(LIMITS)) fs.writeFileSync(path.join(out,'captions',`${item.slug}.${platform}.txt`),caption+'\n');
  records.push({number:item.number,slug:item.slug,filename,caption,videoSha256:item.videoSha256});
  cards.push(`<article data-topic="${esc(item.title.toLowerCase())}"><h2>${item.number}. ${esc(item.title)}</h2><video controls playsinline preload="none" width="1080" height="1920" aria-label="${esc(item.title)}" data-poster="previews/${item.slug}.png" data-src="${filename}"></video><pre>${esc(caption)}</pre></article>`);
}
fs.copyFileSync(path.join(ROOT,'scripts/viz-batch2-assets/audio-revision/music-license-evidence.json'),path.join(out,'verification/music-license-evidence.json'));
fs.writeFileSync(path.join(out,'caption-review.md'),'# Revised video captions\n\n'+records.map(r=>`## ${r.number}. ${r.slug}\n\n${r.caption}\n`).join('\n'));
fs.writeFileSync(path.join(out,'captions.json'),JSON.stringify(records,null,2)+'\n');
fs.writeFileSync(summaryFile,JSON.stringify({complete:true,edition:'concise-v2',videos:records.length,platforms:11,
  captionFiles:records.length*11,linksInCaptions:false,productionDetailsInCaptions:false,
  audioAttributionRequired:false,videoStreamsUnchanged:true,publishingPaused:true},null,2)+'\n');
fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Revised video captions</title><style>body{margin:32px;background:#f6f7f4;color:#1c302e;font:16px/1.5 system-ui}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px}article{min-width:0}video{width:100%;height:auto;max-height:70vh;object-fit:contain}pre{white-space:pre-wrap;font:inherit}h2{font-size:22px}input{padding:12px;font:inherit;width:min(90%,600px)}</style><h1>Revised video captions</h1><p>88 videos · Concise captions for all 11 platforms</p><input id="search" placeholder="Find a topic" aria-label="Find a topic"><main>'+cards.join('')+'</main><script>const vs=[...document.querySelectorAll("video")];const load=v=>{v.poster=v.dataset.poster;v.src=v.dataset.src};const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){load(e.target);observer.unobserve(e.target)}}),{rootMargin:"400px"});vs.forEach(v=>{observer.observe(v);v.addEventListener("play",()=>vs.forEach(o=>{if(o!==v)o.pause()}))});document.querySelector("#search").addEventListener("input",e=>document.querySelectorAll("article").forEach(a=>{a.hidden=!a.dataset.topic.includes(e.target.value.toLowerCase());if(a.hidden)a.querySelector("video").pause()}));</script></html>');
console.log(JSON.stringify({destination:out,videos:records.length,captions:records.length*11},null,2));

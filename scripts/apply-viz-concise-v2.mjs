#!/usr/bin/env node
// Pair the reviewed copy with verified no-attribution editions for pending posts.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateCaption,validateVideoOnlyCaption,LIMITS} from './viz-captions.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assets=path.join(ROOT,'scripts/viz-batch2-assets');
const manifestFile=path.join(assets,'manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
const captions=JSON.parse(fs.readFileSync(path.join(assets,'concise-caption-review.json'),'utf8'));
const audio=JSON.parse(fs.readFileSync(path.join(assets,'audio-revision/manifest.json'),'utf8'));
assert.ok(audio.complete && audio.videoCount===88 && audio.attributionRequired===false);
const bySlug=new Map(audio.videos.map(v=>[v.slug,v]));
const copy=new Map(captions.captions.map(c=>[c.slug,c.caption]));
const digest=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for(const item of manifest.videos.filter(v=>v.status==='queued')) {
  const revision=bySlug.get(item.slug);
  assert.ok(revision?.complete && revision.videoStreamUnchanged && revision.audioAttributionRequired===false);
  assert.equal(digest(path.join(ROOT,revision.video)),revision.videoSha256);
  validateVideoOnlyCaption(copy.get(item.slug));
  if(!item.previousEdition) item.previousEdition={video:item.video,videoSha256:item.videoSha256,musicCredit:item.musicCredit,musicSource:item.musicSource,musicLicense:item.musicLicense};
  Object.assign(item,{video:revision.video,videoSha256:revision.videoSha256,videoStreamSha256:revision.videoStreamSha256,
    musicLicense:revision.audioLicense,audioAttributionRequired:false,audioRevision:'no-attribution-v1',
    musicSource:revision.soundtrack.source,soundtrack:revision.soundtrack});
  delete item.musicCredit;
  const oldNotes=fs.readFileSync(path.join(ROOT,'public/viz-notes',`${String(item.number).padStart(2,'0')}.txt`),'utf8');
  const dataNotes=oldNotes.split('\n\nMusic ')[0].trim();
  const revisedNotes=`${dataNotes}\n\nSoundtrack edition no-attribution-v1.\n${revision.soundtrack.title} by ${revision.soundtrack.artist}.\nLicensed under the Mixkit Stock Music Free License. Attribution is not required.\n${revision.soundtrack.licenseUrl}\n`;
  const noteName=`${String(item.number).padStart(2,'0')}-r2.txt`;
  fs.writeFileSync(path.join(ROOT,'public/viz-notes',noteName),revisedNotes);
  item.notesUrl=`https://veda.ng/viz-notes/${noteName}`;
}
const assetMap=new Map(manifest.videos.map(v=>[v.slug,v]));
const changes={};
const alreadyPublished=[];
for(const platform of Object.keys(LIMITS)) {
  const file=path.join(ROOT,'scripts',`viz-${platform}-posts.json`);
  const posts=JSON.parse(fs.readFileSync(file,'utf8'));
  let changed=0;
  for(const post of posts.filter(p=>p.batchId===manifest.batchId)) {
    if(post.posted) {
      alreadyPublished.push({platform,id:post.id,slug:post.slug,url:post.postUrl||null,remoteId:post.bufferPostId||post.platformPostId});
      continue;
    }
    assert.ok(!post.state,`Reconcile ${post.id} before changing its media`);
    const item=assetMap.get(post.slug);
    const caption=copy.get(post.slug);
    validateCaption(platform,caption);
    validateVideoOnlyCaption(caption);
    post[platform==='youtube'?'description':'text']=caption;
    Object.assign(post,{captionStyle:'concise-v2',video:item.video,videoSha256:item.videoSha256,
      audioAttributionRequired:false,audioLicense:item.musicLicense,audioRevision:item.audioRevision,
      notesUrl:item.notesUrl});
    for(const key of ['musicCredit','fullMusicCredit','publicNotesUrl']) delete post[key];
    changed++;
  }
  fs.writeFileSync(file,JSON.stringify(posts,null,2)+'\n');
  changes[platform]=changed;
}
manifest.captionPolicy={style:'concise-v2',format:'Hook, then actual years and metric definition',links:false,
  productionDetails:false,sourceBlocks:false,musicBlocks:false,appliesTo:'Unpublished batch-2 entries'};
manifest.alreadyPublished=alreadyPublished;
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(assets,'caption-revision-status.json'),JSON.stringify({complete:true,changes,alreadyPublished,postingPaused:true},null,2)+'\n');
console.log(JSON.stringify({changes,alreadyPublishedCount:alreadyPublished.length,captionExample:copy.get('coffee')},null,2));

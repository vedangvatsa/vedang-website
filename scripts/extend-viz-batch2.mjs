#!/usr/bin/env node
// Add the seven remaining destinations while preserving all earlier receipts.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateCaption,captionLength,LIMITS} from './viz-captions.mjs';
import {sourceCredit} from './viz-source-credit.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BATCH='2026-10-16';
const extra=['facebook','bluesky','tumblr','mastodon','farcaster','x','threads'];
const blocked={x:'Saved X credentials return HTTP 401; reauthorize before sending.',threads:'Threads access token expired on 14 October 2026; reauthorize before sending.'};
const arg=name=>process.argv.find(a=>a.startsWith(`--${name}=`))?.slice(name.length+3);
const dataDir=arg('data-dir'), delivery=arg('delivery');
if(!dataDir||!delivery) throw new Error('Supply --data-dir and --delivery');
const manifestFile=path.join(ROOT,'scripts/viz-batch2-assets/manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
const sourceQueue=JSON.parse(fs.readFileSync(path.join(ROOT,'scripts/viz-linkedin-posts.json'),'utf8')).filter(p=>p.batchId===BATCH);
assert.equal(sourceQueue.length,88);
const assets=new Map(manifest.videos.map(a=>[a.slug,a]));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const ascii=text=>text.replaceAll('—','-').replaceAll('–','-').replaceAll('’',"'");
const license='https://creativecommons.org/licenses/by/4.0/';
const compactMusic='Music by Scott Buckley, CC BY 4.0. www.scottbuckley.com.au';
const wdiLabels={
  'women-parliament':'Women in parliament (%)','tertiary-enrolment':'Tertiary enrolment (gross %)',
  'primary-teachers':'Primary pupils per teacher','private-credit':'Private credit (% GDP)',
  'electricity-use':'Electricity use (MWh/person)','undernourishment':'Undernourishment (%)',
  'air-pollution':'PM2.5 exposure','food-output':'Food output index (2014-16=100)',
  'science-papers':'Scientific articles (thousands)','primary-completion':'Primary completion (gross %)',
  'landline-phones':'Fixed phone subscriptions (millions)','public-consumption':'Government consumption (% GDP)',
  'household-consumption':'Household consumption per person','out-of-pocket-health':'Out-of-pocket share of health costs',
  'tuberculosis':'TB incidence per 100,000','hiv-prevalence':'HIV prevalence, ages 15-49 (%)',
  'nonperforming-loans':'Nonperforming loans (%)',
};
const faoLabels={coffee:'Green coffee beans',cocoa:'Cocoa beans','cotton-lint':'Ginned cotton',
  'mango-family':'Mangoes, guavas and mangosteens','broccoli-family':'Cauliflower and broccoli',
  pumpkins:'Pumpkins, squash and gourds','grapefruit-family':'Pomelos and grapefruit',
  'nutmeg-family':'Nutmeg, mace and cardamom',wool:'Greasy wool','milk-powder':'Whole milk powder'};

function compactCaption(platform,base,asset,data) {
  const topic=data.topic;
  const isFao=topic.provider==='FAOSTAT';
  const label=isFao?`${faoLabels[base.slug]||topic.title} production`:wdiLabels[base.slug];
  assert.ok(label,`Missing precise label for ${base.slug}`);
  const years=`${topic.startYear}-${topic.endYear}`;
  const provider=sourceCredit(data.metadata);
  const notes=`https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/public/viz-notes/${String(asset.number).padStart(2,'0')}.txt`;
  const leads={
    x:`${label} across countries, ${years}.`,
    bluesky:`${label} - ${years}.`,
    threads:`${years} in 30 seconds. ${label}.`,
    mastodon:`${label}, ${years}. A country-by-country view.`,
    farcaster:`Published ${label.toLowerCase()} rankings from ${topic.startYear} to ${topic.endYear}.`,
  };
  const fullMusic=`Music ${asset.musicCredit}`;
  const hook=base.text.split('\n\n')[0];
  const candidates=[];
  for(const music of [fullMusic,compactMusic]) {
    for(const noteLine of [`Notes ${notes}`,notes]) {
      if(platform==='farcaster') candidates.push({music,text:`${leads[platform]}\n\n${hook}\n\nSource ${provider}. ${topic.measure}.\n${music}\n${license}\n${noteLine}`});
      candidates.push({music,text:`${leads[platform]}\nSource ${provider}.\n${music}\n${license}\n${noteLine}`});
    }
  }
  const selected=candidates.find(c=>captionLength(platform,c.text)<=LIMITS[platform]);
  assert.ok(selected,`Cannot fit required attribution on ${platform} for ${base.slug}`);
  validateCaption(platform,selected.text);
  return {text:selected.text,musicCredit:selected.music,publicNotesUrl:notes,sourceCredit:provider};
}

const prepared=new Map();
for(const base of sourceQueue) {
  const asset=assets.get(base.slug);
  assert.equal(asset.status,'queued');
  const bytes=fs.readFileSync(path.join(dataDir,`${base.slug}.json`));
  const receipt=JSON.parse(fs.readFileSync(path.join(delivery,'verification',`${base.slug}.json`),'utf8'));
  assert.equal(hash(bytes),receipt.dataSha256,'Source metadata differs from verified video');
  assert.equal(receipt.videoSha256,asset.videoSha256);
  const data=JSON.parse(bytes);
  Object.assign(asset,{startYear:data.topic.startYear,endYear:data.topic.endYear,measure:data.topic.measure,
    indicatorName:data.topic.indicatorName,sourceDataSha256:receipt.dataSha256});
  prepared.set(base.slug,{asset,data});
}

const stats={};
const queues=new Map();
for(const platform of extra) {
  const file=path.join(ROOT,'scripts',`viz-${platform}-posts.json`);
  const posts=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.ok(!posts.some(p=>p.batchId===BATCH),`${platform} already contains this batch; do not reset state`);
  const previous=JSON.stringify(posts);
  for(const base of sourceQueue) {
    const {asset,data}=prepared.get(base.slug);
    let text,musicCredit=asset.musicCredit,publicNotesUrl,provider;
    if(platform==='facebook'||platform==='tumblr') {
      const paragraphs=base.text.split('\n\n').filter(p=>!p.startsWith('This 30-second comparison follows')&&!/^#\w/.test(p));
      const lead=platform==='facebook'
        ? `${asset.title}, ${data.topic.startYear}-${data.topic.endYear}, in motion.`
        : `${asset.title} - country data from ${data.topic.startYear} to ${data.topic.endYear}.`;
      text=ascii(`${lead}\n\n${paragraphs.join('\n\n')}`);
    } else {
      const compact=compactCaption(platform,base,asset,data);
      ({text,musicCredit,publicNotesUrl,sourceCredit:provider}=compact);
    }
    validateCaption(platform,text);
    const post={id:`viz-b2-${platform}-${String(asset.number).padStart(2,'0')}`,batchId:BATCH,slug:base.slug,
      video:base.video,thumbnail:base.thumbnail,title:base.title,text,
      scheduleDate:base.scheduleDate,scheduleTime:base.scheduleTime,posted:false,postedAt:null,error:null,
      notesUrl:base.notesUrl,captionStyle:platform==='facebook'||platform==='tumblr'?'licensed-v2':'licensed-short-v2',
      indicator:base.indicator,sourceUrl:base.sourceUrl,sourceOrganization:base.sourceOrganization,
      musicCredit,videoSha256:base.videoSha256,altText:base.altText,
      ...(publicNotesUrl?{publicNotesUrl,sourceCredit:provider,fullMusicCredit:asset.musicCredit}:{}),
      ...(platform==='tumblr'?{tags:['data visualization',base.slug]}:{}),
      ...(blocked[platform]?{paused:true,pauseReason:blocked[platform]}:{})};
    posts.push(post);
  }
  assert.equal(JSON.stringify(posts.slice(0,50)),previous,'Earlier receipts were modified');
  // Preserve the unresolved historical records but prevent old topics replaying
  // once the accounts reconnect. Their original state/error fields remain intact.
  if(blocked[platform]) for(const old of posts.filter(p=>!p.batchId&&!p.posted)) {
    old.paused=true;
    old.pauseReason='Earlier campaign backlog retained for audit; the October batch is the active campaign.';
  }
  assert.equal(posts.length,138);
  assert.equal(new Set(posts.map(p=>p.id)).size,138);
  queues.set(file,posts);
  stats[platform]={queued:88,paused:Boolean(blocked[platform]),maximumCaptionLength:Math.max(...posts.filter(p=>p.batchId===BATCH).map(p=>captionLength(platform,p.text)))};
}
manifest.platforms=Object.keys(LIMITS);
manifest.blockedPlatforms=blocked;
manifest.expandedAt=new Date().toISOString();
for(const [file,posts] of queues) fs.writeFileSync(file,JSON.stringify(posts,null,2)+'\n');
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(stats,null,2));

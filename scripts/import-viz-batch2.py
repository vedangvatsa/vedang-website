#!/usr/bin/env python3
"""Append the checked second batch without changing earlier publication receipts."""
import argparse
import csv
import hashlib
import json
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
BATCH='2026-10-16'
PLATFORMS={'youtube':'yt','instagram':'ig','tiktok':'tt','linkedin':'linkedin'}
HOLDS={
    'bank-atms':'Sharp Peru/Uruguay discontinuities need independent corroboration before publication.',
    'secure-servers':'On-screen wording needs to identify TLS/SSL certificates more explicitly before publication.'
}
SLOTS=['09:00','14:00','20:00']

def write_json(file,data):
    file.parent.mkdir(parents=True,exist_ok=True)
    file.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def digest(file):
    with file.open('rb') as handle:
        return hashlib.file_digest(handle,'sha256').hexdigest()

def normalize_caption(text,platform,is_fao):
    # The YouTube title is supplied separately in the API payload.
    if platform=='youtube':
        text=text.split('\n\n',1)[1]
    text=text.replace("\n\n'","\n\nMusic '")
    if is_fao and platform!='youtube':
        # The existing validator counts the FAOSTAT URL fragment as a hashtag.
        # Keep the exact source URL and one discoverability hashtag.
        lines=text.splitlines()
        if lines[-1].startswith('#'):
            lines[-1]=lines[-1].split()[0]
        text='\n'.join(lines)
    return text.strip()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--delivery',type=Path,required=True)
    parser.add_argument('--data-dir',type=Path,required=True)
    args=parser.parse_args()
    final=json.loads((args.delivery/'verification/final-check.json').read_text())
    assert final['complete'] and final['videos']==90
    summary=json.loads((args.delivery/'verification.json').read_text())
    assert summary['sourceMismatches']==0
    receipts={r['slug']:r for r in summary['videos']}
    handoff=json.loads((args.delivery/'social-captions.json').read_text())
    by_slug={p['slug']:p for p in handoff}
    metadata={p['slug']:json.loads((args.data_dir/f'{p["slug"]}.json').read_text()) for p in handoff}
    assert len(by_slug)==90 and set(HOLDS)<=set(by_slug)
    available=[p for p in handoff if p['slug'] not in HOLDS]
    fao=[p for p in available if metadata[p['slug']]['topic'].get('provider')=='FAOSTAT' and p['slug']!='coffee']
    wdi=[p for p in available if metadata[p['slug']]['topic'].get('provider')!='FAOSTAT']
    order=[by_slug['coffee']]
    while wdi or fao:
        if wdi: order.append(wdi.pop(0))
        for _ in range(4):
            if fao: order.append(fao.pop(0))
    assert len(order)==88 and len({p['slug'] for p in order})==88
    ist=timezone(timedelta(hours=5,minutes=30))
    now=datetime.now(ist)
    current=[s for s in SLOTS if s<=now.strftime('%H:%M')]
    day=now.date() if current else now.date()-timedelta(days=1)
    slot=current[-1] if current else SLOTS[-1]
    start=datetime.fromisoformat(f'{day.isoformat()}T{slot}:00').replace(tzinfo=ist)
    dates=[]
    cursor=start
    for _ in order:
        dates.append((cursor.strftime('%Y-%m-%d'),cursor.strftime('%H:%M')))
        index=SLOTS.index(cursor.strftime('%H:%M'))
        next_day=cursor.date()+(timedelta(days=1) if index==2 else timedelta())
        cursor=datetime.fromisoformat(f'{next_day.isoformat()}T{SLOTS[(index+1)%3]}:00').replace(tzinfo=ist)
    asset_dir=ROOT/'scripts/viz-batch2-assets'
    (asset_dir/'videos').mkdir(parents=True,exist_ok=True)
    (asset_dir/'previews').mkdir(exist_ok=True)
    manifest=[]
    for entry in handoff:
        slug=entry['slug']; receipt=receipts[slug]
        number=int(entry['filename'].split('-')[0])
        data=metadata[slug]
        item={'slug':slug,'number':number,'title':data['topic']['title'],'indicator':entry['indicator'],
              'sourceUrl':entry['sourceUrl'],'videoSha256':entry['videoSha256'],'musicCredit':receipt['soundtrack']['credit'].replace('–','-').replace('—','-').replace('’',"'"),
              'musicSource':receipt['soundtrack']['source'],'musicLicense':receipt['soundtrack']['license'],
              'sourceOrganization':data['metadata']['sourceOrganization'],'status':'held' if slug in HOLDS else 'queued'}
        if slug in HOLDS:
            item['holdReason']=HOLDS[slug]
        else:
            video=args.delivery/entry['filename']
            assert digest(video)==entry['videoSha256']==receipt['videoSha256'],slug
            target=asset_dir/'videos'/video.name
            if not target.exists(): shutil.copyfile(video,target)
            assert digest(target)==entry['videoSha256']
            shutil.copyfile(args.delivery/'previews'/f'{slug}.png',asset_dir/'previews'/f'{slug}.png')
            notes=(args.delivery/'sources'/f'{slug}.description.md').read_text()
            notes+='\n\nMusic '+item['musicCredit']+'\n'+receipt['soundtrack']['licenseUrl']+'\n'+receipt['soundtrack']['source']+'\nExcerpt edited with fades and loudness adjustment.\n'
            (ROOT/'public/viz-notes'/f'{number:02}.txt').write_text(notes.replace('–','-').replace('—','-'))
            item.update(video=str(target.relative_to(ROOT)),thumbnail=f'scripts/viz-batch2-assets/previews/{slug}.png',notesUrl=f'https://veda.ng/viz-notes/{number:02}.txt')
        manifest.append(item)
    manifest_by_slug={p['slug']:p for p in manifest}
    for platform,prefix in PLATFORMS.items():
        queue_file=ROOT/'scripts'/f'viz-{platform}-posts.json'
        posts=json.loads(queue_file.read_text())
        existing=[p for p in posts if p.get('batchId')==BATCH]
        assert not existing, f'{platform} batch already exists; do not reset publication state'
        assert all(p['posted'] for p in posts), f'{platform} has unresolved earlier posts'
        previous=list(posts)
        for entry,(date,slot) in zip(order,dates):
            slug=entry['slug']; record=manifest_by_slug[slug]; data=metadata[slug]
            caption=normalize_caption(entry['platforms'][platform],platform,data['topic'].get('provider')=='FAOSTAT')
            post={'id':f'viz-b2-{prefix}-{record["number"]:02}','batchId':BATCH,'slug':slug,
                  'video':record['video'],'thumbnail':record['thumbnail'],
                  'title':f'{data["topic"]["title"]} | {data["topic"]["startYear"]}-{data["topic"]["endYear"]}',
                  'description' if platform=='youtube' else 'text':caption,
                  'scheduleDate':date,'scheduleTime':slot,'posted':False,'postedAt':None,'error':None,
                  'notesUrl':record['notesUrl'],'captionStyle':'licensed-v2','indicator':entry['indicator'],
                  'sourceUrl':entry['sourceUrl'],'sourceOrganization':data['metadata']['sourceOrganization'],
                  'musicCredit':record['musicCredit'],'videoSha256':entry['videoSha256'],
                  'altText':f'{data["topic"]["title"]}, {data["topic"]["startYear"]}-{data["topic"]["endYear"]}. Highest reported values each year.'}
            posts.append(post)
        assert posts[:len(previous)]==previous
        assert len({p['id'] for p in posts})==len(posts)
        write_json(queue_file,posts)
    write_json(asset_dir/'manifest.json',{'batchId':BATCH,'createdAt':datetime.now(timezone.utc).isoformat(),
         'totalProduced':90,'queuedPerPlatform':88,'platforms':list(PLATFORMS),'timezone':'Asia/Kolkata','slots':SLOTS,
         'firstDue':dates[0],'lastDue':dates[-1],'holds':HOLDS,'videos':manifest,
         'sourceChecks':{'observationsCompared':summary['sourceObservationsCrossChecked'],'frameStatesChecked':summary['videoFramesVerified'],'mismatches':0}})
    print(json.dumps({'queuedPerPlatform':88,'platforms':list(PLATFORMS),'first':'coffee','firstDue':dates[0],'lastDue':dates[-1],'held':list(HOLDS)},indent=2))

if __name__=='__main__': main()

#!/usr/bin/env python3
"""Mux per-video soundtracks into the 50 viz videos (reusable for future batches).

- Downloads each catalog track (browser headers; Chosic blocks plain curl).
- Mixes first 30s with 2s fades, loudness-normalized to -16 LUFS.
- Video stream is copied untouched (-c:v copy): every pixel identical.
- Overwrites posting copies AND Desktop archive, then refreshes the
  Desktop verification receipts' videoSha256 (+ soundtrack note) and
  appends the CC-BY credit to Desktop source descriptions.

Usage:
  python3 scripts/mux-viz-music.py --catalog scripts/viz-assets/music-catalog.json \\
      --manifest /Users/vedang/Desktop/vedang-viz-videos/upload-manifest.csv \\
      --videos-dir scripts/viz-assets/videos --tracks-dir scripts/viz-assets/music \\
      --desktop-dir /Users/vedang/Desktop/vedang-viz-videos
"""
import argparse
import csv
import hashlib
import json
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError(f'{" ".join(cmd[:3])} failed: {r.stderr[-500:]}')
    return r


def download(url, dest):
    req = urllib.request.Request(url, headers={
        'User-Agent': UA, 'Referer': 'https://www.chosic.com/',
        'Accept': 'audio/mpeg,audio/*,*/*'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                if resp.status != 200:
                    raise RuntimeError(f'HTTP {resp.status}')
                dest.write_bytes(resp.read())
            probe = json.loads(run(['ffprobe', '-v', 'error', '-show_entries',
                                    'format=duration', '-of', 'json',
                                    str(dest)]).stdout)
            dur = float(probe['format']['duration'])
            assert dur >= 30, f'track too short: {dur}s'
            return dur
        except Exception as e:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError('unreachable')


def slug_of(filename):
    s = re.sub(r'^\d+-', '', filename)
    return re.sub(r'-\d{4}-\d{4}\.mp4$', '', s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--catalog', required=True)
    ap.add_argument('--manifest', required=True)
    ap.add_argument('--videos-dir', required=True)
    ap.add_argument('--tracks-dir', required=True)
    ap.add_argument('--desktop-dir', required=True)
    ap.add_argument('--start-at', type=int, default=1,
                    help='1-based topic index to resume from')
    ap.add_argument('--end-at', type=int, default=50,
                    help='1-based final topic index, inclusive')
    a = ap.parse_args()

    catalog = json.loads(Path(a.catalog).read_text())
    review_path = Path(a.catalog).with_name('music-license-review.json')
    if review_path.exists():
        overrides = json.loads(review_path.read_text()).get('tracks', {})
        catalog = [{**track, **overrides.get(str(i + 1), {})} for i, track in enumerate(catalog)]
    assert len(catalog) == 50, f'expected 50 tracks, got {len(catalog)}'
    assert len({t['mp3_url'] for t in catalog}) == 50, 'duplicate tracks!'
    assert len({(t['artist'].lower(), t['title'].lower()) for t in catalog}) == 50, 'duplicate track titles!'
    videos_dir = Path(a.videos_dir)
    tracks_dir = Path(a.tracks_dir)
    tracks_dir.mkdir(parents=True, exist_ok=True)
    desktop = Path(a.desktop_dir)

    with open(a.manifest, newline='') as f:
        rows = list(csv.DictReader(f))
    assert len(rows) == 50, f'expected 50 manifest rows, got {len(rows)}'

    summary = []
    for i, (track, row) in enumerate(zip(catalog, rows)):
        if i + 1 < a.start_at or i + 1 > a.end_at:
            continue
        assert track['topic_index'] == i + 1, f'catalog order broken at row {i}'
        slug = slug_of(row['filename'])
        video = videos_dir / row['filename']
        assert video.exists(), f'missing video {video}'
        mp3 = tracks_dir / track.get('cache_file', f"{i+1:02d}-{slug}.mp3")
        if not mp3.exists():
            print(f'[{i+1:02d}] downloading {track["title"]} ...', flush=True)
            download(track['mp3_url'], mp3)
        else:
            print(f'[{i+1:02d}] track cached: {mp3.name}', flush=True)

        tmp = video.with_suffix('.mux.mp4')
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
             '-i', str(video), '-i', str(mp3),
             '-filter_complex',
             '[1:a]atrim=0:30,asetpts=PTS-STARTPTS,'
             'afade=t=in:st=0:d=2,afade=t=out:st=28:d=2,'
             'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100,'
             'aformat=channel_layouts=stereo[a]',
             '-map', '0:v:0', '-map', '[a]', '-dn', '-sn',
             '-map_chapters', '-1', '-map_metadata', '-1',
             '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k',
             '-shortest', '-movflags', '+faststart', str(tmp)])
        probe = json.loads(run(['ffprobe', '-v', 'error', '-show_entries',
                                'format=duration:stream=codec_type,codec_name',
                                '-of', 'json', str(tmp)]).stdout)
        assert abs(float(probe['format']['duration']) - 30.0) < 0.05, 'bad duration'
        kinds = sorted(s['codec_type'] + ':' + s['codec_name']
                       for s in probe['streams'])
        assert kinds == ['audio:aac', 'video:h264'], f'bad streams: {kinds}'
        tmp.replace(video)

        # Mirror into the Desktop archive + refresh audit trail.
        arc = desktop / row['filename']
        arc.write_bytes(video.read_bytes())
        new_sha = sha256(arc)
        row['video_sha256'] = new_sha
        receipt_path = desktop / 'verification' / f'{slug}.json'
        receipt = json.loads(receipt_path.read_text())
        receipt['videoSha256'] = new_sha
        receipt['soundtrack'] = {
            'track': track['title'], 'artist': track['artist'],
            'license': track['license'], 'source': track['page_url'],
            'mix': 'first 30s, 2s fades, -16 LUFS, video stream untouched',
        }
        receipt_path.write_text(json.dumps(receipt, indent=2) + '\n')
        credit = '\nMusic: ' + track.get('attribution', f"{track['title']} by {track['artist']} ({track['license']})")
        credit += f"\n{track['page_url']}\n30-second excerpt with fades and adjusted loudness.\n"
        desc_path = desktop / 'sources' / f'{slug}.description.txt'
        desc = desc_path.read_text()
        desc_path.write_text(desc.split('\nMusic:')[0].rstrip() + '\n' + credit)
        summary.append((slug, track['title'], track['artist'], new_sha[:12]))

    if summary:
        with open(a.manifest, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=list(rows[0]))
            writer.writeheader()
            writer.writerows(rows)
    print(f'\nMixed {len(summary)} videos. Video streams copied untouched.')
    for slug, title, artist, sha in summary:
        print(f'  {slug:22s} {title} — {artist}  [{sha}]')


if __name__ == '__main__':
    sys.exit(main())

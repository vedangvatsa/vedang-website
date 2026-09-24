#!/usr/bin/env python3
"""Inspect every campaign MP4 without modifying it. Requires ffprobe and ffmpeg."""
import hashlib
import json
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / 'scripts/viz-assets/videos'


def inspect(file):
    p = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                        '-of', 'json', str(file)], capture_output=True, text=True, check=True)
    data = json.loads(p.stdout)
    video = [s for s in data['streams'] if s['codec_type'] == 'video']
    audio = [s for s in data['streams'] if s['codec_type'] == 'audio']
    assert len(data['streams']) == 2 and len(video) == len(audio) == 1, f'{file.name}: unexpected streams'
    assert (video[0]['codec_name'], video[0]['width'], video[0]['height']) == ('h264', 1080, 1920), file.name
    assert audio[0]['codec_name'] == 'aac' and audio[0]['channels'] == 2, file.name
    assert abs(float(data['format']['duration']) - 30) < .1, file.name
    volume = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', str(file),
                             '-vn', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    maximum = re.search(r'max_volume: ([-\d.]+) dB', volume.stderr)
    assert maximum and float(maximum[1]) > -60, f'{file.name}: missing/silent soundtrack'
    return file.name, hashlib.sha256(file.read_bytes()).hexdigest()


def main():
    files = sorted(VIDEOS.glob('*.mp4'))
    assert len(files) == 50, f'Expected 50 videos, found {len(files)}'
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(inspect, files))
    catalog = json.loads((ROOT / 'scripts/viz-assets/music-catalog.json').read_text())
    assert len({p['mp3_url'] for p in catalog}) == 50, 'Duplicate catalog track URLs'
    print(f'PASS {len(results)} videos: H.264 1080x1920, 30 seconds, stereo AAC, non-silent audio.')
    print('50 distinct catalog tracks. This checks audio presence, not licensing or track identity.')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Build the essay's public data and SVGs from the verified IPIP-50 study.

Usage: python3 scripts/prepare-personality-assets.py --study-root PATH
No inference, authenticated requests, or private credential files are used.
"""

import argparse
import csv
import hashlib
import json
import shutil
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SVG_NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', SVG_NS)
INK, MUTED, LINE = '#37352f', '#52525b', '#e3e3e0'
INDIGO, AMBER = '#4f46e5', '#b45309'
TRAITS = ['Extraversion', 'Agreeableness', 'Conscientiousness', 'Emotional Stability', 'Intellect/Imagination']
ABBR = ['E', 'A', 'C', 'ES', 'I']


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rounded(value, places=2):
    return str(Decimal(str(value)).quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP))


def element(parent, tag, attrs=None, text=None):
    node = ET.SubElement(parent, '{' + SVG_NS + '}' + tag, {key: str(value) for key, value in (attrs or {}).items()})
    node.text = text
    return node


def label(parent, x, y, text, size=24, color=INK, weight=400, anchor='start'):
    return element(parent, 'text', {'x': x, 'y': y, 'font-size': size, 'fill': color, 'font-weight': weight, 'text-anchor': anchor}, text)


def canvas(title, description, height=400):
    root = ET.Element('{' + SVG_NS + '}svg', {'width': '800', 'height': str(height), 'viewBox': f'0 0 800 {height}',
                      'role': 'img', 'aria-labelledby': 'chart-title chart-description', 'font-family': 'Arial, Helvetica, sans-serif'})
    element(root, 'title', {'id': 'chart-title'}, title)
    element(root, 'desc', {'id': 'chart-description'}, description)
    element(root, 'rect', {'width': 800, 'height': height, 'fill': '#ffffff'})
    label(root, 34, 48, title, 29, weight=700)
    return root


def save_svg(root, path):
    ET.indent(root)
    ET.ElementTree(root).write(path, encoding='utf-8', xml_declaration=True)


def axis(root, y, x0=250, width=470):
    for tick in range(1, 6):
        x = x0 + (tick - 1) / 4 * width
        element(root, 'line', {'x1': x, 'x2': x, 'y1': 100, 'y2': y, 'stroke': LINE})
        label(root, x, y + 28, str(tick), 22, MUTED, anchor='middle')
    label(root, x0 + width / 2, y + 60, 'Keyed score on the 1 to 5 scale', 22, MUTED, anchor='middle')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--study-root', type=Path, required=True)
    args = parser.parse_args()
    study = args.study_root.resolve()
    results = study / 'results/overall'
    data_dir = ROOT / 'public/research/personality'
    images = ROOT / 'public/images/essays'
    data_dir.mkdir(parents=True, exist_ok=True)
    source_hashes = {}

    def read_json(relative):
        path = study / relative
        source_hashes[relative] = sha(path)
        return json.loads(path.read_text())

    def read_csv(name):
        path = results / name
        source_hashes[str(path.relative_to(study))] = sha(path)
        with path.open() as stream:
            return list(csv.DictReader(stream))

    summary = read_json('results/overall/summary.json')
    verification = read_json('results/overall/verification.json')
    assert verification['independent_raw_reader_agrees'] and verification['frozen_hashes_verified']
    assert sha(study / 'template.pdf') == verification['pdf']['sha256']
    assert sha(study / 'ipip50_comparison.md') == verification['manuscript_sha256']
    assert (summary['main_configurations'], summary['usable_sets'], summary['reported_trait_estimates'], summary['complete_profiles']) == (55, 422, 178, 22)
    deep_verification = read_json('results/overall/deep/verification.json')
    for name, digest in deep_verification['data_sha256'].items():
        assert sha(results / 'deep' / name) == digest, name

    coverage = read_csv('coverage.csv')
    profiles = {(r['model_id'], r['trait']): r for r in read_csv('all_profiles.csv')}
    domains = read_csv('domain_summary.csv')
    pairs = {(r['left_id'], r['right_id'], r['trait']): r for r in read_csv('deep/pair_stability.csv')}
    bounds = {(r['model_id'], r['trait']): r for r in read_csv('deep/completion_bounds.csv')}
    missing = {int(r['item']): r for r in read_csv('item_missingness.csv')}

    models = []
    for row in sorted(coverage, key=lambda r: r['model'].casefold()):
        values = []
        for trait, abbr in zip(TRAITS, ABBR):
            p = profiles[(row['model_id'], trait)]
            eligible = p['eligible'] == 'True'
            values.append({'name': trait, 'abbr': abbr, 'mean': rounded(p['mean']) if eligible else None,
                           'sd': rounded(p['sd']) if eligible else None, 'n': int(p['n']), 'eligible': eligible})
        models.append({'id': row['model_id'], 'name': row['model'], 'planned': int(row['planned']), 'usable': int(row['valid_sets']),
                       'required': int(row['minimum_n']), 'eligibleTraits': int(row['eligible_traits']), 'traits': values})
    assert len(models) == 55 and sum(m['eligibleTraits'] for m in models) == 178
    assert sum(m['eligibleTraits'] == 5 for m in models) == 22

    comparisons = []
    for a, b, trait in [('m23', 'm24', TRAITS[0]), ('m23', 'm24', TRAITS[2]), ('m50', 'm52', TRAITS[0]), ('m46', 'm52', TRAITS[0])]:
        row = pairs[(a, b, trait)]
        positive = Decimal(row['point_difference']) > 0
        reverse = int(row['right_higher'] if positive else row['left_higher'])
        total, tied = int(row['cartesian_pairs']), int(row['tied'])
        comparisons.append({'left': row['left'], 'right': row['right'], 'trait': trait, 'difference': rounded(row['point_difference']),
                            'pairs': total, 'retained': total - reverse - tied, 'reversed': reverse, 'ties': tied})
    assert comparisons[-1]['retained'] == 60 and comparisons[-1]['reversed'] == 40

    bundle = {'studyVersion': 'ALL-9', 'paperTitle': verification['manuscript_title'],
              'paperUrl': '/research/personality/paper.pdf', 'supplementUrl': '/research/personality/supplement.html',
              'scope': {'models': 55, 'attempts': 460, 'usable': 422, 'withAnyScore': 47, 'completeProfiles': 22, 'commonPattern': 20},
              'traits': [{'name': trait, 'abbr': abbr} for trait, abbr in zip(TRAITS, ABBR)],
              'domainSummary': [{'name': r['trait'], 'models': int(r['models']), 'median': rounded(r['median'])} for r in domains],
              'comparisons': comparisons,
              'missingItems': [{'item': i, 'statement': missing[i]['text'], 'nulls': int(missing[i]['nulls']),
                                'percentage': rounded(100 * Decimal(missing[i]['nulls']) / Decimal(422), 1)} for i in (8, 28, 1, 31)],
              'models': models}
    encoded = json.dumps(bundle, ensure_ascii=False, indent=2) + '\n'
    (data_dir / 'data.json').write_text(encoded)
    (ROOT / 'src/lib/personality-data.json').write_text(encoded)

    hero = canvas('Which models produced reportable profiles?', '55 tested configurations; 47 have at least one eligible trait; 22 have all five.', 400)
    for x, value, line1, line2 in [(34, 55, 'Configurations', 'in the comparison'), (292, 47, 'At least one', 'reportable trait'), (550, 22, 'All five traits', 'reportable')]:
        element(hero, 'rect', {'x': x, 'y': 100, 'width': 216, 'height': 200, 'rx': 10, 'fill': '#eef2ff', 'stroke': '#c7d2fe'})
        label(hero, x + 108, 185, str(value), 68, INDIGO, 700, 'middle')
        label(hero, x + 108, 234, line1, 23, anchor='middle')
        label(hero, x + 108, 266, line2, 22, MUTED, anchor='middle')
    label(hero, 400, 355, 'A complete answer map can still leave a trait unscored.', 24, anchor='middle')
    save_svg(hero, images / 'personality-coverage.svg')

    coverage_chart = canvas('Trait coverage across the 55 configurations', 'Eligible model counts differ by trait; the source data also accompany the essay.', 570)
    for i, row in enumerate(bundle['domainSummary']):
        y = 100 + i * 88
        label(coverage_chart, 34, y, row['name'], 24)
        label(coverage_chart, 766, y, f"{row['models']} / 55", 24, INDIGO, 700, 'end')
        element(coverage_chart, 'rect', {'x': 34, 'y': y + 16, 'width': 732, 'height': 23, 'rx': 4, 'fill': '#f1f5f9'})
        element(coverage_chart, 'rect', {'x': 34, 'y': y + 16, 'width': 732 * row['models'] / 55, 'height': 23, 'rx': 4, 'fill': INDIGO, 'fill-opacity': '.75'})
    label(coverage_chart, 34, 548, 'Counts of reportable traits, not personality scores', 22, MUTED)
    save_svg(coverage_chart, images / 'personality-trait-coverage.svg')

    gemma = canvas('Two Gemma profiles', 'Gemma 3 4B has higher Extraversion; Gemma 3 12B has higher Conscientiousness. Both use ten complete assessments per trait.', 440)
    axis(gemma, 320)
    for y, trait in [(175, TRAITS[0]), (280, TRAITS[2])]:
        a, b = [float(profiles[(mid, trait)]['mean']) for mid in ('m23', 'm24')]
        x1, x2 = [250 + (v - 1) / 4 * 470 for v in (a, b)]
        label(gemma, 32, y + 8, trait, 23)
        element(gemma, 'line', {'x1': x1, 'x2': x2, 'y1': y, 'y2': y, 'stroke': '#a1a1aa', 'stroke-width': 4})
        for x, v, color in [(x1, a, INDIGO), (x2, b, AMBER)]:
            element(gemma, 'circle', {'cx': x, 'cy': y, 'r': 8, 'fill': color})
            label(gemma, x, y - 18, rounded(v), 24, color, 700, 'middle')
    label(gemma, 270, 412, 'Gemma 3 4B', 23, INDIGO)
    label(gemma, 525, 412, 'Gemma 3 12B', 23, AMBER)
    save_svg(gemma, images / 'personality-gemma.svg')

    stability = canvas('Does the recorded ordering hold?', 'Selected three-score subset comparisons. Gemini Flash-Lite versus MiniMax reverses in 40 of 100 pairings. Other displayed examples have no reversal.', 560)
    selected = [(comparisons[0], 'Gemma 3 4B / Gemma 3 12B'), (comparisons[2], 'Qwen3.8 Max Prime / MiniMax M3'), (comparisons[3], 'Gemini 3.5 Flash-Lite / MiniMax M3')]
    for i, (row, name) in enumerate(selected):
        y = 110 + 132 * i
        label(stability, 34, y, name, 23, weight=700)
        share = row['retained'] / row['pairs']
        element(stability, 'rect', {'x': 34, 'y': y + 18, 'width': 732 * share, 'height': 32, 'fill': INDIGO})
        if share < 1:
            element(stability, 'rect', {'x': 34 + 732 * share, 'y': y + 18, 'width': 732 * (1 - share), 'height': 32, 'fill': AMBER})
        label(stability, 34, y + 80, f"{row['retained']:,} retained / {row['pairs']:,} comparisons", 22, MUTED)
    label(stability, 34, 505, 'Retained', 23, INDIGO, 700)
    label(stability, 185, 505, 'Reversed', 23, AMBER, 700)
    label(stability, 34, 540, 'Extraversion examples. Reused responses, not new trials.', 22, MUTED)
    save_svg(stability, images / 'personality-orderings.svg')

    limits = canvas('What incomplete answers can still determine', 'Kimi K3 has non-overlapping Extraversion and Conscientiousness completion bounds; Claude Opus bounds overlap.', 610)
    axis(limits, 490)
    for y, mid, title in [(120, 'm56', 'Kimi K3'), (330, 'm53', 'Claude Opus 5.5')]:
        label(limits, 34, y, title, 26, weight=700)
        for dy, trait, color in [(65, TRAITS[0], INDIGO), (130, TRAITS[2], AMBER)]:
            row = bounds[(mid, trait)]
            lo, hi = Decimal(row['lower']), Decimal(row['upper'])
            a, b = [250 + (float(v) - 1) / 4 * 470 for v in (lo, hi)]
            label(limits, 34, y + dy + 7, trait, 22)
            element(limits, 'line', {'x1': a, 'x2': b, 'y1': y + dy, 'y2': y + dy, 'stroke': color, 'stroke-width': 12, 'stroke-linecap': 'round'})
            label(limits, (a + b) / 2, y + dy - 20, f'{rounded(lo)} to {rounded(hi)}', 22, color, 700, 'middle')
    label(limits, 34, 588, 'Hypothetical completions over all planned item positions', 21, MUTED)
    save_svg(limits, images / 'personality-bounds.svg')

    copies = {'template.pdf': 'paper.pdf', 'supplement.html': 'supplement.html',
              'results/overall/reported_profiles.csv': 'reported-profiles.csv', 'results/overall/coverage.csv': 'coverage.csv',
              'results/overall/deep/pair_stability.csv': 'pair-stability.csv', 'results/overall/deep/completion_bounds.csv': 'completion-bounds.csv'}
    for relative, filename in copies.items():
        source = study / relative
        source_hashes[relative] = sha(source)
        shutil.copy2(source, data_dir / filename)
    artifact_hashes = {str(path.relative_to(ROOT / 'public')): sha(path) for path in sorted(data_dir.iterdir()) if path.is_file() and path.name != 'manifest.json'}
    artifact_hashes.update({str(path.relative_to(ROOT / 'public')): sha(path) for path in sorted(images.glob('personality-*.svg'))})
    manifest = {'sourceVersion': 'ALL-9', 'sourceManuscriptSha256': verification['manuscript_sha256'], 'sourceFiles': source_hashes,
                'publicArtifacts': artifact_hashes, 'scope': 'Verified study results and selected illustrative contrasts. No credentials, request headers, or unfinished-pilot outcomes are published in this asset set.'}
    (data_dir / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Prepared {len(models)} model profiles, five data-derived SVGs, and six research downloads')


if __name__ == '__main__':
    main()

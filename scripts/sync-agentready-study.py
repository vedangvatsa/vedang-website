"""Build the essay's public aggregates and figures from the verified study bundle.

Usage: python3 scripts/sync-agentready-study.py /path/to/agentic-web-readiness [--check]
Only aggregates, the paper, and its selection supplement are copied into public/.
The raw domain records stay in the research project.
"""
import argparse
from decimal import Decimal, ROUND_HALF_UP
import hashlib
import json
from pathlib import Path
import re
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
CORPUS_SHA256 = 'dcb64ceee96147bd4f0970ecd6ebdb7f6121d7be61c2af53c722bde1582206de'


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1 << 20), b''):
            value.update(block)
    return value.hexdigest()


def percentage(count, total):
    value = (Decimal(count) * 100 / total).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    return f'{value}%'


def text(x, y, value, size=22, color='#37352f', weight=400, anchor='start'):
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" '
            f'font-weight="{weight}" text-anchor="{anchor}">{escape(str(value))}</text>')


def svg(title, description, height, elements):
    return '\n'.join([
        f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="{height}" viewBox="0 0 800 {height}" role="img" aria-labelledby="title description">',
        f'<title id="title">{escape(title)}</title>',
        f'<desc id="description">{escape(description)}</desc>',
        f'<rect width="800" height="{height}" fill="#ffffff"/>',
        '<g font-family="Inter, Arial, sans-serif">', *elements, '</g>', '</svg>', '',
    ])


def figures(report):
    profile, n = report['readiness_profile'], report['n']
    any_count = n - report['joint_counts'][0]['count']
    cards = [
        (percentage(profile['indicators']['access-js-hydration']['pass'], n), 'Text-length check'),
        (percentage(profile['joint_access']['pass'], n), 'Text + both HTTP-200 checks'),
        (percentage(any_count, n), 'At least one selected check'),
        (percentage(profile['indicators']['openapi-spec']['pass'], n), 'OpenAPI version marker'),
    ]
    elements = [text(32, 42, 'Recorded signals from 50,000 domains', 30, weight=700),
                text(32, 77, 'Sample shares under the stated matching rules', 21, '#64748b')]
    for i, (value, label) in enumerate(cards):
        x, y = 24 + (i % 2) * 388, 108 + (i // 2) * 124
        elements += [f'<rect x="{x}" y="{y}" width="364" height="112" rx="8" fill="#f8fafc" stroke="#e3e3e0"/>',
                     text(x + 20, y + 55, value, 46, '#4f46e5', 700),
                     text(x + 20, y + 90, label, 21)]
    elements.append(text(32, 380, 'September 3-4, 2026 | veda.ng/agentready', 19, '#64748b'))
    result = {'agentready-adoption.svg': svg('Recorded public-web check matches',
              'Four separate rules and combinations, all using 50,000 domains as the denominator.', 400, elements)}

    colors = ('#4f46e5', '#0f766e', '#b45309')
    labels = ('llms.txt', 'Markdown', 'MCP marker')
    elements = [text(32, 40, 'Pass rates within each rank group', 29, weight=700)]
    for i, (label, color) in enumerate(zip(labels, colors)):
        x = 32 + 238 * i
        elements += [f'<rect x="{x}" y="65" width="16" height="16" fill="{color}"/>',
                     text(x + 26, 81, label, 21)]
    for i, row in enumerate(report['rank_comparison']):
        y = 122 + 105 * i
        elements += [text(32, y + 28, f'Ranks {row["rank"]}', 20, weight=600),
                     text(32, y + 57, f'n = {row["n"]:,}', 19, '#64748b')]
        for j, (cid, color) in enumerate(zip(report['focal_checks_in_bit_order'], colors)):
            outcome = row['checks'][cid]
            width = 480 * outcome['pass'] / row['n'] * 100 / 8
            elements += [f'<rect x="266" y="{y + j * 26}" width="{width:.3f}" height="18" fill="{color}" opacity="0.75"/>',
                         text(f'{274 + width:.3f}', y + j * 26 + 16, percentage(outcome['pass'], row['n']), 19)]
    elements.append('<line x1="266" y1="422" x2="746" y2="422" stroke="#e3e3e0"/>')
    for tick in range(0, 9, 2):
        elements.append(text(266 + tick * 60, 447, f'{tick}%', 19, '#64748b', anchor='middle'))
    elements.append(text(32, 474, 'Recorded labels | September 2026 | veda.ng/agentready', 18, '#64748b'))
    result['agentready-tiers.svg'] = svg('Selected check profiles by Tranco rank',
        'Within-group pass percentages for llms.txt, Markdown, and basic MCP markers. Exact values also appear in the essay table.', 480, elements)

    elements = [text(32, 40, 'How the three selected checks overlap', 28, weight=700),
                text(32, 76, f'{any_count:,} pass at least one; {report["joint_counts"][0]["count"]:,} pass none.', 22, '#64748b')]
    for i, (label, row) in enumerate(zip(('One check', 'Two checks', 'All three'), report['joint_counts'][1:])):
        y = 124 + i * 70
        width = 480 * row['count'] / 3000
        elements += [text(32, y + 27, label, 24),
                     f'<rect x="220" y="{y}" width="{width:.3f}" height="36" fill="#4f46e5" opacity="0.7"/>',
                     text(f'{230 + width:.3f}', y + 27, f'{row["count"]:,}', 24, weight=600)]
    elements += [text(32, 341, 'Selected checks: llms.txt, Markdown, basic MCP marker', 21),
                 text(32, 377, 'Counts from 50,000 domains | veda.ng/agentready', 19, '#64748b')]
    # Keep the existing asset URL so previously embedded images receive corrected content.
    result['agentready-policy.svg'] = svg('Exact overlap of the three selected checks',
        'The positive groups contain 2,635, 280, and 833 domains respectively. Another 46,252 match none.', 400, elements)
    return result


def check_essay(report, md):
    """Compare the essay's numerical tables with independently verified source aggregates."""
    for row, label in zip(report['joint_counts'], ('None', 'One', 'Two', 'All three')):
        assert f'| {label} | {row["count"]:,} | {percentage(row["count"], report["n"])} |' in md
    for row in report['rank_comparison']:
        shares = [percentage(row['checks'][cid]['pass'], row['n']) for cid in report['focal_checks_in_bit_order']]
        assert '| ' + ' | '.join([row['rank'], *shares]) + ' |' in md
    weighted = {row['metric']: row for row in report['weighted_comparisons']}
    labels = {
        'access-js-hydration': 'Text-length check', 'joint_access': 'Text and both HTTP-200 conditions',
        'sitemap-xml': 'Sitemap and robots markers', 'json-ld': 'JSON-LD check', 'llms-txt': 'llms.txt check',
        'markdown-negotiation': 'Markdown response', 'mcp-server-live': 'MCP marker',
        'openapi-spec': 'OpenAPI marker', 'any_focal': 'At least one selected check',
    }
    for key, label in labels.items():
        row = weighted[key]
        lo, hi = row['final']['ci95_sampling_only']
        expected = f'| {label} | {row["sample_value"] * 100:.2f}% | {row["final"]["estimate"] * 100:.2f}% | {lo * 100:.2f}%-{hi * 100:.2f}% |'
        assert expected in md, expected
    for cid, label in [('llms-txt', 'llms.txt'), ('mcp-server-live', 'MCP marker'),
                       ('bot-ua-access', 'Both HTTP-200 conditions'), ('markdown-negotiation', 'Markdown'),
                       ('robots-ai-policy', 'robots.txt rule')]:
        gap = report['crux_comparison'][cid]['standardized']['sample_mix']['difference_pp']
        assert f'| {label} | {gap:+.2f} percentage points |' in md
    assert '—' not in md and '–' not in md
    assert '<AgentreadyLeaderboard' not in md
    assert 'wide\n' not in md and 'wide={true}' not in md


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('research', type=Path)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    research = args.research.resolve()
    report = json.loads((research / 'data/results_analysis.json').read_text())
    verified = json.loads((research / 'data/paper_verification.json').read_text())
    manuscript = research / 'agentic_web_readiness_50k.md'
    pdf = research / 'agentic_web_readiness_50k.pdf'
    assert verified['records'] == report['n'] == 50_000 and verified['check_ids'] == 61
    assert digest(research / 'data/results-gentle.jsonl') == verified['corpus_sha256'] == CORPUS_SHA256
    assert digest(manuscript) == verified['manuscript_sha256']
    assert digest(pdf) == verified['pdf']['sha256']
    essay = (ROOT / 'src/content/essays/agentready.mdx').read_text()
    check_essay(report, essay)
    prose = essay.split('---', 2)[2]
    prose = re.sub(r'<[^>]+>', '', prose, flags=re.S)
    prose = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', prose)
    word_count = len(prose.split())
    assert 3500 <= word_count <= 4500, f'Essay length is {word_count} words'
    public = {
        'title': 'Web Readiness for AI Agents', 'collection_period_utc': ['2026-09-03', '2026-09-04'],
        'scope': 'Aggregate recorded check results, not validated feature adoption or agent-task success.',
        'sample_domains': report['n'], 'checks_per_domain': verified['check_ids'],
        'tranco_list': 'ZJQ6G', 'sample_seed': 20260903,
        'frame_rank_weights': [0.01, 0.09, 0.90],
        'source_sha256': {'manuscript': verified['manuscript_sha256'], 'paper_pdf': verified['pdf']['sha256'],
                          'retained_corpus': CORPUS_SHA256,
                          'analysis': digest(research / 'data/results_analysis.json')},
        **{key: report[key] for key in ('readiness_profile', 'joint_counts', 'pairwise', 'rank_comparison',
                                       'text_comparison', 'crux_comparison', 'repeat_comparison', 'weighted_comparisons')},
    }
    outputs = {
        'public/data/agentready-study.json': (json.dumps(public, indent=2) + '\n').encode(),
        'public/papers/web-readiness-for-ai-agents.pdf': pdf.read_bytes(),
        'public/papers/agentready-check-selection.txt': (research / 'CHECK_SELECTION.md').read_bytes(),
        **{f'public/images/essays/{name}': content.encode() for name, content in figures(report).items()},
    }
    for name, content in outputs.items():
        target = ROOT / name
        if args.check:
            assert target.read_bytes() == content, f'Out of date: {name}'
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
    print(json.dumps({'mode': 'check' if args.check else 'generate', 'source_records': report['n'],
                      'artifacts': list(outputs), 'essay_tables_match': True,
                      'essay_words': word_count}, indent=2))


if __name__ == '__main__':
    main()

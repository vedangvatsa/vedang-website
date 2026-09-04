/** Build static leaderboard data for veda.ng/scan from 50k scan results.
 *
 * Reads merged results (results.jsonl + results-shard*.jsonl), dedupes by
 * domain (latest scannedAt wins), and writes:
 *   public/data/leaderboard/summary.json  snapshot stats + headline adoption
 *   public/data/leaderboard/top500.json   top 500 domains by score
 *   public/data/leaderboard/index.json    compact [domain, score, grade] for search
 *
 * Usage: npx tsx scripts/build-leaderboard.ts [--data <dir>] [--out <dir>]
 */
import fs from "node:fs";
import path from "node:path";

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

const DATA = arg("data", "/Users/vedang/ZCodeProject/research-paper-framework/papers/agentic-web-readiness/data");
const OUT = arg("out", path.join(process.cwd(), "public", "data", "leaderboard"));

function loadTiers(): Map<string, string> {
  const tiers = new Map<string, string>();
  try {
    for (const line of fs.readFileSync(path.join(DATA, "sample.csv"), "utf8").split("\n").slice(1)) {
      const [domain, , tier] = line.split(",");
      if (domain && tier) tiers.set(domain.trim(), tier.trim());
    }
  } catch { /* sample.csv optional */ }
  return tiers;
}

interface Row {
  domain: string;
  score?: number;
  grade?: string;
  durationMs?: number;
  scannedAt?: string;
  layers?: Record<string, number>;
  checks?: Record<string, string>;
  error?: string;
}

const HEADLINE_CHECKS = [
  "robots-ai-policy", "llms-txt", "markdown-negotiation", "bot-ua-access",
  "mcp-server-live", "openapi-spec", "https-tls", "security-txt",
  "json-ld", "agent-payments",
];

function main() {
  const gentle = path.join(DATA, "results-gentle.jsonl");
  const files = fs.existsSync(gentle)
    ? [gentle]
    : fs.readdirSync(DATA)
        .filter((f) => /^results(-shard\d+)?\.jsonl$/.test(f))
        .map((f) => path.join(DATA, f));
  if (files.length === 0) throw new Error(`no results files in ${DATA}`);

  const byDomain = new Map<string, Row>();
  for (const file of files) {
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line) as Row;
        if (!r.domain) continue;
        const prev = byDomain.get(r.domain);
        if (!prev || (r.scannedAt ?? "") >= (prev.scannedAt ?? "")) byDomain.set(r.domain, r);
      } catch { /* skip malformed line */ }
    }
  }
  const scored = [...byDomain.values()].filter((r) => typeof r.score === "number");
  const errors = byDomain.size - scored.length;
  scored.sort((a, b) => (b.score as number) - (a.score as number) || a.domain.localeCompare(b.domain));

  const scores = scored.map((r) => r.score as number).sort((a, b) => a - b);
  const mean = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const median = scores.length ? scores[Math.floor(scores.length / 2)] : 0;
  const grades: Record<string, number> = {};
  for (const r of scored) grades[r.grade ?? "?"] = (grades[r.grade ?? "?"] ?? 0) + 1;

  const adoption: Record<string, { pass: number; n: number; share: number }> = {};
  for (const c of HEADLINE_CHECKS) {
    const pass = scored.filter((r) => r.checks?.[c] === "pass").length;
    adoption[c] = { pass, n: scored.length, share: scored.length ? Math.round((pass / scored.length) * 10000) / 10000 : 0 };
  }

  const scannedAts = scored.map((r) => r.scannedAt ?? "").sort();
  const summary = {
    snapshotStart: scannedAts[0] ?? null,
    snapshotEnd: scannedAts[scannedAts.length - 1] ?? null,
    domainsAttempted: byDomain.size,
    domainsScored: scored.length,
    errors,
    meanScore: Math.round(mean * 10) / 10,
    medianScore: median,
    grades,
    adoption,
    vantage: "single network vantage point; homepage + well-known paths; 4,500ms probe timeout",
  };

  const tiers = loadTiers();
  const tierOf = (d: string) => {
    const t = tiers.get(d) ?? "";
    if (t.startsWith("tier1")) return 1;
    if (t.startsWith("tier2")) return 2;
    if (t.startsWith("tier3")) return 3;
    return 0;
  };
  const top500 = scored.slice(0, 500).map((r, i) => ({
    rank: i + 1, domain: r.domain, score: r.score, grade: r.grade,
    layers: r.layers ?? {}, scannedAt: r.scannedAt, tier: tierOf(r.domain),
  }));
  const index = scored.map((r) => [r.domain, r.score, r.grade, tierOf(r.domain), (r.scannedAt ?? "").slice(0, 10)]);

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(OUT, "top500.json"), JSON.stringify(top500));
  fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index));
  for (const f of ["summary.json", "top500.json", "index.json"]) {
    const kb = (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(1);
    console.log(`${f}: ${kb} KB`);
  }
  console.log(`domains=${byDomain.size} scored=${scored.length} errors=${errors} mean=${summary.meanScore}`);
}

main();

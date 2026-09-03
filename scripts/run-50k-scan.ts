/** Batch runner for the 50k agentic-readiness scan.
 * Uses the canonical scanner (src/lib/scanner/engine.ts scanDomain).
 * Reads domains.txt, writes compact JSONL + progress with resume support.
 *
 * Usage:
 *   npx tsx scripts/run-50k-scan.ts --in <domains.txt> --out <results.jsonl> --limit 20 --concurrency 10
 */
import fs from "node:fs";
import path from "node:path";
import { scanDomain } from "../src/lib/scanner/engine";

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

const IN = arg("in", "/Users/vedang/ZCodeProject/research-paper-framework/papers/agentic-web-readiness/data/domains.txt");
const OUT = arg("out", "/Users/vedang/ZCodeProject/research-paper-framework/papers/agentic-web-readiness/data/results.jsonl");
const LIMIT = parseInt(arg("limit", "0"), 10);
const CONCURRENCY = parseInt(arg("concurrency", "15"), 10);

async function main() {
  const all = fs.readFileSync(IN, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
  const domains = LIMIT > 0 ? all.slice(0, LIMIT) : all;
  const done = new Set<string>();
  if (fs.existsSync(OUT)) {
    for (const line of fs.readFileSync(OUT, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try { done.add(JSON.parse(line).domain); } catch { /* skip */ }
    }
  }
  const queue = domains.filter((d) => !done.has(d));
  console.log(`domains=${domains.length} done=${done.size} todo=${queue.length} concurrency=${CONCURRENCY}`);
  const out = fs.createWriteStream(OUT, { flags: "a" });
  let ok = 0, fail = 0;
  const t0 = Date.now();
  let idx = 0;

  async function worker() {
    while (idx < queue.length) {
      const domain = queue[idx++];
      try {
        const r = await scanDomain(domain);
        const checks: Record<string, string> = {};
        for (const l of r.layers) for (const c of l.checks) checks[c.id] = c.status;
        const layers: Record<string, number> = {};
        for (const l of r.layers) layers[l.id] = l.percentage;
        out.write(JSON.stringify({
          domain: r.domain, score: r.score, grade: r.grade,
          durationMs: r.durationMs, scannedAt: r.scannedAt,
          layers, checks,
        }) + "\n");
        ok++;
      } catch (e) {
        out.write(JSON.stringify({ domain, error: String(e).slice(0, 200), scannedAt: new Date().toISOString() }) + "\n");
        fail++;
      }
      const n = ok + fail + done.size;
      if ((ok + fail) % 25 === 0 || n === domains.length) {
        const el = ((Date.now() - t0) / 1000).toFixed(0);
        console.log(`progress ${n}/${domains.length} ok=${ok} fail=${fail} elapsed=${el}s`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
  out.close();
  console.log(`finished ok=${ok} fail=${fail} total=${domains.length} out=${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

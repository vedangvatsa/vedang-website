/** One-off retry for domains that hung workers. Appends rows to given OUT file. */
import fs from "node:fs";
import { scanDomain } from "../src/lib/scanner/engine";

const OUT = process.argv[2];
const domains = process.argv.slice(3);
if (!OUT || domains.length === 0) {
  console.error("usage: retry-missing.ts <out.jsonl> <domain...>");
  process.exit(2);
}
const out = fs.createWriteStream(OUT, { flags: "a" });
async function main() {
for (const d of domains) {
  try {
    const r = await Promise.race([
      scanDomain(d),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("hard-timeout-90s")), 90000)),
    ]);
    const checks: Record<string, string> = {};
    for (const l of r.layers) for (const c of l.checks) checks[c.id] = c.status;
    const layers: Record<string, number> = {};
    for (const l of r.layers) layers[l.id] = l.percentage;
    const row = { domain: r.domain, score: r.score, grade: r.grade, durationMs: r.durationMs, scannedAt: r.scannedAt, layers, checks };
    out.write(JSON.stringify(row) + "\n");
    console.log(`OK ${r.domain} score=${r.score}`);
  } catch (e) {
    const row = { domain: d, error: String(e).slice(0, 120), scannedAt: new Date().toISOString() };
    out.write(JSON.stringify(row) + "\n");
    console.log(`ERR ${d} ${String(e).slice(0, 80)}`);
  }
}
}
main().then(() => out.close()).catch((e) => { console.error(e); process.exit(1); });

/** Output verification: scan diverse domains, dump full results for audit. */
import fs from "node:fs";
import { scanDomain } from "../src/lib/scanner/engine";

const DOMAINS = [
  "cloudflare.com", "github.com", "bbc.com", "veda.ng", "stripe.com",
  "example.com", "neverssl.com", "anthropic.com", "openai.com",
  "wikipedia.org", "shopify.com", "ietf.org",
];
const BAD = ["not-a-domain-xyz123", "http://127.0.0.1/", "", "localhost:3000"];

async function main() {
  const out: unknown[] = [];
  for (const d of DOMAINS) {
    const t0 = Date.now();
    try {
      const r = await scanDomain(d);
      out.push({ ...r, testMs: Date.now() - t0 });
      console.log(`OK ${r.domain} score=${r.score} grade=${r.grade} ms=${Date.now() - t0}`);
    } catch (e) {
      out.push({ domain: d, ERROR: String(e).slice(0, 120) });
      console.log(`ERR ${d} ${String(e).slice(0, 80)}`);
    }
  }
  for (const bad of BAD) {
    try {
      const r = await scanDomain(bad);
      out.push({ input: bad, score: r.score, grade: r.grade });
      console.log(`UNEXPECTED-PASS ${bad} score=${r.score}`);
    } catch (e) {
      console.log(`REJECTED ${JSON.stringify(bad)} :: ${String(e).slice(0, 80)}`);
    }
  }
  fs.writeFileSync("/tmp/verify-outputs.json", JSON.stringify(out, null, 1));
  console.log("wrote /tmp/verify-outputs.json");
}

main().catch((e) => { console.error(e); process.exit(1); });

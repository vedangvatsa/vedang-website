#!/bin/bash
# Watchdog: keeps one runner per R2b shard + validation alive. Resume is
# automatic (runner skips domains already in its OUT file).
D=/Users/vedang/ZCodeProject/research-paper-framework/papers/agentic-web-readiness/data
W=/Users/vedang/ZCodeProject/vedang-website
run_one() {
  local infile="$1" outfile="$2" log="$3"
  if pgrep -f "run-50k-scan.ts --in ${infile}" > /dev/null; then return 0; fi
  local total done
  total=$(grep -c . "$infile")
  done=$(grep -c . "$outfile" 2>/dev/null || echo 0)
  if [ "$done" -lt "$total" ]; then
    echo "$(date '+%H:%M:%S') relaunch $(basename "$infile") done=$done/$total"
    (nohup npx tsx scripts/run-50k-scan.ts --in "$infile" --out "$outfile" --concurrency 3 --delay-ms 300 > "$log" 2>&1 &)
  fi
}
while true; do
  for k in 0 1 2 3 4; do
    run_one "$D/r2bshard$k.txt" "$D/results-r2b-shard$k.jsonl" "/tmp/scan-r2b-s$k.log"
  done
  sleep 45
done

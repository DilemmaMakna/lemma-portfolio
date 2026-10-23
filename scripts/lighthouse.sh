#!/usr/bin/env bash
# Build and start the app, run Lighthouse on 5 pages x (mobile, desktop),
# write raw JSON to docs/lighthouse/raw/ (gitignored) and print a score table.
# Usage: scripts/lighthouse.sh   (env: PORT, default 3100)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3100}"
BASE="http://localhost:$PORT"
RAW_DIR="$ROOT/docs/lighthouse/raw"
CHROME_FLAGS="--headless=new --no-sandbox"
CATEGORIES="performance,accessibility,best-practices,seo"
PAGES=(/ /about /services /work /contact)

cd "$ROOT"
mkdir -p "$RAW_DIR"

./node_modules/.bin/next build

SERVER_PID=""
trap '[[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null || true' EXIT

./node_modules/.bin/next start -p "$PORT" >"$RAW_DIR/server.log" 2>&1 &
SERVER_PID=$!

ready=0
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null "$BASE/"; then ready=1; break; fi
  sleep 1
done
[[ $ready -eq 1 ]] || { echo "server not ready on $BASE (see $RAW_DIR/server.log)" >&2; exit 1; }

names=()
for form in mobile desktop; do
  if [[ $form == desktop ]]; then factor=(--preset=desktop); else factor=(--form-factor=mobile); fi
  for page in "${PAGES[@]}"; do
    name=$([[ $page == / ]] && echo home || echo "${page#/}")
    names+=("$name-$form")
    npx --yes lighthouse "$BASE$page" "${factor[@]}" \
      --only-categories="$CATEGORIES" \
      --output=json --output-path="$RAW_DIR/$name-$form.json" \
      --chrome-flags="$CHROME_FLAGS" --quiet
  done
done

node - "$RAW_DIR" "${names[@]}" <<'JS'
const fs = require('fs');
const path = require('path');
const [dir, ...keys] = process.argv.slice(2);
const pct = (s) => (s == null ? 'n/a' : Math.round(s * 100));
const rows = keys.map((key) => {
  const r = JSON.parse(fs.readFileSync(path.join(dir, key + '.json'), 'utf8'));
  const c = r.categories;
  const a = r.audits;
  return [
    key,
    pct(c.performance.score),
    pct(c.accessibility.score),
    pct(c['best-practices'].score),
    pct(c.seo.score),
    (a['largest-contentful-paint'].numericValue / 1000).toFixed(2) + 's',
    a['cumulative-layout-shift'].numericValue.toFixed(3),
    Math.round(a['total-blocking-time'].numericValue) + 'ms',
  ];
});
const head = ['page-form', 'Performance', 'Accessibility', 'Best Practices', 'SEO', 'LCP', 'CLS', 'TBT'];
const all = [head, ...rows];
const w = head.map((_, i) => Math.max(...all.map((r) => String(r[i]).length)));
for (const r of all) console.log(r.map((v, i) => String(v).padEnd(w[i])).join('  '));
JS

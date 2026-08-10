#!/usr/bin/env bash
# Preview (and publish) all migrated pages via the AEM admin API so DA source
# content renders at the .aem.page (preview) and .aem.live (live) URLs.
# Credentials injected by the environment (no Authorization header).
set -u

ORG="inf73054"
REPO="eds-ema-repo"
REF="main"
ROOT="content"

mapfile -t FILES < <(find "$ROOT" -name '*.plain.html' \
  | grep -vE '(^|/)(blog\.plain\.html|blog-ace-pro-court-polo\.plain\.html)$' \
  | grep -vE '/(articles|blog)/' \
  | sort)

action="${1:-preview}"   # preview | live
host="admin.hlx.page"

ok=0; fail=0
for f in "${FILES[@]}"; do
  rel="${f#${ROOT}/}"; rel="${rel%.plain.html}"
  # index -> / ; others -> /rel
  path="/${rel}"
  [[ "$rel" == "index" ]] && path="/"
  url="https://${host}/${action}/${ORG}/${REPO}/${REF}${path}"
  code="$(curl -s -m 60 -o /dev/null -w '%{http_code}' -X POST "$url")"
  if [[ "$code" == "200" || "$code" == "201" ]]; then
    echo "  ✅ ${code}  ${action}  ${path}"; ok=$((ok+1))
  else
    echo "  ❌ ${code}  ${action}  ${path}"; fail=$((fail+1))
  fi
done
echo ""
echo "${action}: ${ok} ok, ${fail} failed, of ${#FILES[@]}."

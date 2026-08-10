#!/usr/bin/env bash
# Publish migrated content/*.plain.html to Document Authoring (admin.da.live).
# Wraps each page's fragment in the full DA document shell and POSTs it.
# Credentials are injected by the environment (no Authorization header here).
set -u

ORG="inf73054"
REPO="eds-ema-repo"
BASE="https://admin.da.live/source/${ORG}/${REPO}"
ROOT="content"

# DA target path (no extension) -> local .plain.html file.
# Excludes stale duplicates: blog, blog-ace-pro-court-polo, articles/*, blog/*.
mapfile -t FILES < <(find "$ROOT" -name '*.plain.html' \
  | grep -vE '(^|/)(blog\.plain\.html|blog-ace-pro-court-polo\.plain\.html)$' \
  | grep -vE '/(articles|blog)/' \
  | sort)

ok=0; fail=0
for f in "${FILES[@]}"; do
  # /content/foo/bar.plain.html -> /foo/bar
  rel="${f#${ROOT}/}"; rel="${rel%.plain.html}"
  target="${BASE}/${rel}.html"

  frag="$(cat "$f")"
  tmp="$(mktemp /tmp/da-XXXXXX.html)"
  # Full DA document shell: header/footer are global (empty here), body is main.
  printf '<body>\n  <header></header>\n  <main>%s</main>\n  <footer></footer>\n</body>\n' "$frag" > "$tmp"

  code="$(curl -s -m 60 -o /dev/null -w '%{http_code}' -X POST \
    -F "data=@${tmp};type=text/html" "$target")"
  if [[ "$code" == "200" || "$code" == "201" ]]; then
    echo "  ✅ ${code}  /${rel}"
    ok=$((ok+1))
  else
    echo "  ❌ ${code}  /${rel}"
    fail=$((fail+1))
  fi
  rm -f "$tmp"
done
echo ""
echo "Published: ${ok} ok, ${fail} failed, of ${#FILES[@]} files."

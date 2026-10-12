#!/usr/bin/env bash
# Publish the production build of the current commit to the `gh-pages` branch.
#
#   scripts/deploy.sh            # build HEAD (must be a clean checkout of main) and publish
#   scripts/deploy.sh --allow-branch   # publish from another branch (previews only)
#
# Rollback: check out the release tag you want (e.g. `git checkout v0.1.0`) and run this
# script again; every deploy is a traceable commit on gh-pages that names its source commit.
set -euo pipefail

ALLOW_BRANCH=0
[[ "${1:-}" == "--allow-branch" ]] && ALLOW_BRANCH=1

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "main" && $ALLOW_BRANCH -eq 0 ]]; then
  echo "Refusing to deploy from '$branch'. Deploy from main (or pass --allow-branch for a preview)." >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean; commit or discard changes first." >&2
  exit 1
fi

sha=$(git rev-parse --short HEAD)
npm ci --no-audit --no-fund
npm test
npm run build

tmp="$(mktemp -d)/tarjetalan-pages"
cleanup() { git worktree remove --force "$tmp" 2>/dev/null || true; }
trap cleanup EXIT

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch -q origin gh-pages
  git worktree add -q "$tmp" origin/gh-pages --detach
else
  git worktree add -q --detach "$tmp"
  (cd "$tmp" && git checkout -q --orphan gh-pages && git rm -rfq . )
fi

# Replace the published tree with the new build (old files removed, history kept).
find "$tmp" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$tmp/"
touch "$tmp/.nojekyll"   # serve files as-is (no Jekyll processing)

cd "$tmp"
git add -A
if git diff --cached --quiet; then
  echo "Nothing changed; gh-pages already matches $sha."
  exit 0
fi
git commit -q -m "deploy: ${sha} ($(date -u +%Y-%m-%dT%H:%MZ))"
git push -q origin HEAD:gh-pages
echo "Published ${sha} to gh-pages."

#!/bin/sh
# Publishes dist/ to the gh-pages branch (the hosted game). Lead only, and only with the owner's go.
set -e
cd "$(dirname "$0")/.."
npm run build >/dev/null
H=$(git rev-parse --short HEAD)
P=${PAGES:-/home/claude/pages}
[ -d "$P/.git" ] || { rm -rf "$P"; git clone -q --branch gh-pages --single-branch "$(git remote get-url origin)" "$P"; }
cd "$P" && git pull -q origin gh-pages 2>/dev/null || true
git rm -rq . && cp -r "$OLDPWD/dist/." . && touch .nojekyll && git add -A
git -c user.name="Andrea Corvaglia" -c user.email="noreply@anthropic.com" commit -q -m "Site build from $H

Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01E4jALskPrKNsBeYMdEVaeN"
git push -q origin gh-pages
echo "published $H as $(git rev-parse --short HEAD), build $(cat version.json)"

#!/bin/bash
# 改完之后跑这一条，就上线了。
#   ./publish.sh              用默认说明提交
#   ./publish.sh "改了首页文案"  自己写说明
set -e
cd "$(dirname "$0")"

echo "▸ 自检…"
python3 check.py || { echo "✗ 自检没过，先修好再发"; exit 1; }

if [ -z "$(git status --porcelain)" ]; then
  echo "▸ 没有改动，不用发。"
  exit 0
fi

MSG="${1:-更新站点内容}"
git add -A
git commit -q -m "$MSG"
git push -q origin main
echo "▸ 已推送。GitHub Pages 大约 1 分钟后生效。"

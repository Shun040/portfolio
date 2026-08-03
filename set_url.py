#!/usr/bin/env python3
"""拿到线上网址后跑一次，把社交分享卡片的相对路径补成绝对地址。

    python3 set_url.py https://yourname.github.io/portfolio/

og:image 必须是绝对 URL —— 微信、LinkedIn、Twitter 抓相对路径会抓空，
分享出去就是一张白卡。
"""
import re
import sys

if len(sys.argv) < 2:
    sys.exit(__doc__)

base = sys.argv[1].rstrip('/') + '/'
html = open('work.html', encoding='utf-8').read()

html = re.sub(r'(<meta property="og:image" content=")[^"]*(")',
              r'\g<1>' + base + 'assets/og-cover.jpg' + r'\g<2>', html)

if 'og:url' not in html:
    html = html.replace('<meta property="og:type" content="website">',
                        '<meta property="og:type" content="website">\n'
                        '<meta property="og:url" content="' + base + 'work.html">')
else:
    html = re.sub(r'(<meta property="og:url" content=")[^"]*(")',
                  r'\g<1>' + base + 'work.html' + r'\g<2>', html)

open('work.html', 'w', encoding='utf-8').write(html)
print('已写入绝对地址：' + base)

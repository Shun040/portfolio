#!/usr/bin/env python3
"""给 CSS / JS 的引用加上版本号，强制浏览器取新文件。

publish.sh 每次发布前会自动调用一次，版本号用当前时间戳。
没有这个，GitHub Pages 的 10 分钟缓存会让你改完看不到效果 ——
更糟的是只更新了一半（HTML 新的、CSS 旧的），页面会以奇怪的方式坏掉。
"""
import glob
import re
import time

v = str(int(time.time()))
n = 0
for f in glob.glob('*.html'):
    s = open(f, encoding='utf-8').read()
    before = s
    # href="css/x.css" 或 src="js/x.js"，带不带旧版本号都能匹配
    s = re.sub(r'((?:href|src)="(?:css|js)/[\w.-]+\.(?:css|js))(?:\?v=\d+)?(")',
               r'\g<1>?v=' + v + r'\g<2>', s)
    if s != before:
        open(f, 'w', encoding='utf-8').write(s)
        n += len(re.findall(r'\?v=' + v, s))
print(f'已给 {n} 处引用打上版本号 v={v}')

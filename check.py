#!/usr/bin/env python3
"""改完之后跑一遍：文案键是否对齐、HTML 标签是否配对、CSS 是否配平、资源是否存在。

    python3 check.py

不需要任何依赖。退出码非 0 表示有问题。
"""

import glob
import html.parser
import os
import re
import sys

FAIL = []


def bad(msg):
    FAIL.append(msg)
    print("  ✗ " + msg)


def ok(msg):
    print("  ✓ " + msg)


# ---------- 1. HTML 标签配对 ----------
class Pair(html.parser.HTMLParser):
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
            'input', 'link', 'meta', 'source', 'track', 'wbr'}

    def __init__(self):
        super().__init__()
        self.stack = []
        self.err = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.VOID:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if not self.stack:
            self.err.append("多余的 </%s> 在 %s" % (tag, self.getpos()))
            return
        top = self.stack.pop()
        if top[0] != tag:
            self.err.append("<%s> 在 %s 被 </%s> 在 %s 关闭"
                            % (top[0], top[1], tag, self.getpos()))


print("HTML 标签配对")
for f in sorted(glob.glob('*.html')):
    p = Pair()
    p.feed(open(f, encoding='utf-8').read())
    if p.err or p.stack:
        bad("%s: %s 未闭合 %s" % (f, p.err, [x[0] for x in p.stack]))
    else:
        ok(f)


# ---------- 2. 中英文案键对齐 ----------
print("\n文案字典")
src = open('js/i18n.js', encoding='utf-8').read()
blocks = re.findall(r"\b(en|zh):\s*\{(.*?)\n    \}", src, re.S)
keys = {'en': set(), 'zh': set()}
for lang, body in blocks:
    for k in re.findall(r"'([a-zA-Z0-9.]+)'\s*:", body):
        keys[lang].add(k)

diff = keys['en'] ^ keys['zh']
if diff:
    bad("中英键不对齐: %s" % sorted(diff))
else:
    ok("中英各 %d 组键，完全对齐" % len(keys['en']))


# ---------- 3. 页面引用的键是否都存在 ----------
used = set()
for f in glob.glob('*.html'):
    h = open(f, encoding='utf-8').read()
    used |= set(re.findall(r'data-i18n="([^"]+)"', h))
    for a in re.findall(r'data-i18n-attr="([^"]+)"', h):
        for pair in a.split(','):
            used.add(pair.split(':')[1].strip())

js = ''.join(open(f, encoding='utf-8').read() for f in glob.glob('js/*.js'))
# 注释里也写了 data-i18n="key" 这样的示例，先剥掉注释再扫，否则会误报
js = re.sub(r'/\*.*?\*/', '', js, flags=re.S)
used |= set(re.findall(r'data-i18n="([a-zA-Z0-9.]+)"', js))
# 模板拼接出来的键：p1..pN / s1..sN
n_proj = len(re.findall(r"\{ k: 'p\d+'", js))
n_str = len(re.findall(r"'s\d+'", js))
for m in re.findall(r"data-i18n=\"' \+ p\.k \+ '\.(\w+)\"", js):
    used |= {'p%d.%s' % (i, m) for i in range(1, n_proj + 1)}
for m in re.findall(r"data-i18n-attr=\"alt:' \+ p\.k \+ '\.(\w+)\"", js):
    used |= {'p%d.%s' % (i, m) for i in range(1, n_proj + 1)}
for m in re.findall(r"data-i18n=\"' \+ k \+ '\.(\w+)\"", js):
    used |= {'s%d.%s' % (i, m) for i in range(1, n_str + 1)}

missing = sorted(k for k in used if k not in keys['en'] or k not in keys['zh'])
if missing:
    bad("页面引用了但字典里没有: %s" % missing)
else:
    ok("页面引用的 %d 组键全部存在" % len(used))


# ---------- 3.5 JavaScript 语法 ----------
# 这一步是补上来的：data.js 曾经因为少一个逗号整站瘫掉，
# 而当时的自检全绿。语法错误必须在发布前拦住。
print("\nJavaScript 语法")
import subprocess
JS_CHECK = """
ObjC.import('Foundation');
var s = $.NSString.stringWithContentsOfFileEncodingError('%s', $.NSUTF8StringEncoding, null).js;
try { new Function(s); 'OK' } catch (e) { 'ERR ' + e.message }
"""
for f in sorted(glob.glob('js/*.js')):
    src = open(f, encoding='utf-8').read()
    if re.search(r'^\s*(import|export)\s', src, re.M):
        # ES 模块：new Function 不认 import，剥掉模块语句再查其余部分的语法
        stripped = re.sub(r'^\s*import[^;]*;\s*$', '', src, flags=re.M)
        stripped = re.sub(r'^\s*export\s+', '', stripped, flags=re.M)
        tmp = os.path.join(os.path.dirname(os.path.abspath(f)), '.__check_tmp.js')
        open(tmp, 'w', encoding='utf-8').write(stripped)
        r = subprocess.run(['osascript', '-l', 'JavaScript', '-e', JS_CHECK % tmp],
                           capture_output=True, text=True)
        os.remove(tmp)
    else:
        r = subprocess.run(['osascript', '-l', 'JavaScript', '-e', JS_CHECK % os.path.abspath(f)],
                           capture_output=True, text=True)
    out = r.stdout.strip()
    if out == 'OK':
        ok(f)
    else:
        bad("%s: %s" % (f, out or r.stderr.strip()))


# ---------- 4. CSS 配平 ----------
print("\nCSS")
css = ''.join(open(f, encoding='utf-8').read() for f in glob.glob('css/*.css'))
if css.count('{') != css.count('}'):
    bad("花括号不配平: %d 开 / %d 闭" % (css.count('{'), css.count('}')))
else:
    ok("花括号配平（%d 组）" % css.count('{'))


# ---------- 5. 资源是否存在 ----------
print("\n资源引用")
refs = set()
for f in glob.glob('*.html') + glob.glob('js/*.js'):
    t = open(f, encoding='utf-8').read()
    refs |= set(re.findall(r'(?:src|href)="((?!https?:|mailto:|#)[^"]+)"', t))
    refs |= set(re.findall(r"'(assets/[^']+)'", t))
# 模板拼接出来的 src（如 "' + p.img + '"）不是真实路径，实际路径由上面的
# 'assets/...' 字面量那一条抓到
refs = {r.split('#')[0] for r in refs if "'" not in r and '+' not in r}
refs = {r for r in refs if r and not r.endswith('/')}

lost = sorted(r for r in refs if not os.path.exists(r.split('?')[0]))
# portrait.jpg 是有意缺失的占位，不算错
lost = [r for r in lost if 'portrait.jpg' not in r]
if lost:
    bad("引用了不存在的文件: %s" % lost)
else:
    ok("%d 个本地引用全部存在" % len(refs))

if not os.path.exists('assets/portrait.jpg'):
    print("  · 提示: assets/portrait.jpg 还没放，页面会显示斜纹占位块")


# ---------- 结果 ----------
print()
if FAIL:
    print("%d 个问题" % len(FAIL))
    sys.exit(1)
print("全部通过")

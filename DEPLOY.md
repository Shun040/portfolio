# 部署

站点是纯静态的（HTML / CSS / JS + 图片视频，7.1 MB，54 个文件），
没有构建步骤，任何静态托管都能放。下面两种都可以，**推荐 Cloudflare Pages**。

| | Cloudflare Pages | GitHub Pages |
|---|---|---|
| 需要 git | 否，可以直接拖文件夹 | 是 |
| 国内访问 | 通常可用，速度尚可 | 经常很慢或打不开 |
| 免费自定义域名 | 有 | 有 |
| HTTPS | 自动 | 自动 |
| 部署速度 | 约 30 秒 | 1–2 分钟 |

因为你要同时给澳洲招聘方和国内的人看，**Cloudflare 是更稳的那个**。

---

## 方案 A：Cloudflare Pages（推荐，不用 git）

1. 注册 <https://dash.cloudflare.com>（免费）
2. 左侧 **Workers & Pages** → **Create** → **Pages** → **Upload assets**
3. 项目名填 `zicen-yin`（会变成 `zicen-yin.pages.dev`）
4. 把 **`~/work/portfolio-2026` 整个文件夹拖进去**
5. 点 **Deploy site**，等 30 秒

拿到网址后回来跑一次（补社交分享卡片的绝对地址）：

```bash
cd ~/work/portfolio-2026
python3 set_url.py https://zicen-yin.pages.dev
```

然后把文件夹重新拖上去覆盖一次即可。

> 拖上传时不用管 `check.py`、`*.md`、`.git/` —— 它们被一起传上去也不影响，
> 只是多占几十 KB。想干净的话传之前先删掉这几个。

---

## 方案 B：GitHub Pages

仓库已经初始化好了，提交也做完了（`git log` 能看到一条）。

### 1. 在 GitHub 上建一个空仓库

浏览器打开 <https://github.com/new>，仓库名填 `portfolio`，
**不要**勾选 README / .gitignore / license（我们本地已经有了）。

### 2. 推上去

```bash
cd ~/work/portfolio-2026
git remote add origin https://github.com/你的用户名/portfolio.git
git push -u origin main
```

### 3. 打开 Pages

仓库页面 → **Settings** → **Pages** → Source 选 **Deploy from a branch**，
分支选 `main`、目录选 `/ (root)` → Save。等 1–2 分钟。

网址是 `https://你的用户名.github.io/portfolio/`

### 4. 补绝对地址

```bash
python3 set_url.py https://你的用户名.github.io/portfolio
git commit -am "补社交分享卡片的绝对地址" && git push
```

### 关于 git 身份

我给这个仓库设了本地身份（只对这个仓库生效）：

```
Zicen Yin <wanghao6180@gmail.com>
```

如果你的 GitHub 账号用的是别的邮箱，先改掉再推，否则提交不会算在你名下：

```bash
git config user.email 你的GitHub邮箱
git commit --amend --reset-author --no-edit
```

---

## 已经处理好的部署细节

- **`.nojekyll`** —— GitHub Pages 默认会跑 Jekyll，会吞掉下划线开头的文件。
  这个空文件关掉它
- **全部相对路径** —— 所以部署在 `user.github.io/portfolio/` 这种子目录下
  也不会断链
- **`.gitignore`** —— 排除 `.DS_Store` 和 Python 缓存
- **单文件最大 816 KB**（`mandala-10.mp4`），远低于两家的限制

---

## 上线前自己确认

1. **打开 `assets/Zicen-Yin-CV.pdf` 看一眼有没有手机号。**
   我用 `strings` 查过没找到，但 PDF 文本流是压缩的，这个检查不可靠。
   公开的 PDF 会被爬虫抓，手机号会进垃圾推销名单
2. 邮箱 `502874781s@gmail.com` 会公开 —— 这是预期内的，但你要知道会收到垃圾邮件
3. 六个项目的文案、数字、奖项措辞，全部按作品集母版写的，**自己再核一遍**
4. `assets/portrait.jpg` 还没放。现在会显示斜纹占位块，不难看，但最好补上

---

## 之后想换域名

两家都支持免费绑定自定义域名。买一个 `.design` 或 `.studio` 域名
（约 15–25 澳元/年），在托管商后台加一条 CNAME 就行。
换域名后记得再跑一次 `set_url.py`。

/* ------------------------------------------------------------------
   case.js — 作品档案表 + 可交互案例浮层
   ------------------------------------------------------------------
   数据来自 data.js。每个项目打开后是一份完整案例，不是一句话简介：
     背景 → 调研（真实数字，四种可视化）→ 机制（三种交互形态）
     → 系统管线 → 体验 → 成果 → 影像

   所有图和视频都走骨架屏占位，加载完再淡入。
   YouTube 用外观占位（facade），点了才真正插 iframe ——
   六个项目一次性嵌十个 iframe 会把首屏拖垮。
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var CALM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function L() { return window.Lang.get(); }
  function P(p) { return p[L()]; }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* 骨架屏包装：图片加载完给外层加 .ready，占位扫光停掉、图淡入 */
  function watch(root) {
    var media = root.querySelectorAll('.ph > img, .ph > video');
    for (var i = 0; i < media.length; i++) {
      (function (m) {
        var box = m.parentNode;
        function done() { box.classList.add('ready'); }
        if (m.tagName === 'IMG') {
          if (m.complete && m.naturalWidth) return done();
          m.addEventListener('load', done);
          m.addEventListener('error', done);   // 出错也要停掉扫光，否则永远在闪
        } else {
          if (m.readyState >= 2) return done();
          m.addEventListener('loadeddata', done);
          m.addEventListener('error', done);
        }
      })(media[i]);
    }
  }

  /* ================================================================
     1. 项目便当盒
     ---------------------------------------------------------------
     六个盒子刻意不等大：01 是毕业作品，占最大格。
     ================================================================ */

  function renderTable() {
    var host = document.getElementById('worktable');
    if (!host || !window.PROJECTS) return;

    var rows = '', plate = '';
    for (var i = 0; i < window.PROJECTS.length; i++) {
      var p = window.PROJECTS[i], d = P(p);
      rows +=
        '<a class="row-work" href="#' + p.key + '" data-case="' + p.key + '">' +
          '<span class="line1">' +
            '<span class="no">' + p.id + '</span>' +
            '<span class="dot">·</span>' +
            '<span>' + esc(d.type) + '</span>' +
            '<span class="dot">·</span>' +
            '<span>' + esc(d.year) + '</span>' +
          '</span>' +
          '<span class="nm">' + esc(d.name) + '</span>' +
          '<span class="q quote">' + d.thesis + '</span>' +
          '<span class="sub">' + esc(d.tag) + '</span>' +
          '<span class="go">' + esc(T('arc.open')) + ' →</span>' +
        '</a>';
      plate +=
        '<a class="ph" href="#' + p.key + '" data-case="' + p.key + '" ' +
           'aria-label="' + esc(d.name) + '">' +
          '<img src="' + p.img + '" alt="" loading="lazy" decoding="async">' +
          '<span class="cap">' + p.id + '</span>' +
        '</a>';
    }

    host.innerHTML =
      '<div class="wtable">' + rows + '</div>' +
      '<p class="mono" style="margin-top:var(--s7);margin-bottom:var(--s3)">' +
        esc(T('arc.plate')) + '</p>' +
      '<div class="plate">' + plate + '</div>';

    watch(host);
    window.Lang.apply(L());
  }

  /* ================================================================
     2. 调研可视化
     ================================================================ */

  function vizBars(r) {
    var h = '<div class="bars">';
    for (var i = 0; i < r.items.length; i++) {
      var it = r.items[i];
      var pct = Math.round(it[1] / r.max * 100);
      h += '<div class="row">' +
             '<div class="lab"><span>' + esc(it[0]) + '</span>' +
                 '<b>' + it[1] + (r.unit || '') + '</b></div>' +
             '<div class="track"><i style="--v:' + pct + '%"></i></div>' +
           '</div>';
    }
    return h + '</div>' + (r.cap ? '<p class="note">' + esc(r.cap) + '</p>' : '');
  }

  function vizDonut(r) {
    var total = 0, i;
    for (i = 0; i < r.items.length; i++) total += r.items[i][1];
    var stops = [], acc = 0;
    for (i = 0; i < r.items.length; i++) {
      var frac = r.items[i][1] / total * 100;
      stops.push(r.items[i][2] + ' ' + acc.toFixed(2) + '% ' + (acc + frac).toFixed(2) + '%');
      acc += frac;
    }
    var legend = '';
    for (i = 0; i < r.items.length; i++) {
      legend += '<div><i style="background:' + r.items[i][2] + '"></i>' +
                esc(r.items[i][0]) + ' — ' + r.items[i][1] + '%</div>';
    }
    var h =
      '<div class="donut-wrap">' +
        '<div style="position:relative">' +
          '<div class="donut" style="--stops:' + stops.join(',') + '"></div>' +
          '<div class="donut-c"><span><b>' + esc(r.center[0]) + '</b>' +
            '<span class="mono">' + esc(r.center[1]) + '</span></span></div>' +
        '</div>' +
        '<div class="donut-legend">' + legend +
          (r.stat ? '<div style="margin-top:8px"><b style="font-size:1.4rem;letter-spacing:-.02em">' +
            esc(r.stat[0]) + '</b></div><div>' + esc(r.stat[1]) + '</div>' : '') +
        '</div>' +
      '</div>';
    if (r.pills) {
      h += '<div class="pills">';
      for (i = 0; i < r.pills.length; i++) h += '<span>' + esc(r.pills[i]) + '</span>';
      h += '</div>';
      if (r.pillcap) h += '<p class="note">' + esc(r.pillcap) + '</p>';
    }
    return h;
  }

  function vizTimeline(r) {
    var h = '<div class="tline">';
    for (var i = 0; i < r.data.length; i++) {
      var d = r.data[i];
      h += '<div class="step">' +
             '<div class="k">' + esc(d[0]) + '</div>' +
             '<div class="v"><b>' + esc(d[1]) + '</b><span>' + esc(d[2]) + '</span></div>' +
           '</div>';
    }
    return h + '</div>';
  }

  function vizBand(r) {
    var h = '<p class="mono" style="margin-bottom:var(--s4)">' + esc(r.title) + '</p><div class="bandscale">';
    h += '<div class="bar">';
    var prev = r.min;
    for (var i = 0; i < r.bands.length; i++) {
      var b = r.bands[i];
      var w = (b[2] - prev) / (r.bands[r.bands.length - 1][2] - r.min) * 100;
      h += '<div style="background:' + b[1] + ';flex:0 0 ' + w.toFixed(2) + '%">' +
           esc(b[0]) + ' · ' + b[2] + '</div>';
      prev = b[2];
    }
    h += '</div><div class="subs">';
    for (i = 0; i < r.subs.length; i++) h += '<span class="chip">' + esc(r.subs[i]) + '</span>';
    h += '</div></div>';
    return h + (r.cap ? '<p class="note">' + esc(r.cap) + '</p>' : '');
  }

  function viz(r) {
    if (r.type === 'bars') return vizBars(r);
    if (r.type === 'donut') return vizDonut(r);
    if (r.type === 'bandscale') return vizBand(r);
    return vizTimeline(r);
  }

  /* ================================================================
     3. 机制模块（三种交互形态）
     ================================================================ */

  function mechMapping(c) {
    var h = '<div class="mapping">';
    for (var i = 0; i < c.data.length; i++) {
      h += '<button type="button" aria-pressed="' + (i === 0) + '">' +
             '<span class="from">' + esc(c.data[i][0]) + '</span>' +
             '<span class="ar">→</span>' +
             '<span class="to">' + esc(c.data[i][1]) + '</span>' +
           '</button>';
    }
    return h + '</div>';
  }

  function mechLoop(c) {
    var h = '<div class="loop">';
    for (var i = 0; i < c.data.length; i++) {
      if (i) h += '<span class="sep">→</span>';
      h += '<button type="button" aria-current="' + (i === 0) + '">' + esc(c.data[i]) + '</button>';
    }
    h += '<span class="sep">↻</span></div>';
    return h;
  }

  function mechStates(c) {
    var h = '<div class="states">';
    for (var i = 0; i < c.data.length; i++) {
      var s = c.data[i];
      h += '<button type="button" aria-pressed="' + (i === 0) + '" data-s="' + i + '" ' +
           'style="--sc:' + s[3] + '"><em>' + s[0] + '</em>' + esc(s[1]) + '</button>';
    }
    h += '</div><div class="state-stage" id="stateStage"></div>';
    return h;
  }

  function mech(c) {
    if (c.type === 'mapping') return mechMapping(c);
    if (c.type === 'loop') return mechLoop(c);
    if (c.type === 'states') return mechStates(c);
    return '';
  }

  /* 曼陀罗视频宫格 —— 悬停播放，点击锁定播放 */
  function clipGrid(n) {
    var h = '<div class="clipgrid">';
    for (var i = 1; i <= n; i++) {
      var id = (i < 10 ? '0' : '') + i;
      h += '<div class="clip ph" data-clip>' +
             '<video src="assets/video/mandala-' + id + '.mp4" ' +
                    'poster="assets/video/mandala-' + id + '.jpg" ' +
                    'muted loop playsinline preload="none"></video>' +
             '<span class="n">' + id + '</span>' +
           '</div>';
    }
    return h + '</div>';
  }

  /* ================================================================
     4. 视频外观占位
     ================================================================ */

  function vids(list, fallback) {
    var h = '<div class="vids">';
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      h += '<button class="vid" type="button" data-yt="' + v[0] + '">' +
             '<img src="https://i.ytimg.com/vi/' + v[0] + '/hqdefault.jpg" alt="" loading="lazy" ' +
                  'onerror="this.src=\'' + fallback + '\'">' +
             '<span class="play"><i>▶</i></span>' +
             '<span class="cap">' + esc(v[1]) + '</span>' +
           '</button>';
    }
    return h + '</div>';
  }

  /* ================================================================
     5. 组装案例
     ================================================================ */

  function section(title, body) {
    return '<div class="sec-t"><h4>' + title + '</h4><span class="rule"></span></div>' + body;
  }

  function T(k) { return window.Lang.t(k) || k; }

  function build(p) {
    var d = P(p), h = '';

    /* --- 档案头 --- */
    h += '<div class="case-head">' +
           '<div class="line">' +
             '<span class="no">' + T('arc.docno') + ' ZY—' + esc(d.year) + '—' + p.id + '</span>' +
             '<span>' + esc(d.type) + '</span>' +
           '</div>' +
           '<h2>' + esc(d.name) + '</h2>' +
         '</div>' +
         '<figure class="ph" style="aspect-ratio:16/9;margin-bottom:var(--lg)">' +
           '<img src="' + p.img + '" alt="' + esc(d.name) + '" ' +
           'style="width:100%;height:100%;object-fit:cover"></figure>';

    /* --- 论点 + 参数 --- */
    h += '<p class="case-thesis">' + d.thesis + '</p>';
    h += '<div class="chips">';
    for (var i = 0; i < d.tags.length; i++) h += '<span class="chip">' + esc(d.tags[i]) + '</span>';
    h += '</div>';
    h += '<div class="tline" style="margin-top:var(--s6)">' +
           '<div class="step"><div class="k mono">' + T('case.role') + '</div><div class="v"><b>' + esc(d.role) + '</b></div></div>' +
           '<div class="step"><div class="k mono">' + T('case.tools') + '</div><div class="v"><b>' + esc(d.tools) + '</b></div></div>' +
         '</div>';

    /* --- 背景 --- */
    var probs = '<ul class="probs">';
    for (i = 0; i < d.context.probs.length; i++) {
      probs += '<li><b>0' + (i + 1) + '</b><span>' + esc(d.context.probs[i]) + '</span></li>';
    }
    probs += '</ul>';
    h += section(T('case.context'), '<p class="lead">' + d.context.lead + '</p>' + probs);

    /* --- 调研 --- */
    h += section(d.research.label || T('case.research'),
                 '<p class="lead">' + d.research.lead + '</p>' + viz(d.research));

    /* --- 机制 --- */
    var cbody = '<p class="lead">' + d.concept.lead + '</p>' + mech(d.concept);
    if (d.concept.clips) {
      cbody += '<div style="margin-top:var(--s6)">' + clipGrid(d.concept.clips) + '</div>';
      if (d.concept.figcap) cbody += '<p class="note">' + d.concept.figcap + '</p>';
    }
    if (d.concept.note) cbody += '<p class="note">' + d.concept.note + '</p>';
    if (d.concept.fig) {
      cbody += '<figure style="margin-top:var(--s6)">' +
                 '<div class="ph" style="border-radius:var(--r);overflow:hidden">' +
                   '<img src="' + d.concept.fig[0] + '" alt="" loading="lazy" style="width:100%">' +
                 '</div>' +
                 '<figcaption>' + d.concept.fig[1] + '</figcaption>' +
               '</figure>';
    }
    h += section(T('case.concept'), cbody);

    /* --- 系统 --- */
    var sys = '<p class="lead">' + d.system.lead + '</p><div class="pipe">';
    for (i = 0; i < d.system.pipe.length; i++) {
      sys += '<div class="step"><span class="n">0' + (i + 1) + '</span>' +
             '<h5>' + esc(d.system.pipe[i][0]) + '</h5>' +
             '<p>' + esc(d.system.pipe[i][1]) + '</p></div>';
    }
    sys += '</div><div class="stack">';
    for (i = 0; i < d.system.stack.length; i++) sys += '<span class="chip">' + esc(d.system.stack[i]) + '</span>';
    sys += '</div>';
    if (d.system.fig) {
      sys += '<figure style="margin-top:var(--s6)">' +
               '<div class="ph" style="border-radius:var(--r);overflow:hidden">' +
                 '<img src="' + d.system.fig[0] + '" alt="" loading="lazy" style="width:100%">' +
               '</div>' +
               '<figcaption>' + d.system.fig[1] + '</figcaption>' +
             '</figure>';
    }
    h += section(T('case.system'), sys);

    /* --- 体验（PainShift 额外挂一个可玩的呼吸模块） --- */
    var exp = '<p class="lead">' + d.experience + '</p>';
    if (d.playground) {
      exp +=
        '<div class="breath" id="breath" style="margin-top:var(--s6)">' +
          '<div class="breath-stage"><span class="breath-ring"></span>' +
            '<span class="lab" id="breathLab">' + T('case.breatheIn') + '</span></div>' +
          '<div class="breath-read">' +
            '<div class="row"><div class="lab"><span>' + T('case.depth') + '</span><b id="bDepth">0%</b></div>' +
              '<div class="track"><i id="bDepthBar" style="width:0"></i></div></div>' +
            '<div class="row"><div class="lab"><span>' + T('case.hr') + '</span><b id="bHR">78 bpm</b></div>' +
              '<div class="track"><i id="bHRBar" style="width:78%"></i></div></div>' +
            '<div class="row"><div class="lab"><span>' + T('case.med') + '</span><b id="bMed">100%</b></div>' +
              '<div class="track"><i id="bMedBar" style="width:100%"></i></div></div>' +
            '<p class="note" id="breathNote">' + T('case.breathNote') + '</p>' +
          '</div>' +
        '</div>';
    }
    h += section(T('case.experience'), exp);

    /* --- 成果 --- */
    var out = '<div class="tiles">';
    for (i = 0; i < d.outcome.tiles.length; i++) {
      var t = d.outcome.tiles[i];
      out += '<div class="tile"><b>' + esc(t[0]) + '</b>' +
             '<p class="mono l">' + esc(t[1]) + '</p><p class="d">' + esc(t[2]) + '</p></div>';
    }
    out += '</div><div class="reflect">';
    for (i = 0; i < d.outcome.reflect.length; i++) out += '<p>' + d.outcome.reflect[i] + '</p>';
    out += '</div>';
    h += section(T('case.outcome'), out);

    /* --- 影像 --- */
    if (d.videos && d.videos.length) {
      var vh = vids(d.videos, p.img);
      if (d.links) {
        for (i = 0; i < d.links.length; i++) {
          vh += '<p class="note"><a href="' + d.links[i][0] + '" target="_blank" rel="noopener" ' +
                'style="border-bottom:1px solid var(--glass-brd2)">' + esc(d.links[i][1]) + ' ↗</a></p>';
        }
      }
      h += section(T('case.video'), vh);
    }

    return h;
  }

  /* ================================================================
     6. 案例内的交互接线
     ================================================================ */

  function wire(root, p) {
    var d = P(p);

    /* 映射：点一条亮一条 */
    var maps = root.querySelectorAll('.mapping button');
    Array.prototype.forEach.call(maps, function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(maps, function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
    });

    /* 循环：自动轮转，点了就跳过去并重新计时 */
    var loops = root.querySelectorAll('.loop button');
    if (loops.length) {
      var li = 0, timer;
      function setLoop(i) {
        li = i % loops.length;
        Array.prototype.forEach.call(loops, function (o, k) {
          o.setAttribute('aria-current', k === li ? 'true' : 'false');
        });
      }
      function run() {
        if (CALM) return;
        clearInterval(timer);
        timer = setInterval(function () { setLoop(li + 1); }, 1800);
      }
      Array.prototype.forEach.call(loops, function (o, k) {
        o.addEventListener('click', function () { setLoop(k); run(); });
      });
      run();
      root._stop = function () { clearInterval(timer); };
    }

    /* 状态切换 */
    var stage = root.querySelector('#stateStage');
    if (stage && d.concept.data) {
      var sbtns = root.querySelectorAll('.states button');
      function show(i) {
        var s = d.concept.data[i];
        // EmpaLens 的状态带图，Reground 的只有 emoji + 说明
        var isImg = typeof s[2] === 'string' && s[2].indexOf('assets/') === 0;
        stage.innerHTML = isImg
          ? '<div style="text-align:center"><span class="ph" style="display:block;border-radius:var(--r)">' +
              '<img src="' + s[2] + '" alt="' + esc(s[1]) + '"></span>' +
              '<p class="cap mono" style="color:' + s[3] + '">' + esc(s[1]) + '</p></div>'
          : '<div style="text-align:center"><div class="glyph">' + s[0] + '</div>' +
              '<p class="cap mono" style="color:' + s[3] + '">' + esc(s[1]) +
              (s[2] ? ' — ' + esc(s[2]) : '') + '</p></div>';
        watch(stage);
        Array.prototype.forEach.call(sbtns, function (o, k) {
          o.setAttribute('aria-pressed', k === i ? 'true' : 'false');
        });
      }
      Array.prototype.forEach.call(sbtns, function (o, k) {
        o.addEventListener('click', function () { show(k); });
      });
      show(0);
    }

    /* 曼陀罗宫格：悬停播放，点击锁定 */
    var clips = root.querySelectorAll('[data-clip]');
    Array.prototype.forEach.call(clips, function (c) {
      var v = c.querySelector('video');
      function play() {
        c.classList.add('playing');
        v.play().catch(function () { /* 自动播放被拦就算了 */ });
      }
      function stop() {
        if (c.dataset.lock === '1') return;
        c.classList.remove('playing');
        v.pause();
      }
      c.addEventListener('pointerenter', play);
      c.addEventListener('pointerleave', stop);
      c.addEventListener('click', function () {
        c.dataset.lock = c.dataset.lock === '1' ? '0' : '1';
        if (c.dataset.lock === '1') play(); else stop();
      });
      v.addEventListener('loadeddata', function () { c.classList.add('ready'); });
    });

    /* YouTube：点了才真正插 iframe */
    var vbtns = root.querySelectorAll('[data-yt]');
    Array.prototype.forEach.call(vbtns, function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-yt');
        b.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
          '?autoplay=1&rel=0" title="YouTube" allow="accelerometer; autoplay; clipboard-write; ' +
          'encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      });
    });

    /* 呼吸练习：4 秒吸 / 6 秒呼，深度累积，心率与用药依赖随之下降 */
    var breath = root.querySelector('#breath');
    if (breath && !CALM) {
      var depth = 0, phase = 0, bt;
      var lab = root.querySelector('#breathLab');
      function tick() {
        phase = 1 - phase;
        breath.classList.toggle('inhale', phase === 1);
        lab.textContent = T(phase === 1 ? 'case.breatheIn' : 'case.breatheOut');
        if (phase === 0) {
          depth = Math.min(100, depth + 14);      // 完成一次完整呼吸才算数
          var hr = Math.round(78 - depth * 0.18);
          var med = Math.max(20, Math.round(100 - depth * 0.62));
          root.querySelector('#bDepth').textContent = depth + '%';
          root.querySelector('#bDepthBar').style.width = depth + '%';
          root.querySelector('#bHR').textContent = hr + ' bpm';
          root.querySelector('#bHRBar').style.width = hr + '%';
          root.querySelector('#bMed').textContent = med + '%';
          root.querySelector('#bMedBar').style.width = med + '%';
        }
        bt = setTimeout(tick, phase === 1 ? 4000 : 6000);
      }
      tick();
      var prevStop = root._stop;
      root._stop = function () { clearTimeout(bt); if (prevStop) prevStop(); };
    }
  }

  /* ================================================================
     7. 浮层开关
     ================================================================ */

  var overlay, body, scrollY = 0, current = null;

  function ensure() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'case';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button class="case-close" type="button" aria-label="Close">✕</button>' +
      '<div class="case-in" id="caseIn"></div>';
    document.body.appendChild(overlay);
    body = overlay.querySelector('#caseIn');

    overlay.querySelector('.case-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  /* 浮层的开合用一条弹簧驱动。0 = 关，1 = 开。
     中途反向时从当前值继续，不会跳 —— 这就是「可打断」。 */
  var sp = null;
  function ensureSpring() {
    if (sp) return sp;
    var pane = overlay.querySelector('.case-in');
    sp = new window.Spring({
      from: 0,
      damping: 0.85,   // 浮层带一点点回弹，因为它是被「推开」的
      response: 0.34,
      onUpdate: function (v) {
        var c = Math.max(0, Math.min(1, v));
        overlay.style.setProperty('--p', c.toFixed(4));
        // 材质要「显形」而不是「淡入」：模糊和缩放一起动
        overlay.style.backdropFilter = 'blur(' + (26 * c).toFixed(1) + 'px) saturate(' + (100 + 50 * c).toFixed(0) + '%)';
        overlay.style.webkitBackdropFilter = overlay.style.backdropFilter;
        if (pane) pane.style.transform = 'scale(' + (0.94 + 0.06 * v).toFixed(4) + ')';
      },
      onRest: function (v) {
        if (v <= 0.001) {
          overlay.classList.remove('open');
          body.innerHTML = '';
          overlay.style.backdropFilter = '';
          overlay.style.webkitBackdropFilter = '';
        }
      }
    });
    return sp;
  }

  function open(key) {
    var p = null;
    for (var i = 0; i < window.PROJECTS.length; i++) {
      if (window.PROJECTS[i].key === key) { p = window.PROJECTS[i]; break; }
    }
    if (!p) return;
    current = p;
    try { ensure(); } catch (err) { console.error('[case] 浮层创建失败', err); return; }

    // 空间一致性：浮层从被点的那张卡长出来，关的时候回到同一个地方
    var card = document.querySelector('[data-case="' + key + '"]');
    if (card) {
      var r = card.getBoundingClientRect();
      overlay.style.setProperty('--ox', (r.left + r.width / 2) + 'px');
      overlay.style.setProperty('--oy', (r.top + r.height / 2) + 'px');
    } else {
      overlay.style.setProperty('--ox', '50%');
      overlay.style.setProperty('--oy', '40%');
    }

    overlay.style.setProperty('--pa', p.a + '55');
    overlay.style.setProperty('--pa-solid', p.a);
    body.innerHTML = build(p);
    watch(body);
    wire(body, p);

    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -scrollY + 'px';
    document.body.style.width = '100%';

    overlay.classList.add('open');
    overlay.scrollTop = 0;
    var s = ensureSpring();
    if (CALM) s.set(1); else s.to(1);
    // 下一帧再加 .shown，条形图才会有生长动画（同帧加会直接跳到终点）
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.add('shown'); });
    });
    overlay.querySelector('.case-close').focus();
    if (location.hash !== '#' + key) history.replaceState(null, '', '#' + key);
  }

  function close() {
    if (!overlay) return;
    if (body._stop) body._stop();
    overlay.classList.remove('shown');
    current = null;

    // 关也走同一条弹簧，同一条路径回去。中途再点开会从当前位置接住。
    if (sp) { if (CALM) sp.set(0); else sp.to(0); }
    else { overlay.classList.remove('open'); body.innerHTML = ''; }

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
    history.replaceState(null, '', location.pathname);
  }

  /* ================================================================
     8. 启动
     ================================================================ */

  renderTable();

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-case]');
    if (!b) return;
    e.preventDefault();
    open(b.getAttribute('data-case'));
  });

  // 兜底：地址栏的 # 变化也能开/关案例。委托失效、或别人直接发链接过来，都还能用。
  window.addEventListener('hashchange', function () {
    var k = location.hash.slice(1);
    if (!k) { if (current) close(); return; }
    if (!current || current.key !== k) open(k);
  });

  // 换语言：便当盒重渲染；案例开着的话原地重建，保持在同一个项目上
  window.Lang.onChange(function () {
    renderTable();
    if (current) {
      var p = current;
      if (body._stop) body._stop();
      body.innerHTML = build(p);
      watch(body);
      wire(body, p);
    }
  });

  // 支持直接用 #tears 这种地址打开某个案例
  if (location.hash.length > 1) {
    var k = location.hash.slice(1);
    setTimeout(function () { open(k); }, 60);
  }
})();

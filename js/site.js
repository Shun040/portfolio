/* ------------------------------------------------------------------
   site.js — 主页交互
   ------------------------------------------------------------------
   1. Hero 背景点阵场（field.js 的环境模式）
   2. 个人优势：滚动驱动的 3D 环形轮播 / 窄屏降级为便当盒网格
   3. 逐字错峰入场、语言切换、导航吸顶、移动端菜单、滚动高亮、滚动渐显

   项目部分不在这里 —— 便当盒和案例浮层都在 case.js，数据在 data.js。
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var DESKTOP = window.matchMedia('(min-width: 1000px)');
  var CALM = window.matchMedia('(prefers-reduced-motion: reduce)');
  function useRing() { return DESKTOP.matches && !CALM.matches; }

  /* ================================================================
     个人优势：六条能力
     ================================================================ */

  var STRENGTHS = ['s1', 's2', 's3', 's4', 's5', 's6'];

  function faceHTML(k, cls, extra) {
    return '<article class="' + cls + '"' + (extra || '') + '>' +
             '<span class="card-n mono" data-i18n="' + k + '.n"></span>' +
             '<h3 class="h3" data-i18n="' + k + '.t"></h3>' +
             '<p data-i18n="' + k + '.b"></p>' +
             '<p class="solve" data-i18n="' + k + '.s"></p>' +
           '</article>';
  }

  /* 窄屏 / 减少动效：便当盒网格 */
  function renderCards() {
    var host = document.getElementById('cards');
    if (!host) return;
    var html = '';
    for (var i = 0; i < STRENGTHS.length; i++) {
      html += faceHTML(STRENGTHS[i], 'box glass glass--hover rv',
                       ' style="--c:4;--mh:260px"');
    }
    host.innerHTML = html;
  }

  /* 桌面：3D 环形轮播 */
  function renderRing() {
    var host = document.getElementById('ringwrap');
    if (!host) return;
    var n = STRENGTHS.length, html = '', i;
    for (i = 0; i < n; i++) {
      html += faceHTML(STRENGTHS[i], 'face glass', ' style="--i:' + i + '"');
    }
    host.style.setProperty('--n', n);
    host.innerHTML =
      '<div class="ringstage">' +
        '<div class="ring" id="ring">' + html + '</div>' +
        '<div class="ring-hud mono">' +
          '<span id="ringnow">01</span>' +
          '<span class="track"><i></i></span>' +
          '<span>0' + n + '</span>' +
        '</div>' +
      '</div>';
    driveRing(host);
  }

  function driveRing(host) {
    var ring = host.querySelector('.ring');
    var faces = Array.prototype.slice.call(ring.children);
    var now = host.querySelector('#ringnow');
    var trk = host.querySelector('.ring-hud .track i');
    var n = faces.length;
    var step = 360 / n;
    var ticking = false, active = -1;

    ring.style.setProperty('--step', step + 'deg');

    // 圆柱半径：让相邻卡片刚好不相交，再留 12% 余量
    function layout() {
      var w = ring.getBoundingClientRect().width;
      var R = (w / 2) / Math.tan(Math.PI / n) * 1.12;
      ring.style.setProperty('--R', R.toFixed(1) + 'px');
    }

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    function frame() {
      ticking = false;
      var rt = host.getBoundingClientRect().top;
      var travel = host.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      var p = clamp(-rt / travel);
      var rot = -p * step * (n - 1);
      ring.style.setProperty('--rot', rot.toFixed(3) + 'deg');

      for (var i = 0; i < n; i++) {
        // 该面朝向观察者的程度：1 = 正对，-1 = 背面
        var facing = Math.cos((i * step + rot) * Math.PI / 180);
        faces[i].style.opacity = (0.12 + 0.88 * Math.max(0, facing)).toFixed(3);
        faces[i].setAttribute('data-front', facing > 0.86 ? 'true' : 'false');
      }

      if (trk) trk.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var idx = Math.min(n - 1, Math.round(p * (n - 1)));
      if (idx !== active) {
        active = idx;
        if (now) now.textContent = '0' + (idx + 1);
      }
    }

    function mark() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener('scroll', mark, { passive: true });
    window.addEventListener('resize', function () { layout(); mark(); }, { passive: true });
    layout();
    mark();
  }

  /* ================================================================
     逐字错峰入场
     ----------------------------------------------------------------
     只拆标题。递归遍历子节点，<em> 和 <br> 原样保留；
     空格不包 span，换行行为跟拆之前一致。
     ================================================================ */

  var splitTargets = null;

  function splitNode(node, state) {
    var kids = Array.prototype.slice.call(node.childNodes);
    for (var i = 0; i < kids.length; i++) {
      var kid = kids[i];
      if (kid.nodeType === 3) {
        var txt = kid.nodeValue;
        var frag = document.createDocumentFragment();
        for (var j = 0; j < txt.length; j++) {
          var ch = txt[j];
          if (ch === ' ' || ch === '\n' || ch === '\t') {
            frag.appendChild(document.createTextNode(ch));
            continue;
          }
          var s = document.createElement('span');
          s.className = 'ch';
          s.style.setProperty('--d', (state.i * 0.026).toFixed(3) + 's');
          s.textContent = ch;
          frag.appendChild(s);
          state.i++;
        }
        node.replaceChild(frag, kid);
      } else if (kid.nodeType === 1 && kid.tagName !== 'BR') {
        splitNode(kid, state);
      }
    }
  }

  function splitAll() {
    if (!splitTargets) {
      splitTargets = Array.prototype.slice.call(document.querySelectorAll('.split'));
    }
    splitTargets.forEach(function (el) { splitNode(el, { i: 0 }); });
  }

  /* ================================================================
     启动
     ================================================================ */

  // 两个容器只留一个，另一个从 DOM 移除
  var ringHost = document.getElementById('ringwrap');
  var cardsHost = document.getElementById('cards');
  if (useRing()) {
    if (cardsHost) cardsHost.remove();
    renderRing();
  } else {
    if (ringHost) ringHost.remove();
    renderCards();
  }

  window.Lang.init();
  splitAll();                // 拆字必须在文案写入之后

  // 换语言会重写 innerHTML，拆好的字会被冲掉，所以重拆一次；
  // 已经入场过的标题保持可见，不要倒回去重播
  window.Lang.onChange(function () {
    splitAll();
    splitTargets.forEach(function (el) {
      if (el.classList.contains('in')) {
        el.classList.remove('in');
        void el.offsetWidth;
        el.classList.add('in');
      }
    });
  });

  // 跨越断点时换一套形态；容器已删掉一个，重载最省事也最不易出错
  var wasRing = useRing();
  DESKTOP.addEventListener('change', function () {
    if (useRing() !== wasRing) location.reload();
  });

  /* ---------- Hero 背景 ---------- */
  var hf = document.getElementById('herofield');
  if (hf && window.Field) {
    new Field(hf, {
      text: '',
      cell: 15,
      gain: .95,
      speed: .35,
      fluid: false,   // 背景不做交互，只做极慢漂移，不抢标题
      fps: 30,
      // 没有遮罩和指针时 v 的上限只有 n*0.46*gain ≈ 0.44，
      // 阈值必须压到它下面，否则整片都被跳过、画布全黑
      threshold: .27
    });
  }

  /* ---------- 语言切换 ---------- */
  var langBtn = document.getElementById('lang');
  if (langBtn) langBtn.addEventListener('click', function () { window.Lang.toggle(); });

  /* ---------- 导航吸顶 ---------- */
  var bar = document.getElementById('bar');
  function onScroll() { bar.classList.toggle('stuck', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 移动端菜单 ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = bar.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        bar.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 当前区块高亮 ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute('aria-current',
            a.getAttribute('href') === '#' + en.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------- 滚动渐显 / 逐字入场触发 ---------- */
  var rv = document.querySelectorAll('.rv, .split');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
    Array.prototype.forEach.call(rv, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(rv, function (el) { el.classList.add('in'); });
  }
})();

/* ------------------------------------------------------------------
   site.js — 主页交互
   ------------------------------------------------------------------
   1. Hero 背景点阵场（field.js 的环境模式）
   2. 逐字错峰入场、骨架屏收尾、语言切换、导航吸顶、移动端菜单、滚动渐显

   项目部分不在这里 —— 便当盒和案例浮层都在 case.js，数据在 data.js。
   ------------------------------------------------------------------ */

(function () {
  'use strict';

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

  /* ---------- 骨架屏收尾 ----------
     .ph 里的图在加载完之前是 opacity:0。case.js 只负责它自己生成的那些，
     静态 HTML 里的（比如人物图）得在这里收尾，否则永远不显示。 */
  Array.prototype.forEach.call(document.querySelectorAll('.ph > img, .ph > video'), function (m) {
    var box = m.parentNode;
    function done() { box.classList.add('ready'); }
    if (m.tagName === 'IMG') {
      if (m.complete && m.naturalWidth) return done();
    } else if (m.readyState >= 2) {
      return done();
    }
    m.addEventListener(m.tagName === 'IMG' ? 'load' : 'loadeddata', done);
    m.addEventListener('error', done);   // 失败也要收尾，不然扫光一直闪
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

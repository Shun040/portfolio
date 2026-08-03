/* ------------------------------------------------------------------
   site.js — 档案页的基础交互
   ------------------------------------------------------------------
   1. 语言切换
   2. 履历表（获奖 / 参展）
   3. 骨架屏收尾（证件照）
   4. 导航当前项高亮

   作品表和案例浮层在 case.js，项目数据在 data.js。
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- 履历表 ---------- */
  function renderCV() {
    var host = document.getElementById('cvtables');
    if (!host || !window.CV) return;
    var L = window.Lang.get();

    var aw = '';
    window.CV.awards[L].forEach(function (a) {
      aw += '<li><span class="yr">' + esc(a[0]) + '</span>' +
            '<span><b>' + esc(a[1]) + '</b></span></li>';
    });

    var sh = '';
    window.CV.shows[L].forEach(function (a) {
      sh += '<li><span class="yr">' + esc(a[0]) + '</span><span>' +
            (a[1] ? '<b>' + esc(a[1]) + '</b>' : '') +
            (a[1] && a[2] ? '<br>' : '') +
            (a[2] ? '<span class="ve">' + esc(a[2]) + '</span>' : '') +
            '</span></li>';
    });

    host.innerHTML =
      '<div><p class="mono" style="margin-bottom:var(--s3)">' +
        esc(window.Lang.t('cv.awards')) + '</p>' +
        '<ul class="cvtable">' + aw + '</ul></div>' +
      '<div><p class="mono" style="margin-bottom:var(--s3)">' +
        esc(window.Lang.t('cv.shows')) + '</p>' +
        '<ul class="cvtable">' + sh + '</ul></div>';
  }

  /* ---------- 骨架屏收尾 ----------
     .ph 里的图在加载完之前是 opacity:0。case.js 只管它自己生成的，
     静态 HTML 里的（证件照）在这里收尾，否则永远不显示。 */
  function settle(root) {
    var media = (root || document).querySelectorAll('.ph > img, .ph > video');
    Array.prototype.forEach.call(media, function (m) {
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
  }
  window.ArchiveSettle = settle;   // case.js 复用

  /* ---------- 启动 ---------- */
  window.Lang.init();
  renderCV();
  settle();
  window.Lang.onChange(renderCV);

  var langBtn = document.getElementById('lang');
  if (langBtn) langBtn.addEventListener('click', function () { window.Lang.toggle(); });

  /* ---------- 导航当前项 ---------- */
  var nav = document.getElementById('nav');
  if (nav && 'IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var targets = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    if (targets.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.setAttribute('aria-current',
              a.getAttribute('href') === '#' + en.target.id ? 'true' : 'false');
          });
        });
      }, { rootMargin: '-25% 0px -60% 0px' });
      targets.forEach(function (t) { spy.observe(t); });
    }
  }
})();

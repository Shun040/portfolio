/* ------------------------------------------------------------------
   field.js — 流体点阵场 / Interactive fluid dot-matrix
   ------------------------------------------------------------------
   概念：整块画布是一片低对比度点阵噪点，名字被"写"在里面但只是隐约可见。
   光标划过时做两件事：
     1) 往速度场里注入动量 —— 点阵被推开、拉丝、形成涡流（流体扭曲）
     2) 提高该区域的对比度 —— 名字被"显影"出来
   同时名字本身作为染料（dye）被速度场平流，所以你能把字**揉散**，
   松手后它会在几秒内慢慢愈合复原。

   —— 呼应作品集主题：看不见的东西，要被搅动才显形。

   实现是一个粗网格的半拉格朗日流体（advect → diffuse → damp），
   分辨率就是点阵本身的分辨率（约 120×75），所以整套只有约 9000 个格子，
   纯 JS 也能稳在 60fps，不需要 WebGL。

   性能策略：
   - 点按 alpha 量化成 7 档，每档只做一次 beginPath / fill
   - 低于阈值的点直接跳过
   - devicePixelRatio 上限 2，帧率可配置
   - prefers-reduced-motion 下关闭流体，只渲染一帧静态图
   ------------------------------------------------------------------ */

(function (global) {
  'use strict';

  var REDUCED = global.matchMedia &&
    global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 廉价的 2D 值噪声（底噪用） ---------- */
  function hash2(x, y) {
    var n = x * 374761393 + y * 668265263;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) >>> 0) / 4294967295;
  }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = smooth(x - xi), yf = smooth(y - yi);
    var a = hash2(xi, yi), b = hash2(xi + 1, yi);
    var c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
    var top = a + (b - a) * xf, bot = c + (d - c) * xf;
    return top + (bot - top) * yf;
  }
  function fbm(x, y) {
    return vnoise(x, y) * 0.65 + vnoise(x * 2.13 + 11.3, y * 2.13 - 7.1) * 0.35;
  }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ================================================================ */
  function Field(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    var o = opts || {};

    this.text = o.text || '';
    this.cell = o.cell || 13;
    this.gain = o.gain === undefined ? 1 : o.gain;
    this.speed = o.speed === undefined ? 1 : o.speed;
    this.fluid = o.fluid === undefined ? true : o.fluid;   // 流体 + 指针交互
    // 名字是否被流体揉散。默认 false —— 搅动的是名字周围的场，
    // 名字本身始终保持清晰，否则鼠标一上去就读不出字了。
    this.distortText = !!o.distortText;
    this.baseReveal = o.baseReveal === undefined ? 0.34 : o.baseReveal;
    this.fps = o.fps || 60;
    this.fg = o.fg || '237,238,241';
    this.ac = o.ac || '124,140,255';
    this.threshold = o.threshold === undefined ? 0.30 : o.threshold;

    this.px = -9999; this.py = -9999;
    this.ppx = -9999; this.ppy = -9999;
    this.pointerAt = -9999;
    this.collapse = 0;
    this.t0 = performance.now();
    this.last = 0;

    this._onResize = this.resize.bind(this);
    this._onMove = this._move.bind(this);
    this._tick = this._frame.bind(this);

    this.resize();
    global.addEventListener('resize', this._onResize, { passive: true });
    if (this.fluid && !REDUCED) {
      global.addEventListener('pointermove', this._onMove, { passive: true });
      global.addEventListener('pointerdown', this._onMove, { passive: true });
    }

    if (REDUCED) this._render(0);
    else this.raf = requestAnimationFrame(this._tick);
  }

  /* ---------- 指针 → 速度场注入 ---------- */
  Field.prototype._move = function (e) {
    var x = e.clientX, y = e.clientY;
    if (this.ppx > -9000) {
      // 用位移量作为动量，快速划动力度更大
      this._inject(x, y, x - this.ppx, y - this.ppy);
    }
    this.ppx = x; this.ppy = y;
    this.px = x; this.py = y;
    this.pointerAt = performance.now();
  };

  Field.prototype._inject = function (x, y, dx, dy) {
    if (!this.vx) return;
    var cs = this.cs, cols = this.cols, rows = this.rows;
    var gx = x / cs, gy = y / cs;
    var R = this.w < 700 ? 5 : 6.5;              // 注入半径（格）
    var R2 = R * R;
    // 位移换算到格坐标，并限幅，避免一次甩动直接把场炸掉
    var ix = Math.max(-3, Math.min(3, dx / cs)) * 0.55;
    var iy = Math.max(-3, Math.min(3, dy / cs)) * 0.55;

    var x0 = Math.max(0, (gx - R) | 0), x1 = Math.min(cols - 1, (gx + R) | 0);
    var y0 = Math.max(0, (gy - R) | 0), y1 = Math.min(rows - 1, (gy + R) | 0);

    for (var j = y0; j <= y1; j++) {
      for (var i = x0; i <= x1; i++) {
        var ddx = i - gx, ddy = j - gy;
        var d2 = ddx * ddx + ddy * ddy;
        if (d2 > R2) continue;
        var f = 1 - d2 / R2;
        f *= f;
        var k = j * cols + i;
        this.vx[k] += ix * f;
        this.vy[k] += iy * f;
      }
    }
  };

  /* ---------- 尺寸 ---------- */
  Field.prototype.resize = function () {
    var c = this.canvas;
    var w = c.clientWidth || global.innerWidth;
    var h = c.clientHeight || global.innerHeight;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);

    this.w = w; this.h = h;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.cs = w < 700 ? this.cell + 3 : this.cell;
    this.cols = Math.ceil(w / this.cs) + 1;
    this.rows = Math.ceil(h / this.cs) + 1;

    var n = this.cols * this.rows;
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.tx = new Float32Array(n);      // 平流用的临时缓冲
    this.ty = new Float32Array(n);
    this.dye = new Float32Array(n);
    this.tdye = new Float32Array(n);

    this._buildMask();
    if (this.mask) this.dye.set(this.mask);
    if (REDUCED) this._render(0);
  };

  /* 把文字光栅化到网格分辨率 */
  Field.prototype._buildMask = function () {
    this.mask = null;
    if (!this.text) return;

    var cols = this.cols, rows = this.rows;
    var m = document.createElement('canvas');
    m.width = cols; m.height = rows;
    var g = m.getContext('2d');

    var target = cols * (this.w < 700 ? 0.86 : 0.74);
    var size = 10;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    var font = function (s) {
      return '700 ' + s + 'px ui-sans-serif, -apple-system, "PingFang SC", "Helvetica Neue", Arial, sans-serif';
    };
    g.font = font(size);
    var wpx = g.measureText(this.text).width || 1;
    size = Math.max(4, size * target / wpx);
    g.font = font(size);
    g.fillStyle = '#fff';
    g.fillText(this.text, cols / 2, rows / 2 + size * 0.04);

    var data = g.getImageData(0, 0, cols, rows).data;
    var out = new Float32Array(cols * rows);
    for (var i = 0, n = cols * rows; i < n; i++) out[i] = data[i * 4 + 3] / 255;
    this.mask = out;
  };

  /* ---------- 流体步进 ---------- */
  // 双线性采样
  function sample(f, cols, rows, x, y) {
    if (x < 0) x = 0; else if (x > cols - 1.001) x = cols - 1.001;
    if (y < 0) y = 0; else if (y > rows - 1.001) y = rows - 1.001;
    var xi = x | 0, yi = y | 0;
    var xf = x - xi, yf = y - yi;
    var k = yi * cols + xi;
    var a = f[k], b = f[k + 1], c = f[k + cols], d = f[k + cols + 1];
    var t = a + (b - a) * xf;
    return t + ((c + (d - c) * xf) - t) * yf;
  }

  Field.prototype._step = function () {
    var cols = this.cols, rows = this.rows;
    var vx = this.vx, vy = this.vy, tx = this.tx, ty = this.ty;
    var dye = this.dye, tdye = this.tdye, mask = this.mask;
    var i, j, k;

    // 1) 平流：把速度和染料沿速度场回溯采样
    for (j = 0; j < rows; j++) {
      for (i = 0; i < cols; i++) {
        k = j * cols + i;
        var sx = i - vx[k], sy = j - vy[k];
        tx[k] = sample(vx, cols, rows, sx, sy);
        ty[k] = sample(vy, cols, rows, sx, sy);
        tdye[k] = this.distortText ? sample(dye, cols, rows, sx, sy) : dye[k];
      }
    }

    // 2) 扩散 + 衰减：四邻域平均，速度慢慢散开并停下来
    var DAMP = 0.962, MIX = 0.14;
    for (j = 0; j < rows; j++) {
      var up = j > 0 ? -cols : 0, dn = j < rows - 1 ? cols : 0;
      for (i = 0; i < cols; i++) {
        k = j * cols + i;
        var le = i > 0 ? -1 : 0, ri = i < cols - 1 ? 1 : 0;
        var ax = (tx[k + le] + tx[k + ri] + tx[k + up] + tx[k + dn]) * 0.25;
        var ay = (ty[k + le] + ty[k + ri] + ty[k + up] + ty[k + dn]) * 0.25;
        var nx = (tx[k] + (ax - tx[k]) * MIX) * DAMP;
        var ny = (ty[k] + (ay - ty[k]) * MIX) * DAMP;
        // 速度低到看不见时直接归零，省掉长尾计算
        vx[k] = nx * nx < 1e-8 ? 0 : nx;
        vy[k] = ny * ny < 1e-8 ? 0 : ny;

        // 3) 染料回弹：被揉散的名字慢慢愈合回原样
        var d = tdye[k];
        if (mask) d += (mask[k] - d) * 0.022;
        dye[k] = d;
      }
    }
  };

  /* ---------- 渲染 ---------- */
  var BUCKETS = 7;

  Field.prototype._frame = function (now) {
    this.raf = requestAnimationFrame(this._tick);
    var min = 1000 / this.fps;
    if (now - this.last < min) return;
    this.last = now;
    if (this.fluid) this._step();
    this._render(now - this.t0);
  };

  Field.prototype._render = function (elapsed) {
    var ctx = this.ctx, cs = this.cs, cols = this.cols, rows = this.rows;
    var dye = this.dye, mask = this.mask, gain = this.gain;
    var vx = this.vx, vy = this.vy;
    var t = elapsed * 0.00016 * this.speed;
    var fluid = this.fluid && !REDUCED;

    ctx.clearRect(0, 0, this.w, this.h);

    // 指针周围额外提亮一圈，作为"感应范围"的提示
    var lx = this.px, ly = this.py, lr = 0, hasLens = false;
    if (fluid && this.px > -9000) {
      lr = Math.min(this.w, this.h) * (this.w < 700 ? 0.34 : 0.26);
      hasLens = true;
    }
    var invR = lr ? 1 / lr : 0;

    var thr = this.threshold + this.collapse * 0.9;
    var base = this.baseReveal;

    var bx = [], i;
    for (i = 0; i < BUCKETS; i++) bx.push([]);
    var accent = [];

    for (var gy = 0; gy < rows; gy++) {
      var y = gy * cs;
      for (var gx = 0; gx < cols; gx++) {
        var k = gy * cols + gx;
        var x = gx * cs;

        var n = fbm(gx * 0.055 + t, gy * 0.055 - t * 0.6);

        var lens = 0;
        if (hasLens) {
          var ddx = (x - lx) * invR, ddy = (y - ly) * invR;
          var d2 = ddx * ddx + ddy * ddy;
          lens = d2 < 1 ? (1 - d2) * (1 - d2) : 0;
        }

        // 名字：底显影 + 指针处强显影。dye 是被流体揉过的版本
        var dv = mask ? (fluid ? dye[k] : mask[k]) : 0;
        var reveal = dv * (base + lens * 0.95);

        var v = (n * 0.46 + reveal + lens * 0.05) * gain;
        v = clamp01(v);
        if (v <= thr) continue;

        var s = (v - thr) / (1 - thr);
        var size = cs * (0.14 + s * 0.60);
        var ox = x + (cs - size) * 0.5;
        var oy = y + (cs - size) * 0.5;

        // 流体位移：点被速度场推离原位，快速划动时拉出丝状轨迹
        if (fluid) {
          var svx = vx[k], svy = vy[k];
          if (svx || svy) {
            // 名字所在的格子几乎不位移（mask 越高越钉得牢），
            // 所以搅动看起来像是流体绕着字流过去，字始终清晰
            var hold = this.distortText ? 1 : (mask ? 1 - mask[k] * 0.88 : 1);
            ox += svx * cs * 0.9 * hold;
            oy += svy * cs * 0.9 * hold;
            // 速度越高越亮，涡流因此可见
            var sp = Math.abs(svx) + Math.abs(svy);
            if (sp > 0.04) s = clamp01(s + Math.min(0.45, sp * 0.5));
          }
        }

        var b = Math.min(BUCKETS - 1, (s * BUCKETS) | 0);
        bx[b].push(ox, oy, size, size);
        if (reveal > 0.22 && s > 0.35) accent.push(ox, oy, size, size);
      }
    }

    var fade = 1 - this.collapse;
    for (i = 0; i < BUCKETS; i++) {
      var a = bx[i];
      if (!a.length) continue;
      ctx.globalAlpha = (0.10 + (i / (BUCKETS - 1)) * 0.80) * fade;
      ctx.fillStyle = 'rgb(' + this.fg + ')';
      ctx.beginPath();
      for (var jj = 0; jj < a.length; jj += 4) ctx.rect(a[jj], a[jj + 1], a[jj + 2], a[jj + 3]);
      ctx.fill();
    }

    if (accent.length) {
      ctx.globalAlpha = 0.42 * fade;
      ctx.fillStyle = 'rgb(' + this.ac + ')';
      ctx.beginPath();
      for (i = 0; i < accent.length; i += 4) {
        ctx.rect(accent[i] + 1.2, accent[i + 1] - 0.8, accent[i + 2], accent[i + 3]);
      }
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  /* 换语言：重建遮罩，染料直接跟上（不做过渡，切换应当是干脆的） */
  Field.prototype.setText = function (txt) {
    this.text = txt;
    this._buildMask();
    if (this.mask) this.dye.set(this.mask);
    else if (this.dye) this.dye.fill(0);
    if (REDUCED) this._render(0);
  };

  /* 进场转场：点阵坍缩 */
  Field.prototype.collapseOut = function (ms) {
    var self = this, dur = ms || 700, start = performance.now();
    return new Promise(function (done) {
      (function step(now) {
        var p = Math.min(1, (now - start) / dur);
        self.collapse = p * p;
        if (REDUCED) self._render(0);
        if (p < 1) requestAnimationFrame(step); else done();
      })(start);
    });
  };

  Field.prototype.destroy = function () {
    cancelAnimationFrame(this.raf);
    global.removeEventListener('resize', this._onResize);
    global.removeEventListener('pointermove', this._onMove);
    global.removeEventListener('pointerdown', this._onMove);
  };

  global.Field = Field;
  global.Field.reducedMotion = REDUCED;
})(window);

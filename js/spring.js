/* ------------------------------------------------------------------
   spring.js — 一个极小的弹簧引擎（约 60 行，不依赖任何库）
   ------------------------------------------------------------------
   为什么不用 CSS transition：
   过渡动画一旦开始就锁死了，中途改目标会从"逻辑值"重新算，画面会跳。
   弹簧永远从**当前屏幕上的值**出发，所以随时改目标都是连续的 ——
   这正是"可打断"的全部含义（Apple 把这条列为流体界面里最重要的一条）。

   参数按 Apple 的两个设计师友好参数来，不用质量/劲度/阻尼三件套：
     damping  阻尼比。1.0 = 临界阻尼，不过冲；< 1 会回弹，越小越弹
     response 响应时间（秒）。越小越快。注意它不是"时长" ——
              弹簧没有固定时长，停下来的时间是从参数里自然长出来的

   Apple 的常用值：
     移动/重定位  damping 1.0  response 0.4
     抽屉/浮层    damping 0.8  response 0.3
   ------------------------------------------------------------------ */

(function (global) {
  'use strict';

  function Spring(opts) {
    opts = opts || {};
    this.value = opts.from === undefined ? 0 : opts.from;
    this.target = this.value;
    this.vel = 0;
    this.zeta = opts.damping === undefined ? 1 : opts.damping;
    this.w = 2 * Math.PI / (opts.response || 0.4);   // 自然角频率
    this.onUpdate = opts.onUpdate || function () {};
    this.onRest = opts.onRest || function () {};
    this.raf = null;
    this.last = 0;
    this._tick = this._step.bind(this);
  }

  /* 改目标。不重置速度 —— 反向时速度被带过去，不会撞出一堵墙 */
  Spring.prototype.to = function (v) {
    this.target = v;
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this._tick);
    }
    return this;
  };

  /* 直接落位，不走动画（用于 prefers-reduced-motion） */
  Spring.prototype.set = function (v) {
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.value = this.target = v;
    this.vel = 0;
    this.onUpdate(v);
    this.onRest(v);
    return this;
  };

  Spring.prototype._step = function (now) {
    var dt = Math.min((now - this.last) / 1000, 1 / 30);   // 掉帧时限幅，防止炸开
    this.last = now;

    // 固定小步长积分，保证不同刷新率下手感一致
    var steps = Math.max(1, Math.ceil(dt / (1 / 240)));
    var h = dt / steps;
    for (var i = 0; i < steps; i++) {
      var a = -this.w * this.w * (this.value - this.target) - 2 * this.zeta * this.w * this.vel;
      this.vel += a * h;
      this.value += this.vel * h;
    }

    this.onUpdate(this.value);

    // 位移和速度都小到看不见了才停
    if (Math.abs(this.value - this.target) < 0.0005 && Math.abs(this.vel) < 0.0005) {
      this.value = this.target;
      this.vel = 0;
      this.raf = null;
      this.onUpdate(this.value);
      this.onRest(this.value);
      return;
    }
    this.raf = requestAnimationFrame(this._tick);
  };

  global.Spring = Spring;
})(window);

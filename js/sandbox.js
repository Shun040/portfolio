/* ------------------------------------------------------------------
   sandbox.js — 首页沙盒
   ------------------------------------------------------------------
   一个浅口沙盒，里面摆着六件物体，每件对应一个项目。
   鼠标悬停 → 物体浮起并缓慢旋转；点击 → 物体被「抓」向镜头，然后跳转。

   物体来源有两级：
     1. assets/models/<key>.glb —— 有模型就用模型
     2. 没有就用基本几何体拼一个有辨识度的替身
   两级都走同一套交互，所以模型可以以后再补，不用改代码。

   浮起用的是 spring.js 那条弹簧：从当前高度出发，随时可打断。
   鼠标在两件物体之间快速划过时，上一件会从半空被接住往回落，
   不会先播完再反向。
   ------------------------------------------------------------------ */

// 用相对路径而不是裸名 'three' —— 裸名要靠 import map，
// 而 import map 在 Safari 16.4 之前不支持，解析失败会让整个模块不执行
import * as THREE from '../assets/vendor/three.module.js';

const HOST = document.getElementById('sandbox');
const LABEL = document.getElementById('sb-label');
const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 六件物体：位置、替身几何、对应项目 */
const ITEMS = [
  { key: 'tears',        x: -2.05, z: -0.55, build: handset },
  { key: 'exstasis',     x: -0.70, z:  0.62, build: petriDish },
  { key: 'painshift',    x:  0.65, z: -0.72, build: headset },
  { key: 'reground',     x:  2.00, z:  0.50, build: bird },
  { key: 'empalens',     x: -1.95, z:  1.62, build: glasses },
  { key: 'through-eyes', x:  1.20, z:  1.70, build: pinhole }
];

/* ---------- 材质：奶油白，一个红 ---------- */
const CREAM = 0xECE7D4;
const RED   = 0xC5283D;
const mat = (c = CREAM, rough = 0.62, metal = 0.04) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal });

/* ---------- 六个替身：用基本几何体拼出可辨认的轮廓 ---------- */
function handset() {                    // 壁挂电话的听筒
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.62, 4, 12), mat());
  body.rotation.z = Math.PI / 2;
  const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.12, 20), mat(CREAM, 0.5));
  ear.position.set(-0.42, 0.04, 0);
  const mouth = ear.clone(); mouth.position.x = 0.42;
  g.add(body, ear, mouth);
  return g;
}
function petriDish() {                  // 培养皿
  const g = new THREE.Group();
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.13, 40),
    new THREE.MeshPhysicalMaterial({ color: 0xE8E4D2, roughness: 0.12, transmission: 0.55, thickness: 0.4, transparent: true, opacity: 0.9 }));
  const colony = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 1), mat(RED, 0.85));
  colony.position.y = 0.07;
  colony.scale.set(1, 0.42, 1);
  g.add(dish, colony);
  return g;
}
function headset() {                    // VR 头显
  const g = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.42, 0.42), mat(CREAM, 0.55));
  const lens = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 10, 24), mat(RED, 0.5));
  lens.position.set(-0.18, 0, 0.22);
  const lens2 = lens.clone(); lens2.position.x = 0.18;
  const strap = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 8, 28, Math.PI), mat(CREAM, 0.8));
  strap.rotation.y = Math.PI / 2; strap.position.z = -0.18;
  g.add(box, lens, lens2, strap);
  return g;
}
function bird() {                       // 陪伴机器人（毛绒小鸟）
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 28, 20), mat(CREAM, 0.95));
  body.scale.set(1, 0.92, 0.88);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 18), mat(CREAM, 0.95));
  head.position.set(0, 0.34, 0.05);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 12), mat(RED, 0.6));
  beak.position.set(0, 0.32, 0.24); beak.rotation.x = Math.PI / 2;
  g.add(body, head, beak);
  return g;
}
function glasses() {                    // 智能眼镜
  const g = new THREE.Group();
  const l = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.028, 10, 28), mat(CREAM, 0.35, 0.5));
  l.position.x = -0.24;
  const r = l.clone(); r.position.x = 0.24;
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.026, 0.026), mat(CREAM, 0.35, 0.5));
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 24), mat(RED, 0.4));
  badge.position.set(0, -0.02, 0.3); badge.rotation.x = Math.PI / 2;
  g.add(l, r, bridge, badge);
  return g;
}
function pinhole() {                    // 针孔摄像头
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.36, 26), mat(CREAM, 0.42, 0.35));
  body.rotation.z = Math.PI / 2;
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 14), mat(RED, 0.15, 0.2));
  lens.position.x = 0.19;
  g.add(body, lens);
  return g;
}

/* ================================================================== */
function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  HOST.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 4.3, 6.1);
  camera.lookAt(0, 0.1, 0.25);

  /* ---------- 沙盘本体 ----------
     照心理治疗用的沙盘做：木框、内壁涂蓝（底表示水、侧表示天）、细沙。
     真实规格 57 × 72 × 7cm —— 这个比例是有讲究的，正好落在一个人
     不用转头就能看全的视野里。这里按 1 : 1.26 还原。 */
  const box = new THREE.Group();
  const W = 6.3, D = 5.0, WALL = 0.2, H = 0.52;

  // 蓝色内胆：沙薄的地方会露出来，就是沙盘里的「水」
  const blue = new THREE.MeshStandardMaterial({ color: 0x1E4E78, roughness: 0.62 });
  const basin = new THREE.Mesh(new THREE.BoxGeometry(W, 0.16, D), blue);
  basin.position.y = -0.08;
  basin.receiveShadow = true;
  box.add(basin);

  const blueWall = (w, d, x, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, H, d), blue);
    m.position.set(x, H / 2 - 0.02, z);
    m.receiveShadow = true;
    return m;
  };
  box.add(blueWall(W, 0.04, 0, -D / 2 + 0.02));
  box.add(blueWall(0.04, D, -W / 2 + 0.02, 0));
  box.add(blueWall(0.04, D,  W / 2 - 0.02, 0));

  // 木框
  const wood = new THREE.MeshStandardMaterial({ color: 0x6A4B30, roughness: 0.82, metalness: 0.02 });
  const rim = (w, d, x, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, H + 0.08, d), wood);
    m.position.set(x, (H + 0.08) / 2 - 0.06, z);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };
  box.add(rim(W + WALL * 2, WALL, 0, -D / 2 - WALL / 2));
  box.add(rim(W + WALL * 2, WALL, 0,  D / 2 + WALL / 2));
  box.add(rim(WALL, D, -W / 2 - WALL / 2, 0));
  box.add(rim(WALL, D,  W / 2 + WALL / 2, 0));

  // 沙面：把平面的顶点按噪声推高推低，形成沙丘与浅坑
  const sandGeo = new THREE.PlaneGeometry(W - 0.06, D - 0.06, 96, 76);
  const pos = sandGeo.attributes.position;
  const h2 = (x, y) => {                       // 廉价的值噪声
    const n = Math.sin(x * 1.7) * Math.cos(y * 2.1) +
              Math.sin(x * 3.9 + 1.3) * Math.cos(y * 4.4 - 0.7) * 0.45 +
              Math.sin(x * 8.2 - 2.1) * Math.cos(y * 7.6 + 1.1) * 0.16;
    return n;
  };
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    // 靠近边框的地方沙更薄，露出一点蓝
    const edge = Math.min(1, Math.min((W / 2 - Math.abs(x)) / 0.7, (D / 2 - Math.abs(y)) / 0.7));
    pos.setZ(i, h2(x, y) * 0.035 * edge + 0.02 * edge);
  }
  sandGeo.computeVertexNormals();
  const sand = new THREE.Mesh(sandGeo, new THREE.MeshStandardMaterial({
    color: 0xC4B79B, roughness: 1, metalness: 0
  }));
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = 0.03;
  sand.receiveShadow = true;
  box.add(sand);

  scene.add(box);

  /* ---------- 光 ---------- */
  scene.add(new THREE.AmbientLight(0x7E90B8, 0.42));
  const key = new THREE.DirectionalLight(0xFFEFD4, 2.35);
  key.position.set(3.2, 6.4, 4.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  key.shadow.camera.left = -5; key.shadow.camera.right = 5;
  key.shadow.camera.top = 5; key.shadow.camera.bottom = -5;
  key.shadow.bias = -0.0012;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8FA0FF, 0.75);   // 冷补光，别和木框的 rim() 重名
  fill.position.set(-4.5, 2.2, -3.5);
  scene.add(fill);

  /* ---------- 物体 ---------- */
  // GLTFLoader 单独动态加载：没有它照样能跑（用替身几何体），
  // 静态 import 的话它一挂，整个模块都不会执行，页面就是一片空白
  let loader = null;
  import('../assets/vendor/GLTFLoader.js')
    .then(m => { loader = new m.GLTFLoader(); loadModels(); })
    .catch(e => console.warn('[sandbox] GLTFLoader 未加载，使用替身几何体', e));

  const objs = [];
  const pending = [];

  ITEMS.forEach((it, i) => {
    const pivot = new THREE.Group();          // 负责浮起与旋转
    pivot.position.set(it.x, 0, it.z);
    pivot.userData = { key: it.key, i, baseRot: (i * 0.7) % (Math.PI * 2) };
    pivot.rotation.y = pivot.userData.baseRot;
    scene.add(pivot);

    const place = (node) => {
      node.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      pivot.add(node);
    };

    // 先放替身，模型加载成功再换掉 —— 页面不会有空窗
    const stand = it.build();
    stand.position.y = 0.34;
    place(stand);

    pending.push(() => loader.load(
      'assets/models/' + it.key + '.glb',
      (gltf) => {
        const m = gltf.scene;
        // 统一尺寸：把模型缩放到最长边 0.9，坐在盒底上
        const bb = new THREE.Box3().setFromObject(m);
        const size = bb.getSize(new THREE.Vector3());
        const s = 0.9 / Math.max(size.x, size.y, size.z || 1);
        m.scale.setScalar(s);
        const bb2 = new THREE.Box3().setFromObject(m);
        m.position.y -= bb2.min.y;
        pivot.remove(stand);
        place(m);
      },
      undefined,
      () => { /* 没有模型就一直用替身，不报错 */ }
    ));

    // 每件物体一条弹簧，控制浮起高度 0 → 1
    const spring = new window.Spring({
      from: 0, damping: 0.72, response: 0.42,
      onUpdate: (v) => {
        pivot.position.y = 0.05 + v * 0.62;
        pivot.scale.setScalar(1 + v * 0.06);
      }
    });

    objs.push({ pivot, spring, key: it.key, hot: 0 });
  });

  function loadModels() { pending.forEach(fn => fn()); }

  /* ---------- 拾取 ---------- */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2(-9, -9);
  let hover = null, grabbing = false;

  function resize() {
    const w = HOST.clientWidth, h = HOST.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  HOST.addEventListener('pointermove', (e) => {
    const r = HOST.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }, { passive: true });
  HOST.addEventListener('pointerleave', () => { ptr.set(-9, -9); }, { passive: true });

  function setHover(o) {
    if (hover === o) return;
    if (hover) hover.spring.to(0);
    hover = o;
    if (hover) hover.spring.to(1);

    HOST.style.cursor = hover ? 'pointer' : '';
    if (!LABEL) return;
    if (!hover) { LABEL.classList.remove('on'); return; }
    const p = window.PROJECTS.find(x => x.key === hover.key);
    const d = p[window.Lang.get()];
    LABEL.innerHTML = '<span class="no">' + p.id + '</span>' +
                      '<span class="nm">' + d.name + '</span>' +
                      '<span class="ty">' + d.type + '</span>';
    LABEL.classList.add('on');
  }

  /* 点击 = 抓取：物体扑向镜头，同时整体压暗，然后跳转 */
  HOST.addEventListener('click', () => {
    if (!hover || grabbing) return;
    grabbing = true;
    const target = hover;
    const from = target.pivot.position.clone();
    const to = new THREE.Vector3(0, 2.5, 4.4);      // 镜头前
    const t0 = performance.now();
    HOST.classList.add('grabbing');

    (function fly(now) {
      const k = Math.min(1, (now - t0) / 620);
      const e = 1 - Math.pow(1 - k, 3);             // ease-out cubic
      target.pivot.position.lerpVectors(from, to, e);
      target.pivot.scale.setScalar(1 + e * 1.5);
      target.pivot.rotation.y += 0.055;
      if (k < 1) requestAnimationFrame(fly);
      else location.href = 'work.html#' + target.key;
    })(t0);
  });

  /* ---------- 主循环 ---------- */
  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    const t = clock.getElapsedTime();

    if (!grabbing) {
      ray.setFromCamera(ptr, camera);
      const hits = ray.intersectObjects(objs.map(o => o.pivot), true);
      let found = null;
      if (hits.length) {
        let n = hits[0].object;
        while (n && !n.userData.key) n = n.parent;
        if (n) found = objs.find(o => o.pivot === n);
      }
      setHover(found || null);
    }

    objs.forEach((o, i) => {
      // 浮起时慢慢自转；静止时极轻微地呼吸
      if (o === hover && !grabbing) o.pivot.rotation.y += 0.006;
      else o.pivot.rotation.y += (o.pivot.userData.baseRot - o.pivot.rotation.y) * 0.02;
      if (!CALM && o !== hover) o.pivot.position.y = 0.05 + Math.sin(t * 0.7 + i) * 0.008;
    });

    // 镜头极缓慢地随指针偏移，给一点视差
    if (!CALM) {
      camera.position.x += (ptr.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += ((4.3 + ptr.y * 0.25) - camera.position.y) * 0.02;
      camera.lookAt(0, 0.1, 0.25);
    }

    renderer.render(scene, camera);
  }
  frame();

  HOST.classList.add('ready');
}

/* 失败时把原因显示在页面上 —— 静默隐藏会让人以为「没做」 */
function fail(msg, e) {
  HOST.classList.add('nogl');
  console.error('[sandbox]', msg, e || '');
  const el = document.getElementById('sb-err');
  if (el) {
    el.textContent = 'sandbox: ' + msg + (e && e.message ? ' — ' + e.message : '');
    el.hidden = false;
  }
}

try {
  const c = document.createElement('canvas');
  if (!(c.getContext('webgl2') || c.getContext('webgl'))) fail('WebGL 不可用，已降级为列表');
  else init();
} catch (e) {
  fail('初始化失败', e);
}

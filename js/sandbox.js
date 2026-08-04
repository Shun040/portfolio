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

/* 六件物件 —— 沙盘游戏里的微缩物件本来就是简化剪影，不是写实模型 */
const ITEMS = [
  { key: 'tears',        x: -2.10, z: -0.50, build: telephone },  // 固定电话
  { key: 'exstasis',     x: -0.60, z:  0.70, build: buddha    },  // 佛像
  { key: 'painshift',    x:  0.85, z: -0.80, build: tulip     },  // 一朵花
  { key: 'reground',     x:  2.10, z:  0.55, build: bird      },  // 小鸟
  { key: 'empalens',     x: -1.90, z:  1.70, build: twoFigures},  // 两个人背对背
  { key: 'through-eyes', x:  1.30, z:  1.75, build: cctv      }   // 监控
];

/* ---------- 材质 ---------- */
const CREAM = 0xE6DFC9;
const RED   = 0xC5283D;
const BRASS = 0xB08D57;
const mat = (c = CREAM, rough = 0.62, metal = 0.04) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: rough, metalness: metal });

/* ================== 六件物件 ================== */

function telephone() {                  // 固定电话（座机）
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.16, 0.46), mat(0x2B2F38, 0.62));
  base.position.y = 0.08;
  // 机身前低后高，像老式座机
  base.rotation.x = -0.09;
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 24), mat(0xD8D2BE, 0.5));
  dial.position.set(0, 0.17, 0.06);
  // 听筒横搁在机身上
  const handle = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.07, 0.09), mat(0x2B2F38, 0.5));
  const capA = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.1, 18), mat(0x2B2F38, 0.5));
  capA.position.set(-0.25, -0.02, 0);
  const capB = capA.clone(); capB.position.x = 0.25;
  handle.add(bar, capA, capB);
  handle.position.y = 0.24;
  // 螺旋线
  const cordPts = [];
  for (let i = 0; i <= 90; i++) {
    const t = i / 90;
    cordPts.push(new THREE.Vector3(
      -0.3 + t * 0.12 + Math.sin(t * 34) * 0.045,
      0.2 - t * 0.16,
      -0.22 + Math.cos(t * 34) * 0.045
    ));
  }
  const cord = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordPts), 90, 0.014, 6, false),
    mat(0x2B2F38, 0.7)
  );
  g.add(base, dial, handle, cord);
  return g;
}

function buddha() {                     // 佛像（结跏趺坐）
  const g = new THREE.Group();
  const m = mat(BRASS, 0.42, 0.62);
  // 莲座
  const lotus = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.1, 24), m);
  lotus.position.y = 0.05;
  const petals = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.055, 8, 24), m);
  petals.rotation.x = Math.PI / 2; petals.position.y = 0.1;
  // 盘起的腿
  const legs = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 14), m);
  legs.scale.set(1, 0.42, 0.86); legs.position.y = 0.2;
  // 身躯：上窄下宽
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.34, 20), m);
  torso.position.y = 0.4;
  // 双手结印
  const hands = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), m);
  hands.scale.set(1, 0.5, 0.7); hands.position.set(0, 0.29, 0.15);
  // 头与肉髻
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 22, 16), m);
  head.position.y = 0.64;
  const ushnisha = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), m);
  ushnisha.position.y = 0.74;
  // 背光
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.016, 8, 32), mat(BRASS, 0.3, 0.8));
  halo.position.set(0, 0.64, -0.1);
  g.add(lotus, petals, legs, torso, hands, head, ushnisha, halo);
  return g;
}

function tulip() {                      // 一朵花（郁金香 —— PainShift 的曼陀罗就是它做的）
  const g = new THREE.Group();
  const green = mat(0x5F7A4A, 0.85);
  // 花杯：用车削面做出郁金香的收口轮廓
  const prof = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const r = 0.055 + Math.sin(t * Math.PI * 0.92) * 0.17 * (1 - t * 0.24);
    prof.push(new THREE.Vector2(r, t * 0.34));
  }
  const cup = new THREE.Mesh(new THREE.LatheGeometry(prof, 28),
    new THREE.MeshStandardMaterial({ color: 0xD8CBE0, roughness: 0.68, side: THREE.DoubleSide }));
  cup.position.y = 0.5;
  // 花瓣的尖：三片微微外翻
  for (let i = 0; i < 3; i++) {
    const petal = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.16, 10),
      new THREE.MeshStandardMaterial({ color: 0xCBBBD8, roughness: 0.68, side: THREE.DoubleSide }));
    const a = (i / 3) * Math.PI * 2;
    petal.position.set(Math.cos(a) * 0.11, 0.86, Math.sin(a) * 0.11);
    petal.rotation.set(0.34 * Math.cos(a + 1.6), 0, -0.34 * Math.sin(a + 1.6));
    g.add(petal);
  }
  // 茎
  const stemPts = [
    new THREE.Vector3(0.03, 0, 0.02), new THREE.Vector3(-0.02, 0.2, 0),
    new THREE.Vector3(0.02, 0.38, -0.01), new THREE.Vector3(0, 0.52, 0)
  ];
  const stem = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stemPts), 24, 0.02, 6, false), green);
  // 两片长叶
  for (let i = 0; i < 2; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), green);
    leaf.scale.set(0.2, 1.5, 0.6);
    leaf.position.set(i ? 0.1 : -0.1, 0.22, i ? -0.05 : 0.05);
    leaf.rotation.z = i ? -0.42 : 0.42;
    g.add(leaf);
  }
  g.add(cup, stem);
  return g;
}

function bird() {                       // 小鸟（陪伴机器人）
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 20), mat(0xEFE7D4, 0.95));
  body.scale.set(1, 0.94, 0.9); body.position.y = 0.3;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.185, 24, 18), mat(0xEFE7D4, 0.95));
  head.position.set(0, 0.58, 0.04);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.13, 12), mat(0xE0A23A, 0.55));
  beak.position.set(0, 0.56, 0.2); beak.rotation.x = Math.PI / 2;
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), mat(0x1A1A1E, 0.3));
  eyeL.position.set(-0.07, 0.62, 0.155);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.07;
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 10), mat(0xEFE7D4, 0.95));
  tail.position.set(0, 0.32, -0.26); tail.rotation.x = -1.15;
  const feet = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.05, 16), mat(0xE0A23A, 0.6));
  feet.position.y = 0.025;
  g.add(body, head, beak, eyeL, eyeR, tail, feet);
  return g;
}

function twoFigures() {                 // 两个人背对背（EmpaLens：伴侣）
  const g = new THREE.Group();
  const person = (c, flip) => {
    const p = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.05, 18), mat(c, 0.8));
    base.position.y = 0.025;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.145, 0.4, 20), mat(c, 0.78));
    body.position.y = 0.25;
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 12), mat(c, 0.78));
    shoulder.scale.set(1.5, 0.6, 0.8); shoulder.position.y = 0.45;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.088, 20, 14), mat(c, 0.72));
    head.position.y = 0.56;
    p.add(base, body, shoulder, head);
    p.position.z = flip ? -0.12 : 0.12;
    p.rotation.y = flip ? Math.PI : 0;
    return p;
  };
  g.add(person(0xE6DFC9, false), person(0x8FA0BF, true));
  return g;
}

function cctv() {                       // 监控摄像头
  const g = new THREE.Group();
  const dark = mat(0x30343D, 0.5, 0.25);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.66, 14), dark);
  pole.position.y = 0.33;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.3, 12), dark);
  arm.rotation.z = Math.PI / 2; arm.position.set(0.14, 0.64, 0);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.34, 20), mat(0xD9D3C2, 0.45, 0.2));
  body.rotation.z = Math.PI / 2; body.position.set(0.42, 0.6, 0);
  body.rotation.y = 0.22;
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.14, 20, 1, true), dark);
  hood.rotation.z = Math.PI / 2; hood.position.set(0.55, 0.61, 0);
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.062, 20, 14), mat(0x14161C, 0.08, 0.85));
  lens.position.set(0.6, 0.6, 0);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8),
    new THREE.MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: 2.2, roughness: .4 }));
  led.position.set(0.56, 0.68, 0.05);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 18), dark);
  foot.position.y = 0.02;
  g.add(foot, pole, arm, body, hood, lens, led);
  return g;
}

/* ================================================================== */
function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // 这两行是观感的分水岭：不做色调映射的话，高光会硬生生削平，
  // 整个场景是死板的塑料感
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  HOST.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // 环境贴图：给所有材质一个可反射的环境。没有它，金属和玻璃都是死的。
  // RoomEnvironment 是 three 自带的程序化房间，不需要下载 HDR 贴图。
  import('../assets/vendor/RoomEnvironment.js').then(m => {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new m.RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();
  }).catch(e => console.warn('[sandbox] 环境贴图未加载', e));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  // 位置每帧由轨道算出，这里只给个初值避免第一帧闪

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

  /* ---------- 沙 ----------
     两层：
       1) 压实的沙床（网格）—— 起伏比之前大三倍，有沙丘也有浅坑
       2) 表层沙粒（4.5 万个 Points）—— 旋转时会被带着流动，慢慢再落定
     只做网格的话沙面永远是"塑料布"；只做粒子的话又会透光。两层叠起来才像沙。 */
  const SW = W - 0.06, SD = D - 0.06;

  // 沙的高度场：低频沙丘 + 中频波纹 + 高频颗粒起伏
  const sandH = (x, z) => {
    const dune = Math.sin(x * 0.9 + 0.4) * Math.cos(z * 1.15) * 0.075
               + Math.sin(x * 1.9 - 1.1) * Math.cos(z * 0.7 + 0.6) * 0.045;
    const ripple = Math.sin(x * 5.4 + z * 2.2) * 0.012
                 + Math.sin(z * 6.8 - x * 1.7) * 0.009;
    const grain = Math.sin(x * 19.3 + z * 14.1) * 0.004;
    // 靠近木框沙变薄，露出下面的蓝
    const edge = Math.min(1, Math.min((SW / 2 - Math.abs(x)) / 0.75, (SD / 2 - Math.abs(z)) / 0.75));
    return (dune + ripple + grain + 0.055) * Math.max(0, edge);
  };

  const sandGeo = new THREE.PlaneGeometry(SW, SD, 150, 118);
  const pos = sandGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, sandH(pos.getX(i), pos.getY(i)));
  }
  sandGeo.computeVertexNormals();
  const sand = new THREE.Mesh(sandGeo, new THREE.MeshStandardMaterial({
    color: 0xB8AA8B, roughness: 1, metalness: 0, flatShading: false
  }));
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = 0.02;
  sand.receiveShadow = true;
  box.add(sand);

  // ---- 表层沙粒 ----
  const GRAINS = 45000;
  const gPos  = new Float32Array(GRAINS * 3);
  const gBase = new Float32Array(GRAINS * 3);   // 原位，用来回落
  const gOff  = new Float32Array(GRAINS * 3);   // 当前偏移
  const gDir  = new Float32Array(GRAINS * 2);   // 每粒自己的漂移方向
  const gCol  = new Float32Array(GRAINS * 3);

  for (let i = 0; i < GRAINS; i++) {
    const x = (Math.random() - 0.5) * SW;
    const z = (Math.random() - 0.5) * SD;
    const y = sandH(x, z) + 0.02 + Math.random() * 0.012;
    gBase[i * 3] = gPos[i * 3] = x;
    gBase[i * 3 + 1] = gPos[i * 3 + 1] = y;
    gBase[i * 3 + 2] = gPos[i * 3 + 2] = z;
    const a = Math.random() * Math.PI * 2;
    gDir[i * 2] = Math.cos(a); gDir[i * 2 + 1] = Math.sin(a);
    // 颜色轻微random，纯单色的粒子看起来像噪点而不像沙
    const t = 0.82 + Math.random() * 0.26;
    gCol[i * 3] = 0.79 * t; gCol[i * 3 + 1] = 0.72 * t; gCol[i * 3 + 2] = 0.57 * t;
  }

  const grainGeo = new THREE.BufferGeometry();
  grainGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  grainGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));
  const grains = new THREE.Points(grainGeo, new THREE.PointsMaterial({
    size: 0.016, vertexColors: true, sizeAttenuation: true,
    transparent: true, opacity: 0.95, depthWrite: false
  }));
  box.add(grains);

  // 每帧被主循环调用：旋转越快，沙被带得越多，然后慢慢落回原位
  let lastAz = 0;
  const stirSand = (az, dt) => {
    const spin = Math.min(0.06, Math.abs(az - lastAz));
    lastAz = az;
    if (spin < 0.0004 && !stirSand.settling) return;
    stirSand.settling = false;
    let moving = false;
    for (let i = 0; i < GRAINS; i++) {
      const i3 = i * 3, i2 = i * 2;
      if (spin > 0.0004) {
        const k = spin * 1.7;
        gOff[i3]     += gDir[i2]     * k;
        gOff[i3 + 1] += Math.random() * k * 0.32;
        gOff[i3 + 2] += gDir[i2 + 1] * k;
      }
      gOff[i3] *= 0.90; gOff[i3 + 1] *= 0.86; gOff[i3 + 2] *= 0.90;
      if (Math.abs(gOff[i3]) > 0.0004 || Math.abs(gOff[i3 + 2]) > 0.0004) moving = true;
      gPos[i3]     = gBase[i3]     + gOff[i3];
      gPos[i3 + 1] = gBase[i3 + 1] + gOff[i3 + 1];
      gPos[i3 + 2] = gBase[i3 + 2] + gOff[i3 + 2];
    }
    stirSand.settling = moving;
    grainGeo.attributes.position.needsUpdate = true;
  };

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

    // 碰撞体：不可见、不跟着浮起。之前直接拿物体本体做拾取，
    // 一浮起就离开了射线 → 判定丢失 → 落下 → 又被击中，于是一直闪。
    const hit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 1.5, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.set(it.x, 0.55, it.z);
    hit.userData = { key: it.key };
    scene.add(hit);

    // 每件物体一条弹簧，控制浮起高度 0 → 1
    const spring = new window.Spring({
      from: 0, damping: 0.72, response: 0.42,
      onUpdate: (v) => {
        pivot.position.y = 0.05 + v * 0.62;
        pivot.scale.setScalar(1 + v * 0.06);
      }
    });

    objs.push({ pivot, spring, hit, key: it.key });
  });

  function loadModels() { pending.forEach(fn => fn()); }

  /* ---------- 拾取 ---------- */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2(-9, -9);
  let hover = null, grabbing = false, miss = 0;

  function resize() {
    const w = HOST.clientWidth, h = HOST.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  /* ---------- 轨道：拖动旋转，松手带惯性 ----------
     阈值 6px 之内算点击、之外算拖动 —— 不然一点就转，物体点不中。 */
  const orb = {
    az: 0, el: 0.62,          // 当前方位角 / 仰角
    taz: 0, tel: 0.62,        // 目标
    vaz: 0, vel: 0,           // 松手后的角速度
    dist: 7.6,
    down: false, moved: 0, lx: 0, ly: 0, id: null
  };
  const EL_MIN = 0.26, EL_MAX = 1.16, AZ_LIM = 0.85;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

  HOST.addEventListener('pointermove', (e) => {
    const r = HOST.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;

    if (!orb.down) return;
    const dx = e.clientX - orb.lx, dy = e.clientY - orb.ly;
    orb.lx = e.clientX; orb.ly = e.clientY;
    orb.moved += Math.abs(dx) + Math.abs(dy);
    orb.taz = clamp(orb.taz - dx * 0.006, -AZ_LIM, AZ_LIM);
    orb.tel = clamp(orb.tel - dy * 0.005, EL_MIN, EL_MAX);
    orb.vaz = -dx * 0.006; orb.vel = -dy * 0.005;
  }, { passive: true });

  HOST.addEventListener('pointerdown', (e) => {
    orb.down = true; orb.moved = 0; orb.lx = e.clientX; orb.ly = e.clientY;
    orb.vaz = orb.vel = 0;
    orb.id = e.pointerId;
    HOST.setPointerCapture(e.pointerId);
    HOST.classList.add('dragging');
  });
  const release = () => {
    if (!orb.down) return;
    orb.down = false;
    HOST.classList.remove('dragging');
    if (orb.id !== null) { try { HOST.releasePointerCapture(orb.id); } catch (e) {} orb.id = null; }
  };
  HOST.addEventListener('pointerup', release);
  HOST.addEventListener('pointercancel', release);
  HOST.addEventListener('pointerleave', () => { ptr.set(-9, -9); release(); }, { passive: true });

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
    if (orb.moved > 6) return;   // 拖过就不算点击
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
      const hits = ray.intersectObjects(objs.map(o => o.hit), false);
      const found = hits.length ? objs.find(o => o.hit === hits[0].object) : null;
      // 迟滞：连续 4 帧都没命中才算真的离开，避免边缘抖动
      if (found) { miss = 0; setHover(found); }
      else if (++miss > 4) setHover(null);
    }

    objs.forEach((o, i) => {
      // 浮起时慢慢自转；静止时极轻微地呼吸
      if (o === hover && !grabbing) o.pivot.rotation.y += 0.006;
      else o.pivot.rotation.y += (o.pivot.userData.baseRot - o.pivot.rotation.y) * 0.02;
      if (!CALM && o !== hover) o.pivot.position.y = 0.05 + Math.sin(t * 0.7 + i) * 0.008;
    });

    // 轨道镜头：松手后按角速度继续滑一段再停（惯性），
    // 同时鼠标位置本身给一点很轻的带动，静止时画面也不死
    if (!orb.down) {
      orb.vaz *= 0.94; orb.vel *= 0.94;
      if (Math.abs(orb.vaz) > 1e-4 || Math.abs(orb.vel) > 1e-4) {
        orb.taz = clamp(orb.taz + orb.vaz, -AZ_LIM, AZ_LIM);
        orb.tel = clamp(orb.tel + orb.vel, EL_MIN, EL_MAX);
      }
    }
    const followAz = CALM || orb.down ? 0 : ptr.x * 0.09;
    const followEl = CALM || orb.down ? 0 : -ptr.y * 0.05;
    orb.az += ((orb.taz + followAz) - orb.az) * 0.08;
    orb.el += ((orb.tel + followEl) - orb.el) * 0.08;

    camera.position.set(
      Math.sin(orb.az) * Math.cos(orb.el) * orb.dist,
      Math.sin(orb.el) * orb.dist,
      Math.cos(orb.az) * Math.cos(orb.el) * orb.dist
    );
    camera.lookAt(0, 0.15, 0);

    stirSand(orb.az);

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

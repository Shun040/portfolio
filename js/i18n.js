/* ------------------------------------------------------------------
   i18n.js — 中英双语文案字典（唯一文案来源）
   ------------------------------------------------------------------
   改文案只改这个文件。HTML 里用 data-i18n="key" 占位，
   值里允许写 HTML（<em> 用来做强调换行、<br> 用来控断行）。

   英文取自 job-search/resume/resume_content.md，未改写事实。
   中文为对应改写，不是逐字直译 —— 中文版更口语、更短句。
   ------------------------------------------------------------------ */

window.I18N = {

  /* ============ 通用 / 导航 / 元信息 ============ */
  common: {
    en: {
      'meta.title': 'Zicen Yin — Interaction Design & New Media',
      'meta.desc': 'Interaction designer and creative technologist in Sydney. Systems that make invisible harm felt — installation, VR, UX, wearables, embedded.',

      'name.full': 'Zicen Yin',
      'name.short': 'ZICEN YIN',
      'name.alt': '尹紫涔',
      'role': 'Artist',
      'location': 'Sydney, Australia',

      'nav.work': 'Work',
      'nav.about': 'About',
      'nav.cv': 'CV',
      'nav.contact': 'Contact',
      'nav.cta': 'Get in touch',
      'nav.menu': 'Menu',
      'nav.close': 'Close',

      'lang.toggle': '中文',
      'lang.label': 'Switch to Chinese',

      'status': 'Open to work',
      'year': '2026',
      'backtotop': 'Back to top'
    },
    zh: {
      'meta.title': '尹紫涔 — 交互设计 · 新媒体艺术',
      'meta.desc': '交互设计师、创意技术者，现居悉尼。做让看不见的伤害被感觉到的系统 —— 装置、VR、UX、可穿戴、嵌入式。',

      'name.full': '尹紫涔',
      'name.short': '尹紫涔',
      'name.alt': 'ZICEN YIN',
      'role': '艺术创作者',
      'location': '澳大利亚 悉尼',

      'nav.work': '项目',
      'nav.about': '关于',
      'nav.cv': '履历',
      'nav.contact': '联系',
      'nav.cta': '联系我',
      'nav.menu': '菜单',
      'nav.close': '关闭',

      'lang.toggle': 'EN',
      'lang.label': '切换到英文',

      'status': '正在找工作',
      'year': '2026',
      'backtotop': '回到顶部'
    }
  },

  /* ============ 开场页 ============ */
  splash: {
    en: {
      'splash.mask': 'ZICEN YIN',
      'splash.kicker': 'Portfolio 2024 — 2026',
      'splash.line': 'Six projects, each one holding on to something invisible.',
      'splash.hint': 'Move your cursor — the field flows around the name',
      'splash.hint.touch': 'Drag across the screen to stir the field',
      'splash.enter': 'Enter',
      'splash.enterHint': 'or press any key'
    },
    zh: {
      'splash.mask': '尹紫涔',
      'splash.kicker': '作品集 2024 — 2026',
      'splash.line': '六个项目，各自抓住一件看不见的事。',
      'splash.hint': '移动光标 —— 场会绕着名字流过去',
      'splash.hint.touch': '在屏幕上拖动，搅动这片场',
      'splash.enter': '进入',
      'splash.enterHint': '或按任意键'
    }
  },

  /* ============ 1. 首屏 Hero ============ */
  hero: {
    en: {
      'hero.kicker': 'Interaction design · Cross-media installation · Public health',
      'hero.title': 'Looking inside digital technology for<br>constructive means of <em>inner repair</em>.',
      'hero.body': 'Her practice sits at the intersection of interaction design, cross-media installation and public health — the experience of illness seen close up, psychological reconstruction, and the way institutional environments estrange the individual mind.',
      'hero.cta1': 'Work',
      'hero.cta2': 'CV (PDF)',
      'hero.scroll': 'Scroll',
      'hero.ticker': 'Interaction design · Cross-media installation · Public health · Embodied interaction · Physical computing · Real-time graphics · Machine vision · Sydney ·'
    },
    zh: {
      'hero.kicker': '交互设计 · 跨媒介装置 · 公共健康',
      'hero.title': '在数字技术中寻找<br><em>修复内心</em>的建构性方案。',
      'hero.body': '其创作立足于交互设计、跨媒介装置与公共健康的交叉领域，聚焦微观视角下的疾病体验、心理重构，以及制度化环境对个体精神的异化。',
      'hero.cta1': '作品',
      'hero.cta2': '简历（PDF）',
      'hero.scroll': '向下',
      'hero.ticker': '交互设计 · 跨媒介装置 · 公共健康 · 具身交互 · 物理计算 · 实时图形 · 机器视觉 · 悉尼 ·'
    }
  },

  /* ============ 2. 个人简介 ============
     正文一字未改，取自《尹紫涔_艺术家简介》。英文为对照翻译。 */
  about: {
    en: {
      'about.label': 'About',
      'about.title': 'Biography',
      'about.bio': 'Her practice sits at the intersection of interaction design, cross-media installation and public health, focusing on the experience of illness seen at close range, on psychological reconstruction, and on the estrangement of the individual mind by institutional environments — looking inside digital technology for constructive means of repair. The work comes out of a reflection on how absent psychiatric narrative is from ordinary experience: she refuses to treat psychological difficulty as an isolated "pathological deadlock", and instead translates complex clinical intervention mechanisms into everyday interactive systems with low cognitive friction, using embodied interaction to guide the audience through de-stigmatised healing and social engagement.',

      'about.factsLabel': 'Details',
      'about.born': 'Born 2004, Shijiazhuang, Hebei',
      'about.edu': 'BFA, Sci-Tech Art Studio, School of Experimental Art, Central Academy of Fine Arts',
      'about.edu2': 'MA Interaction Design and Electronic Arts, University of Sydney (2026–2028)',
      'about.based': 'Based in Sydney',

      'about.portraitAlt': 'Portrait of Zicen Yin',
      'about.portraitFallback': 'Portrait<br>coming soon',

      'about.contactLabel': 'Contact',
      'about.emailLabel': 'Email',
      'about.locLabel': 'Based in',
      'about.reelLabel': 'Showreel',
      'about.reelValue': 'Watch on YouTube'
    },
    zh: {
      'about.label': '关于',
      'about.title': '个人简介',
      'about.bio': '其创作立足于交互设计、跨媒介装置与公共健康的交叉领域，聚焦微观视角下的疾病体验、心理重构，以及制度化环境对个体精神的异化，试图在数字技术中寻找修复内心的建构性方案。创作动机源于对精神医学叙事在日常经验中缺位的反思——她拒绝将心理困境孤立地视为"疾病僵局"，而是将复杂的临床心理干预机制转译为低认知摩擦的日常交互系统，通过具身交互引导观众完成去污名化的心理疗愈与社会介入。',

      'about.factsLabel': '基本信息',
      'about.born': '2004 年出生于河北石家庄',
      'about.edu': '本科毕业于中央美术学院实验艺术学院科技艺术工作室',
      'about.edu2': '悉尼大学交互设计与电子艺术硕士在读（2026–2028）',
      'about.based': '现居悉尼',

      'about.portraitAlt': '尹紫涔肖像',
      'about.portraitFallback': '人物图<br>待补',

      'about.contactLabel': '联系方式',
      'about.emailLabel': '邮箱',
      'about.locLabel': '所在地',
      'about.reelLabel': '作品视频',
      'about.reelValue': '在 YouTube 观看'
    }
  },

  /* ============ 档案外壳 ============ */
  arc: {
    en: {
      'arc.docno': 'File no.',
      'arc.issued': 'Issued',
      'arc.pages': 'Page',
      'arc.s1': 'Subject',
      'arc.s2': 'Works',
      'arc.s3': 'Record',
      'arc.s4': 'Contact',
      'arc.stamp1': 'CAFA',
      'arc.stamp2': 'EXPERIMENTAL ART',
      'arc.photo': 'Photograph',
      'arc.thNo': 'No.',
      'arc.thTitle': 'Title',
      'arc.thType': 'Medium',
      'arc.thYear': 'Year',
      'arc.plate': 'Plate — documentation',
      'arc.open': 'Open file',
      'arc.end': 'End of file'
    },
    zh: {
      'arc.docno': '档案编号',
      'arc.issued': '建档日期',
      'arc.pages': '页',
      'arc.s1': '个人档案',
      'arc.s2': '作品档案',
      'arc.s3': '履历',
      'arc.s4': '联系',
      'arc.stamp1': '中央美术学院',
      'arc.stamp2': '实验艺术学院',
      'arc.photo': '证件照',
      'arc.thNo': '编号',
      'arc.thTitle': '名称',
      'arc.thType': '媒介',
      'arc.thYear': '年份',
      'arc.plate': '图版 · 现场记录',
      'arc.open': '调阅',
      'arc.end': '档案完'
    }
  },

  /* ============ 履历 ============ */
  cv: {
    en: {
      'cv.label': 'CV',
      'cv.title': 'Awards and exhibitions',
      'cv.awards': 'Awards',
      'cv.shows': 'Selected exhibitions'
    },
    zh: {
      'cv.label': '履历',
      'cv.title': '获奖与参展',
      'cv.awards': '获奖经历',
      'cv.shows': '参展经历'
    }
  },

  /* ============ 3. 精选项目 ============ */
  work: {
    en: {
      'work.label': 'Selected work',
      'work.title': 'Six projects, 2024 — 2026',
      'work.intro': 'Each one starts from something that is real but hard to see — a call a child never made, a colony of bacteria, chronic pain, dissociation, another person\'s emotion, the harm of being filmed without knowing. Then builds a system that makes it impossible to ignore.',
      'work.open': 'Open case study',
      'case.role': 'Role',
      'case.tools': 'Tools',
      'case.context': 'The problem',
      'case.research': 'Research',
      'case.concept': 'The mechanism',
      'case.system': 'System',
      'case.experience': 'The experience',
      'case.outcome': 'Outcome',
      'case.video': 'Video',
      'case.breatheIn': 'Breathe in',
      'case.breatheOut': 'Breathe out',
      'case.depth': 'Session depth',
      'case.hr': 'Modelled heart rate',
      'case.med': 'Medication reliance',
      'case.breathNote': 'Follow the ring. Every completed breath deepens the session — heart rate settles and modelled reliance on medication drops. This is the real biofeedback logic, running in your browser.',
      'work.roleLabel': 'Role',
      'work.toolsLabel': 'Tools',

      'p1.name': 'Tears before Words',
      'p1.meta': 'Interactive installation · Graduation capstone · 2026',
      'p1.thesis': 'A multi-sensory installation on emotional resonance and collective healing, made for young people who grew up in boarding schools. Internal emotional narrative turned into a real-time physical interface.',
      'p1.role': 'Lead artist, producer & technical director — solo',
      'p1.tools': 'Embedded C · Microcontrollers · Sensors · Digital fabrication',
      'p1.note': 'CAFA Outstanding Graduation Work · Shortlisted, 3rd National Exhibition of Fine Arts for University Students · Featured by CGTN',

      'p2.name': 'Through Their Eyes',
      'p2.meta': 'Interactive installation · Critical design · 2025',
      'p2.thesis': 'Concealed pinhole cameras record visitors; a live AI pipeline generates and prints fabricated accusations about them in real time. You cannot reason someone into empathy — you can only stage it.',
      'p2.role': 'Concept, research & installation design — solo',
      'p2.tools': 'Machine vision · Generative AI · Thermal printing · Installation',
      'p2.note': 'The visitor becomes the subject of the surveillance they came to look at.',

      'p3.name': 'Reground',
      'p3.meta': 'UX · Service design · Product design · 2025',
      'p3.thesis': 'A mobile app and a plush companion robot that guide people out of dissociative episodes — designed for daily re-use rather than one-off crisis use, because the whole value depends on people coming back.',
      'p3.role': 'UX, service design, 3D, hardware concept',
      'p3.tools': 'Figma · HTML/CSS/JS prototype · Blender · Photoshop',
      'p3.note': 'Personas, pain-point analysis, user flows, low-fi wireframes, onboarding and sign-in flow.',

      'p4.name': 'EmpaLens',
      'p4.meta': 'Product · Service · UX · Wearables · 2025',
      'p4.thesis': 'Smart glasses and a companion badge that translate real-time facial emotion for the partners of autistic people — designed for the carer, a user group products rarely address.',
      'p4.role': 'Product design, UX, ML integration, industrial design',
      'p4.tools': 'FER-2013 CNN · OpenCV · Keras · Figma · AR concept',
      'p4.note': 'Interface and the surrounding service model designed together, not separately.',

      'p5.name': 'EXSTASIS',
      'p5.meta': 'Interactive installation · Bio-art · Art therapy · 2024',
      'p5.thesis': 'Visitors cultivate bacteria from their own hands; machine vision reads the growth and generates a personal guardian spirit in response. Shamanism\'s oldest idea — that the self is decentralised and kin to the living world — rebuilt as a machine you can touch.',
      'p5.role': 'Concept, interaction & fabrication — solo',
      'p5.tools': 'Arduino · Python · TouchDesigner · Machine vision',
      'p5.note': 'Framed as art therapy rather than spectacle.',

      'p6.name': 'PainShift',
      'p6.meta': 'VR · Biofeedback · Service design · 2024',
      'p6.thesis': 'VR meditation that turns breath and pulse into generative visuals, framing chronic pain as manageable without medication. Built around a patient who reaches for the headset instead of the bottle.',
      'p6.role': 'Concept, interaction, hardware, Unreal Engine build',
      'p6.tools': 'Unreal Engine · Arduino · Pulse & stretch sensors · TouchDesigner',
      'p6.note': 'Which made willingness to return the design problem — not immersion.'
    },
    zh: {
      'work.label': '精选项目',
      'work.title': '六个项目，2024 — 2026',
      'work.intro': '每一个都从一件真实但很难被看见的事开始 —— 一个孩子没打出去的电话、一片微生物群、慢性疼痛、解离、另一个人的情绪、被偷拍的伤害。然后造出一套让它无法被忽视的系统。',
      'work.open': '展开案例',
      'case.role': '角色',
      'case.tools': '技术',
      'case.context': '问题',
      'case.research': '调研',
      'case.concept': '机制',
      'case.system': '系统',
      'case.experience': '体验',
      'case.outcome': '成果',
      'case.video': '影像',
      'case.breatheIn': '吸气',
      'case.breatheOut': '呼气',
      'case.depth': '会话深度',
      'case.hr': '模拟心率',
      'case.med': '用药依赖',
      'case.breathNote': '跟着光环呼吸。每完成一次呼吸，这次会话就更深一点 —— 心率随之平稳，模拟的用药依赖随之下降。这就是真实的生物反馈逻辑，直接跑在你的浏览器里。',
      'work.roleLabel': '角色',
      'work.toolsLabel': '技术',

      'p1.name': '眼泪先于语言',
      'p1.meta': '交互装置 · 本科毕业作品 · 2026',
      'p1.thesis': '一件关于情感共振与集体疗愈的多感官交互装置，为寄宿学校长大的年轻人而做。把内在的情绪叙事变成一个实时的物理界面。',
      'p1.role': '主创、制片与技术总监 —— 独立完成',
      'p1.tools': '嵌入式 C · 单片机 · 传感器 · 数字建造',
      'p1.note': '中央美院优秀毕业作品 · 第三届全国大学生美术作品展终评入围 · CGTN 报道',

      'p2.name': '以他人之眼',
      'p2.meta': '交互装置 · 批判性设计 · 2025',
      'p2.thesis': '隐藏的针孔摄像头记录观众，实时 AI 管线随即生成并打印出关于他们的虚构指控。你没法把一个人说服到共情，只能把他放进去。',
      'p2.role': '概念、研究与装置设计 —— 独立完成',
      'p2.tools': '机器视觉 · 生成式 AI · 热敏打印 · 装置',
      'p2.note': '观众成为自己前来围观的那场监视的对象。',

      'p3.name': 'Reground 复地',
      'p3.meta': 'UX · 服务设计 · 产品设计 · 2025',
      'p3.thesis': '一个手机应用加一只毛绒陪伴机器人，引导人从解离状态中回到当下 —— 为日常反复使用而设计，不是为一次性的危机时刻，因为它的全部价值都取决于人会不会再打开它。',
      'p3.role': 'UX、服务设计、3D、硬件概念',
      'p3.tools': 'Figma · HTML/CSS/JS 原型 · Blender · Photoshop',
      'p3.note': '含用户画像、痛点分析、用户流程、低保真线框与注册引导流程。',

      'p4.name': 'EmpaLens 共感之镜',
      'p4.meta': '产品 · 服务 · UX · 可穿戴 · 2025',
      'p4.thesis': '一副智能眼镜加一枚配套徽章，为自闭症人士的伴侣实时翻译面部情绪 —— 为照护者而设计，一个产品很少正面对待的用户群。',
      'p4.role': '产品设计、UX、机器学习集成、工业设计',
      'p4.tools': 'FER-2013 CNN · OpenCV · Keras · Figma · AR 概念',
      'p4.note': '界面和它背后的服务模型是一起设计的，不是分开的两件事。',

      'p5.name': 'EXSTASIS',
      'p5.meta': '交互装置 · 生物艺术 · 艺术治疗 · 2024',
      'p5.thesis': '观众从自己手上培养细菌，机器视觉读取菌落的生长，据此生成一个专属的守护灵。萨满最古老的那个想法 —— 自我是去中心的，与万物同源 —— 被重建成一台你可以触摸的机器。',
      'p5.role': '概念、交互与制作 —— 独立完成',
      'p5.tools': 'Arduino · Python · TouchDesigner · 机器视觉',
      'p5.note': '作为艺术治疗来做，而不是作为奇观。',

      'p6.name': 'PainShift',
      'p6.meta': 'VR · 生物反馈 · 服务设计 · 2024',
      'p6.thesis': '一个 VR 冥想系统，把呼吸和脉搏变成生成式视觉，让慢性疼痛成为一件不靠药物也能管理的事。围绕一个愿意伸手去拿头显、而不是去拿药瓶的病人来设计。',
      'p6.role': '概念、交互、硬件、Unreal Engine 实现',
      'p6.tools': 'Unreal Engine · Arduino · 脉搏与拉伸传感器 · TouchDesigner',
      'p6.note': '所以真正的设计问题是"他愿不愿意再来一次"，而不是沉浸感。'
    }
  },

  /* ============ 5. 页尾联系 ============ */
  contact: {
    en: {
      'ct.label': 'Contact',
      'ct.title': 'Let\'s talk.',
      'ct.body': 'Open to part-time, contract and freelance work in UI, UX, interaction, web and digital media — and to conversations about installation and creative technology that have no brief attached yet.',
      'ct.emailCta': 'Write to me',
      'ct.or': 'or find me here',

      'ct.l1': 'Email', 'ct.l2': 'Full portfolio', 'ct.l3': 'Showreel', 'ct.l4': 'CV (PDF)',
      'ct.v2': 'Notion', 'ct.v3': 'YouTube', 'ct.v4': 'Download',

      'ct.availTitle': 'Availability',
      'ct.availBody': 'Sydney based · Remote, hybrid or on site · Up to 48 hours per fortnight in semester, full-time during university breaks.',
      'ct.respTitle': 'Response',
      'ct.respBody': 'Email is the fastest way to reach me. I usually reply within a day.',

      'ct.rights': 'All rights reserved.',
      'ct.built': 'Designed and built by Zicen Yin.'
    },
    zh: {
      'ct.label': '联系',
      'ct.title': '聊聊。',
      'ct.body': '可接 UI、UX、交互、网页与数字媒体方向的兼职、合同与自由职业工作 —— 也欢迎聊聊那些还没有 brief 的装置与创意技术的事。',
      'ct.emailCta': '给我写信',
      'ct.or': '或者在这里找我',

      'ct.l1': '邮箱', 'ct.l2': '完整作品集', 'ct.l3': '作品视频', 'ct.l4': '简历（PDF）',
      'ct.v2': 'Notion', 'ct.v3': 'YouTube', 'ct.v4': '下载',

      'ct.availTitle': '工作状态',
      'ct.availBody': '现居悉尼 · 远程、混合或现场均可 · 学期内每两周最多 48 小时，假期可全职。',
      'ct.respTitle': '回复',
      'ct.respBody': '邮件是最快能找到我的方式，通常一天之内回。',

      'ct.rights': '版权所有。',
      'ct.built': '本站由尹紫涔设计并编写。'
    }
  }
};

/* ------------------------------------------------------------------
   语言控制：把上面所有分组拍平，按 data-i18n 写入 DOM
   ------------------------------------------------------------------ */
window.Lang = (function () {
  var LS_KEY = 'zy-lang';

  function flat(lang) {
    var out = {};
    for (var g in window.I18N) {
      var grp = window.I18N[g][lang];
      if (!grp) continue;
      for (var k in grp) out[k] = grp[k];
    }
    return out;
  }

  var dict = { en: flat('en'), zh: flat('zh') };

  function detect() {
    try {
      var saved = localStorage.getItem(LS_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    } catch (e) { /* 隐私模式下 localStorage 可能抛错 */ }
    var n = (navigator.language || 'en').toLowerCase();
    return n.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  var current = detect();
  var listeners = [];

  function apply(lang) {
    current = lang;
    var d = dict[lang];

    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    document.documentElement.setAttribute('data-lang', lang);

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var v = d[el.getAttribute('data-i18n')];
      if (v === undefined) continue;
      // 值里含标签才走 innerHTML，其余用 textContent，避免不必要的解析
      if (v.indexOf('<') > -1) el.innerHTML = v; else el.textContent = v;
    }

    // 属性型：data-i18n-attr="title:key,aria-label:key"
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < attrNodes.length; i++) {
      var pairs = attrNodes[i].getAttribute('data-i18n-attr').split(',');
      for (var j = 0; j < pairs.length; j++) {
        var p = pairs[j].split(':');
        var val = d[p[1]];
        if (val !== undefined) attrNodes[i].setAttribute(p[0].trim(), val);
      }
    }

    if (d['meta.title']) document.title = d['meta.title'];
    var md = document.querySelector('meta[name="description"]');
    if (md && d['meta.desc']) md.setAttribute('content', d['meta.desc']);

    try { localStorage.setItem(LS_KEY, lang); } catch (e) { /* 忽略 */ }
    for (i = 0; i < listeners.length; i++) listeners[i](lang, d);
  }

  return {
    get: function () { return current; },
    t: function (key) { return dict[current][key]; },
    apply: apply,
    toggle: function () { apply(current === 'en' ? 'zh' : 'en'); },
    onChange: function (fn) { listeners.push(fn); },
    init: function () { apply(current); }
  };
})();

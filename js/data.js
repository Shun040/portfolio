/* ------------------------------------------------------------------
   data.js — 六个项目的完整数据（中英双语）
   ------------------------------------------------------------------
   这是项目内容的唯一来源。每个项目都不是一句话简介，而是一份可交互的
   案例：背景 → 调研（带真实数字，可视化）→ 机制 → 系统 → 成果 → 影像。

   research.type 决定调研模块渲染成哪种图：
     bars      横向条形图（PainShift / Reground）
     donut     环形图 + 关键数字（Through Their Eyes）
     timeline  时间轴 / 三段式（Tears / EXSTASIS）
     bandscale 量表分段（EmpaLens）

   concept.type 决定机制模块的交互形态：
     mapping   左右对照映射（可逐条点亮）
     loop      循环步骤（可点，自动轮转）
     states    状态切换（点标签换图/换色）
   ------------------------------------------------------------------ */

window.PROJECTS = [

/* ================================================================ 01 */
{
  id: '01', key: 'tears', img: 'assets/tears.jpg', a: '#FF8FA3', b: '#C86DD7',
  en: {
    name: 'Tears before Words',
    type: 'Interactive Installation · Embedded Systems · Public Engagement',
    tag: 'A campus payphone on a wall of scratched messages. Lift the receiver and the wall begins to speak.',
    thesis: 'Children sent away to board are taught, politely, <b>not to ask.</b> This wall asks on their behalf.',
    role: 'Concept, embedded systems, fabrication & exhibition delivery — solo',
    disc: 'Interactive installation · Embedded systems · Public engagement',
    tools: 'Raspberry Pi · Python · GPIO sensing · Surface transducer · Projection',
    year: '2026',
    tags: ['Raspberry Pi', 'Python', 'GPIO', 'Surface transducer', 'Projection'],
    context: {
      lead: 'For children who board from primary school onward, home stops being a place and becomes <b>a phone call you have to justify.</b>',
      probs: [
        'Contact home is rationed — and the rules are posted on the wall beside the phone.',
        'Longing has no sanctioned words, so it goes into the wall as scratches.',
        'By the time a child can name the feeling, they have already learned not to mention it.'
      ]
    },
    research: {
      label: 'Field material',
      lead: 'The notice mounted beside the phone does the work of the whole system. Three sentences, and the call is over before it starts.',
      type: 'timeline',
      data: [
        ['不打扰', '"Mum and Dad work hard — don\'t disturb them."', 'Your need is weighed against their exhaustion, and loses.'],
        ['不麻烦', '"Grandma and Grandpa aren\'t up to it — don\'t trouble them."', 'The second option is closed on grounds of kindness.'],
        ['自己办', '"You\'re grown now — handle your own affairs."', 'Independence, reframed as the absence of anyone to call.']
      ]
    },
    concept: {
      lead: 'Keep the apparatus exactly as it was. <b>Change only what happens when you pick it up.</b>',
      type: 'mapping',
      note: 'Nothing in the piece is invented set-dressing — the phone, the notice and the surface are the originals of that scene. The only addition is that this time the wall answers.',
      data: [
        ['The handset', 'the one sanctioned channel home'],
        ['The scratched wall', 'what got said instead — 回家, again and again'],
        ['The voice in the surface', 'the confession the call was never allowed to carry']
      ],
      fig: ['assets/tears-sign.jpg', '<b>The notice beside the phone.</b> "Mum and Dad work hard, don\'t disturb them. Grandma and Grandpa aren\'t up to it, don\'t trouble them. You\'re grown now — handle your own affairs."']
    },
    system: {
      lead: 'A quiet rig: one sensor, one single-board computer, and a wall that is itself the loudspeaker.',
      pipe: [
        ['Sense', 'A GPIO input on a Raspberry Pi registers the instant the receiver leaves the cradle.'],
        ['Trigger', 'A Python service launches the projected footage and the recorded confession full-screen, in sync.'],
        ['Resonate', 'A surface transducer drives the plywood panel directly — the voice comes out of the wall, not out of a speaker box.']
      ],
      stack: ['Raspberry Pi', 'Python · RPi.GPIO', 'mpv', 'Class-D amplifier', 'Surface transducer', 'Projection'],
      fig: ['assets/tears-build.jpg', '<b>Behind the wall.</b> The transducer is bolted straight to the panel so the board itself resonates; the amplifier feeds it from the Pi.']
    },
    experience: 'You walk up to a wall you recognise even if you were never sent away — institutional green, a payphone, a laminated notice. You lift the receiver expecting a dial tone. Instead the surface under your hand starts to resonate, and the scratches on it are read back to you. <b>The wall says the thing the call could not.</b>',
    outcome: {
      tiles: [
        ['8.5M', 'views · making-of', '422K likes · 22K shares on Douyin'],
        ['2.2M', 'likes · related content', '54.9M views · #1 on Douyin\'s hot list'],
        ['CGTN', 'national broadcast', 'CAFA 2026 Graduation Exhibition coverage']
      ],
      reflect: [
        'Awarded <b>Outstanding Graduation Work</b> by the Central Academy of Fine Arts, and shortlisted to the final review stage of the <b>3rd National Exhibition of Fine Arts for University Students.</b> I ran it end to end — layout, budget, materials, fabrication planning, on-site assembly with the logistics team, then daily floor facilitation and press interviews for the length of the public showing.',
        'The comment threads were the real outcome. The discussion that formed around the work was not about installation art — it was people describing <b>their own boarding-school years,</b> and what they had never been able to say on the phone.'
      ]
    },
    videos: [
      ['N6lR66sqVSg', 'Interactive installation & tech-art showreel'],
      ['KGGisxDQLcE', 'CGTN broadcast — CAFA 2026 Graduation Exhibition']
    ],
    links: [['https://news.cgtn.com/news/2026-06-09/Graduation-exhibition-at-CAFA-explores-identity-and-connection-1NPDfwogLOE/p.html', 'CGTN official coverage (featured at 02:57)']]
  },
  zh: {
    name: '眼泪先于语言',
    type: '交互装置 · 嵌入式系统 · 公共参与',
    tag: '一部校园壁挂电话，装在一面刻满字的墙上。拿起听筒，墙开始说话。',
    thesis: '被送去寄宿的小孩，被很有礼貌地教会了<b>不要开口要</b>。这面墙替他们开口。',
    role: '概念、嵌入式系统、制作与布展落地 —— 独立完成',
    disc: '交互装置 · 嵌入式系统 · 公共参与',
    tools: 'Raspberry Pi · Python · GPIO 传感 · 表面激励器 · 投影',
    year: '2026',
    tags: ['Raspberry Pi', 'Python', 'GPIO', '表面激励器', '投影'],
    context: {
      lead: '对从小学就开始住校的孩子来说，家不再是一个地方，而是<b>一通需要理由才能打的电话</b>。',
      probs: [
        '和家里联系是被配给的 —— 规矩就贴在电话旁边的墙上。',
        '想家没有被允许的说法，于是变成墙上一道道刻痕。',
        '等孩子终于能说清这种感觉时，他早就学会了不提。'
      ]
    },
    research: {
      label: '田野材料',
      lead: '电话旁那张告示，一个人干完了整套系统的活。三句话，电话在拨出去之前就结束了。',
      type: 'timeline',
      data: [
        ['不打扰', '"爸爸妈妈上班辛苦，不要打扰他们。"', '你的需要被拿去和他们的疲惫比，然后输掉。'],
        ['不麻烦', '"爷爷奶奶身体不好，不要麻烦他们。"', '第二个选项以善意的名义被关上。'],
        ['自己办', '"你长大了，自己的事情自己解决。"', '独立，被重新定义成没有人可以打给。']
      ]
    },
    concept: {
      lead: '装置原样保留。<b>只改变你拿起它之后发生的事。</b>',
      type: 'mapping',
      note: '作品里没有一样是编出来的道具 —— 电话、告示、墙面都是那个场景的原物。唯一的添加是：这一次，墙会回答。',
      data: [
        ['听筒', '唯一被许可的回家通道'],
        ['刻满字的墙', '真正被说出口的那些 —— 回家，一遍又一遍'],
        ['墙里的声音', '这通电话从来不被允许承载的那句话']
      ],
      fig: ['assets/tears-sign.jpg', '<b>电话旁的告示。</b>"爸爸妈妈上班辛苦，不要打扰他们。爷爷奶奶身体不好，不要麻烦他们。你长大了，自己的事情自己解决。"']
    },
    system: {
      lead: '一套很安静的装置：一个传感器，一块单板机，和一面本身就是喇叭的墙。',
      pipe: [
        ['感知', 'Raspberry Pi 的一个 GPIO 输入，捕捉听筒离开挂钩的那一瞬间。'],
        ['触发', '一个 Python 服务同步全屏拉起投影影像和那段录音自白。'],
        ['共振', '表面激励器直接驱动整块胶合板 —— 声音是从墙里出来的，不是从音箱里。']
      ],
      stack: ['Raspberry Pi', 'Python · RPi.GPIO', 'mpv', 'D 类功放', '表面激励器', '投影'],
      fig: ['assets/tears-build.jpg', '<b>墙背后。</b>激励器直接拧在板子上，让板子自己共振；功放由 Pi 供信号。']
    },
    experience: '你走向一面墙，就算你没被送去寄宿也认得出它 —— 机构绿、壁挂电话、一张塑封告示。你拿起听筒，以为会听到拨号音。结果是你手下的那块板开始震动，墙上那些刻痕被读回给你听。<b>墙说出了那通电话说不出的话。</b>',
    outcome: {
      tiles: [
        ['850万', '播放 · 制作幕后', '抖音 42.2 万赞 · 2.2 万转发'],
        ['220万', '点赞 · 相关内容', '5490 万播放 · 抖音热榜第一'],
        ['CGTN', '国家级报道', '中央美院 2026 毕业展专题']
      ],
      reflect: [
        '获中央美术学院<b>优秀毕业作品奖</b>，入围<b>第三届全国大学生美术作品展终评</b>。整个项目我从头做到尾 —— 场地布局、预算、材料采购、施工排期、和物流团队现场组装，然后是整个公开展期内每天的现场引导和媒体采访。',
        '评论区才是真正的成果。作品周围长出来的讨论根本不是在讨论装置艺术 —— 是一个个人在讲<b>自己的寄宿年月</b>，和那些在电话里始终没能说出口的话。'
      ]
    },
    videos: [
      ['N6lR66sqVSg', '交互装置与科技艺术作品集锦'],
      ['KGGisxDQLcE', 'CGTN 报道 —— 中央美院 2026 毕业展']
    ],
    links: [['https://news.cgtn.com/news/2026-06-09/Graduation-exhibition-at-CAFA-explores-identity-and-connection-1NPDfwogLOE/p.html', 'CGTN 官方报道（作品出现在 02:57）']]
  }
},

/* ================================================================ 02 */
{
  id: '02', key: 'exstasis', img: 'assets/exstasis.jpg', a: '#5FE873', b: '#16E0A0',
  en: {
    name: 'EXSTASIS',
    type: 'Interactive Installation · Bio-art · Art Therapy',
    tag: 'This project draws on artificial intelligence to integrate the shamanic principles of decentralization and coexistence with nature into everyday life.',
    thesis: 'In contemporary society, the excessive exploitation of nature through technology and the persistence of centralized political power have long been <b>ongoing issues.</b>',
    role: 'Concept, interaction & fabrication — solo',
    disc: 'Installation · Bio-art · Art therapy',
    tools: 'Arduino · Python · TouchDesigner · Machine vision',
    year: '2024',
    tags: ['Arduino', 'Python', 'TouchDesigner', 'Machine vision'],
    context: {
      lead: 'We over-exploit nature and concentrate power — and we have lost the sense that we <b>belong to a larger living system.</b>',
      probs: [
        'Nature treated as a resource to exploit.',
        'Power endlessly centralized.',
        'No felt sense of kinship with the living world.'
      ]
    },
    research: {
      label: 'Research',
      lead: 'Shamanism — humanity\'s oldest folk belief — recurs across every culture I traced.',
      type: 'timeline',
      data: [
        ['Neolithic', 'North / Central Asia', 'Shamanic beliefs predate any organized religion.'],
        ['769 A.D.', 'Tibet · Bön', 'Suppressed, then absorbed into Tibetan Buddhism.'],
        ['1951 – now', 'Europe', 'Reborn as a critique of industrialization — the self-regulating "Mother Earth".']
      ]
    },
    concept: {
      lead: 'Personify the invisible power that accompanies us — give the microbiome <b>the form of a guardian you can meet.</b>',
      type: 'mapping',
      note: 'Common colonies set the guardian\'s form; <b>rare colonies add starlike shimmer</b> — so every guardian is genuinely unique.',
      data: [
        ['Propionibacterium', 'surface roughness'],
        ['Bacillus licheniformis', 'colour'],
        ['Cutibacterium', 'expression']
      ],
      fig: ['assets/exstasis-spirits.jpg', '<b>Guardian spirits</b>, each generated from a visitor\'s own colonies.']
    },
    system: {
      lead: 'A full pipeline from petri dish to real-time render.',
      pipe: [
        ['Cultivate', 'Hand bacteria on Columbia blood agar, grown three days.'],
        ['Identify', 'Machine vision and Gram-stain classify the colonies and count proportions.'],
        ['Render', 'Arduino → Python → TouchDesigner over TCP — live.']
      ],
      stack: ['Arduino', 'Python · serial/UDP', 'TouchDesigner', 'Machine vision', 'Microbial culture']
    },
    experience: 'Shamanic traditions have appeared at various stages in the formation of nearly all civilizations. This universality points to humanity\'s shared capacity to find, through ecstatic communion with nature, a personalized path toward harmony with both the environment and the social world.',
    outcome: {
      tiles: [
        ['3', 'systems fused', 'physical computing · ML vision · real-time render'],
        ['1-of-1', 'per visitor', 'colony proportions → a unique guardian'],
        ['Biosafe', 'feasibility', 'cultivation vetted with professionals']
      ],
      reflect: ['The deep learning was never the point. Making the invisible microbial world into something you could <b>meet</b> — that was the work.']
    },
    videos: []
  },
  zh: {
    name: 'EXSTASIS 出神',
    type: '交互装置 · 生物艺术 · 艺术治疗',
    tag: '这个项目借助人工智能，把萨满的去中心化与万物共生的观念，整合进日常生活。',
    thesis: '在当代社会，技术对自然的过度索取，与政治权力的持续集中，长久以来<b>都是悬而未决的问题。</b>',
    role: '概念、交互与制作 —— 独立完成',
    disc: '装置 · 生物艺术 · 艺术治疗',
    tools: 'Arduino · Python · TouchDesigner · 机器视觉',
    year: '2024',
    tags: ['Arduino', 'Python', 'TouchDesigner', '机器视觉'],
    context: {
      lead: '我们过度索取自然、不断把权力集中 —— 同时失去了那种<b>自己属于一个更大的生命系统</b>的感觉。',
      probs: [
        '自然被当成可供开采的资源。',
        '权力被无止境地集中。',
        '对生命世界没有任何切身的亲缘感。'
      ]
    },
    research: {
      label: '研究',
      lead: '萨满 —— 人类最古老的民间信仰 —— 在我追溯过的每一种文化里都反复出现。',
      type: 'timeline',
      data: [
        ['新石器时代', '北亚 / 中亚', '萨满信仰早于任何有组织的宗教。'],
        ['公元 769 年', '西藏 · 苯教', '先被压制，后被藏传佛教吸收。'],
        ['1951 至今', '欧洲', '作为对工业化的批判重生 —— 那个能自我调节的"地球母亲"。']
      ]
    },
    concept: {
      lead: '把那个一直伴随我们、却看不见的力量人格化 —— 给微生物群<b>一个你能见到的守护者形象。</b>',
      type: 'mapping',
      note: '常见菌落决定守护灵的形态；<b>稀有菌落带来星点般的闪烁</b> —— 所以每一个守护灵都是真的独一无二。',
      data: [
        ['丙酸杆菌', '表面粗糙度'],
        ['地衣芽孢杆菌', '颜色'],
        ['痤疮丙酸杆菌', '表情']
      ],
      fig: ['assets/exstasis-spirits.jpg', '<b>守护灵</b>，每一个都由观众自己的菌落生成。']
    },
    system: {
      lead: '一条从培养皿到实时渲染的完整管线。',
      pipe: [
        ['培养', '手上的细菌接种到哥伦比亚血琼脂，培养三天。'],
        ['识别', '机器视觉配合革兰氏染色，对菌落分类并统计比例。'],
        ['渲染', 'Arduino → Python → TouchDesigner，通过 TCP 实时传输。']
      ],
      stack: ['Arduino', 'Python · 串口/UDP', 'TouchDesigner', '机器视觉', '微生物培养']
    },
    experience: '萨满传统出现在几乎所有文明形成的各个阶段。这种普遍性指向人类共有的一种能力：通过与自然的出神式交融，找到一条与环境和社会同时达成和谐的、属于个人的路径。',
    outcome: {
      tiles: [
        ['3', '套系统融合', '物理计算 · 机器视觉 · 实时渲染'],
        ['独一无二', '每位观众', '菌落比例 → 一个专属守护灵'],
        ['生物安全', '可行性', '培养流程经专业人士审核']
      ],
      reflect: ['深度学习从来不是重点。把看不见的微生物世界变成一个你能<b>见到</b>的东西 —— 那才是这件作品。']
    },
    videos: []
  }
},

/* ================================================================ 03 */
{
  id: '03', key: 'painshift', img: 'assets/painshift.jpg', a: '#6FA8FF', b: '#9E8CFF',
  en: {
    name: 'PainShift',
    type: 'VR · Biofeedback · Art Therapy · Service Design',
    tag: 'A VR-based meditation system for pain management aimed at reducing reliance on painkillers.',
    thesis: 'By reframing pain as <b>a manageable cognitive and sensory experience</b>, the system encourages non-drug coping strategies and supports safer, long-term pain regulation.',
    role: 'Concept, interaction, hardware, Unreal Engine build',
    disc: 'VR · Biofeedback · Service design',
    tools: 'Unreal Engine · Arduino · Pulse & stretch sensors · TouchDesigner',
    year: '2024',
    tags: ['Unreal Engine', 'Arduino', 'Biofeedback', 'TouchDesigner'],
    context: {
      lead: 'Painkiller use surged after COVID-19 — and misuse quietly does <b>real, lasting harm.</b>',
      probs: [
        'Ibuprofen and paracetamol sales spiked; self-medication is now the default.',
        'Overdose damages the liver and kidneys.',
        'Long-term use breeds psychological dependence — more for the same effect.'
      ]
    },
    research: {
      label: 'Research',
      lead: 'A 1,326-user diary study exposed how routine — and unrecognized — NSAID use has become.',
      type: 'bars',
      unit: '%', max: 100,
      items: [
        ['Took OTC ibuprofen in one week', 90],
        ['Also took other, non-ibuprofen NSAIDs', 37],
        ['Exceeded the daily dose limit', 11]
      ],
      cap: 'Source: 1,326-user online diary study · Wiley PDS 10.1002/pds.4391'
    },
    concept: {
      lead: 'Turn breathing into a visible, rewarding practice — <b>biofeedback the patient can watch working.</b>',
      type: 'loop',
      note: 'Keep breathing and the mandala stays vivid. <b>Stop, and it turns transparent</b> — pulling your attention straight back to the body.',
      data: ['Diaphragmatic breath', 'Mandala blooms', 'Attention shifts', 'Pain reframed'],
      clips: 10,
      figcap: '<b>Evolving mandalas</b> — a single tulip mirrored and layered in TouchDesigner, driven live by the breath. Ten states, from the first shallow inhale to a fully open pattern. <i>Hover or tap a tile to play it.</i>'
    },
    system: {
      lead: 'A working sensor rig wired into a real-time engine.',
      pipe: [
        ['Sense', 'Arduino reads a graphite stretch sensor (breath) and a pulse sensor, smoothed and normalized.'],
        ['Drive', 'Data flows to Unreal via blueprint — heart rate controls the light, breath controls the mandala.'],
        ['Compose', 'TouchDesigner mirrors and layers a flower into an evolving radial mandala.']
      ],
      stack: ['Unreal Engine', 'Arduino', 'Pulse + stretch sensors', 'TouchDesigner']
    },
    experience: 'Through immersive environments, guided breathing, and gentle interaction, it helps users <b>shift attention and perception of pain</b> rather than suppress it with medication. Below, that logic is playable — breathe with the ring and the session opens up.',
    playground: true,
    outcome: {
      tiles: [
        ['< $50', 'sensor rig', 'Arduino pulse + stretch, off-the-shelf'],
        ['3', 'demos shipped', 'end-to-end sensor → VR loop, on video'],
        ['Drug-free', 'at home', 'a headset patients reach for, not a pill']
      ],
      reflect: ['Pain you can <b>watch yourself transform</b> is pain you can manage. The clinical value isn\'t the graphics — it\'s a patient who stays in the session.']
    },
    videos: [
      ['wJhrbL8yUo0', 'The growing mandala pattern'],
      ['2TrKu4M-xWI', 'Unreal Engine light control'],
      ['V6A4KWkx0IY', 'Meditation video — full loop']
    ]
  },
  zh: {
    name: 'PainShift 疼痛转移',
    type: 'VR · 生物反馈 · 艺术治疗 · 服务设计',
    tag: '一套基于 VR 的疼痛管理冥想系统，目标是降低对止痛药的依赖。',
    thesis: '通过把疼痛重新框定为<b>一种可管理的认知与感官体验</b>，系统鼓励非药物的应对策略，支持更安全的长期疼痛调节。',
    role: '概念、交互、硬件、Unreal Engine 实现',
    disc: 'VR · 生物反馈 · 服务设计',
    tools: 'Unreal Engine · Arduino · 脉搏与拉伸传感器 · TouchDesigner',
    year: '2024',
    tags: ['Unreal Engine', 'Arduino', '生物反馈', 'TouchDesigner'],
    context: {
      lead: '新冠之后止痛药用量激增 —— 而滥用正在安静地造成<b>真实且长期的损伤</b>。',
      probs: [
        '布洛芬和对乙酰氨基酚销量暴涨，自行用药成了默认选项。',
        '过量服用损伤肝脏和肾脏。',
        '长期服用会形成心理依赖 —— 要越吃越多才有同样效果。'
      ]
    },
    research: {
      label: '调研',
      lead: '一项 1326 人的日记式研究，暴露出非甾体抗炎药的使用已经有多日常、多不被察觉。',
      type: 'bars',
      unit: '%', max: 100,
      items: [
        ['一周内服用过非处方布洛芬', 90],
        ['同时服用了其他非甾体抗炎药', 37],
        ['超过每日剂量上限', 11]
      ],
      cap: '来源：1326 人在线日记研究 · Wiley PDS 10.1002/pds.4391'
    },
    concept: {
      lead: '把呼吸变成一件看得见、有回报的练习 —— <b>让病人亲眼看到生物反馈在起作用。</b>',
      type: 'loop',
      note: '持续呼吸，曼陀罗就保持鲜明。<b>一停下，它就变得透明</b> —— 把你的注意力直接拉回身体。',
      data: ['腹式呼吸', '曼陀罗绽放', '注意力转移', '疼痛被重新框定'],
      clips: 10,
      figcap: '<b>演化中的曼陀罗</b> —— 一朵郁金香在 TouchDesigner 里被镜像、叠加，由呼吸实时驱动。十个状态，从第一口浅浅的吸气到完全展开的纹样。<i>把鼠标移上去、或点一下，就会播放。</i>'
    },
    system: {
      lead: '一套真正能跑的传感装置，接进实时引擎。',
      pipe: [
        ['感知', 'Arduino 读取石墨拉伸传感器（呼吸）和脉搏传感器，做平滑与归一化。'],
        ['驱动', '数据通过蓝图进入 Unreal —— 心率控制光，呼吸控制曼陀罗。'],
        ['生成', 'TouchDesigner 把一朵花镜像叠加成不断演化的放射状曼陀罗。']
      ],
      stack: ['Unreal Engine', 'Arduino', '脉搏 + 拉伸传感器', 'TouchDesigner']
    },
    experience: '通过沉浸式环境、引导呼吸与温和的交互，它帮助使用者<b>转移对疼痛的注意与感知</b>，而不是用药物去压制它。下面这个模块就是这套逻辑 —— 跟着光环呼吸，会话会逐渐打开。',
    playground: true,
    outcome: {
      tiles: [
        ['< 50 美元', '传感装置', 'Arduino 脉搏 + 拉伸，全是现成件'],
        ['3', '个已交付的演示', '从传感器到 VR 闭环，全程有视频'],
        ['无药物', '可在家使用', '一个病人愿意主动去拿的头显，而不是药片']
      ],
      reflect: ['能<b>亲眼看着自己转化</b>的疼痛，就是可以管理的疼痛。临床价值不在画面，而在于病人愿意留在这一次会话里。']
    },
    videos: [
      ['wJhrbL8yUo0', '不断生长的曼陀罗纹样'],
      ['2TrKu4M-xWI', 'Unreal Engine 灯光控制'],
      ['V6A4KWkx0IY', '冥想影像 —— 完整循环']
    ]
  }
},

/* ================================================================ 04 */
{
  id: '04', key: 'reground', img: 'assets/reground.jpg', a: '#F4A72A', b: '#FF7E5F',
  en: {
    name: 'Reground',
    type: 'UX · Service · Product · Art Therapy',
    tag: 'Through an app paired with an adorable companion robot, I aim to guide users through grounding exercises and help them disengage from dissociation.',
    thesis: 'Though therapists often teach grounding techniques, <b>many patients struggle to recall them during dissociative episodes.</b>',
    role: 'UX, service design, 3D, hardware concept',
    disc: 'UX · Service · Product design',
    tools: 'Figma · 3D modelling · Companion robot · EMDR',
    year: '2025',
    tags: ['UX / Service', '3D Modelling', 'Companion robot', 'EMDR'],
    context: {
      lead: 'Dissociation is <b>common, dangerous, and under-served.</b>',
      probs: [
        'Episodes cause memory gaps, loss of self — even traffic accidents.',
        'Patients can\'t recall grounding techniques mid-episode.',
        'Clinicians are blind to what happens between sessions.'
      ]
    },
    research: {
      label: 'Research',
      lead: 'Asked how the tool should intervene, users were clear: they want control — and gentleness.',
      type: 'bars',
      unit: '', max: 42,
      items: [
        ['Auto-trigger during an episode', 42],
        ['Manual aid, before an episode', 27],
        ['A daily practice aid', 20],
        ['Manual, before the feeling hits', 12]
      ],
      cap: 'Survey · preferred trigger behaviour (respondent counts)'
    },
    concept: {
      lead: 'A companion that prompts you, grounds you, and <b>asks for care in return.</b>',
      type: 'states',
      note: 'A <b>vulnerable, attention-seeking form</b> (like Paro the therapy seal) triggers a caregiving instinct — and that is what drives people to keep it close.',
      data: [
        ['🐤', 'Active', 'offers candy', '#F4A72A'],
        ['🥚', 'Sleep', 'folds to a carry-shell', '#FF9E6B'],
        ['💤', 'Standby', 'awaits your command', '#C98B4A']
      ],
      fig: ['assets/reground-robot.jpg', '<b>The companion robot</b> across its modes — non-medical by design, so people carry it in public.']
    },
    system: {
      lead: 'Two connected modules, one companion object.',
      pipe: [
        ['Patient app', 'EMDR · five-senses grounding · records · empowerment game.'],
        ['Clinician view', 'Dissociation trends · risk alerts · patient chats — real-time insight.'],
        ['Companion object', 'A 3D-modelled bird across active, sleep and standby modes.']
      ],
      stack: ['Figma', '3D modelling', 'Companion robot', 'EMDR protocol', 'Bluetooth']
    },
    experience: 'In everyday life, people experience moments of unreality to varying degrees. When these episodes become frequent and persistent, they can lead to memory confusion and even moments of <b>not knowing how one arrived at a certain place</b>, which may result in traffic accidents and other danger.',
    outcome: {
      tiles: [
        ['30 → 5 min', 'recovery time', 'reported by a long-term user after ~1 month'],
        ['2', 'connected modules', 'patient app + clinician view, one system'],
        ['"A companion"', 'adoption driver', 'non-medical form → willingness to use']
      ],
      reflect: ['The soft form isn\'t decoration — it\'s the mechanism. People keep the robot close, so the grounding is <b>there when the episode hits.</b>']
    },
    videos: [['lR-3SOBmTCE', 'UI / UX and AI-assisted frontend demo']]
  },
  zh: {
    name: 'Reground 复地',
    type: 'UX · 服务 · 产品 · 艺术治疗',
    tag: '通过一个应用配合一只可爱的陪伴机器人，引导使用者完成着陆练习，帮助他们从解离中脱离。',
    thesis: '尽管治疗师常常教授着陆技巧，<b>许多病人在解离发作当中根本回想不起来。</b>',
    role: 'UX、服务设计、3D、硬件概念',
    disc: 'UX · 服务 · 产品设计',
    tools: 'Figma · 3D 建模 · 陪伴机器人 · EMDR',
    year: '2025',
    tags: ['UX / 服务设计', '3D 建模', '陪伴机器人', 'EMDR'],
    context: {
      lead: '解离是一件<b>常见、危险，却几乎没人服务</b>的事。',
      probs: [
        '发作会导致记忆断片、自我丧失 —— 甚至交通事故。',
        '病人在发作当中根本想不起来任何"着陆"技巧。',
        '医生对两次门诊之间发生了什么一无所知。'
      ]
    },
    research: {
      label: '调研',
      lead: '问用户希望工具怎么介入，回答很明确：他们要控制权 —— 也要温柔。',
      type: 'bars',
      unit: '', max: 42,
      items: [
        ['发作当中自动触发', 42],
        ['发作前，手动求助', 27],
        ['作为日常练习工具', 20],
        ['感觉来临前，手动开启', 12]
      ],
      cap: '问卷 · 偏好的触发方式（人数）'
    },
    concept: {
      lead: '一个会提醒你、把你拉回地面、<b>并且反过来向你要照顾</b>的同伴。',
      type: 'states',
      note: '一个<b>脆弱的、需要被关注的形态</b>（像治疗海豹 Paro）会唤起照护本能 —— 而这正是人愿意把它带在身边的原因。',
      data: [
        ['🐤', '活跃', '递给你一颗糖', '#F4A72A'],
        ['🥚', '睡眠', '收拢成便携外壳', '#FF9E6B'],
        ['💤', '待机', '等你的指令', '#C98B4A']
      ],
      fig: ['assets/reground-robot.jpg', '<b>陪伴机器人</b>的三种模式 —— 刻意做得不像医疗器械，人才会带着它出门。']
    },
    system: {
      lead: '两个互联的模块，一个陪伴物件。',
      pipe: [
        ['病人端 App', 'EMDR · 五感着陆 · 记录 · 赋能小游戏。'],
        ['医生端视图', '解离趋势 · 风险预警 · 与病人的对话 —— 实时掌握。'],
        ['陪伴物件', '一只 3D 建模的小鸟，在活跃、睡眠、待机三种模式间切换。']
      ],
      stack: ['Figma', '3D 建模', '陪伴机器人', 'EMDR 方案', '蓝牙']
    },
    experience: '在日常生活里，人们都会不同程度地经历不真实感。当这种发作变得频繁而持续，就会导致记忆混乱，甚至出现<b>不知道自己是怎么到达某个地方的</b>时刻，进而可能引发交通事故等危险。',
    outcome: {
      tiles: [
        ['30 → 5 分钟', '恢复时长', '一位长期用户使用约一个月后的反馈'],
        ['2', '个互联模块', '病人端 + 医生端，同一套系统'],
        ['"像个同伴"', '采纳驱动力', '非医疗形态 → 愿意使用']
      ],
      reflect: ['柔软的外形不是装饰 —— 它就是机制本身。人愿意把它带在身边，所以<b>发作来的那一刻，着陆工具就在手边</b>。']
    },
    videos: [['lR-3SOBmTCE', 'UI / UX 与 AI 辅助前端演示']]
  }
},

/* ================================================================ 05 */
{
  id: '05', key: 'empalens', img: 'assets/empalens.jpg', a: '#4D8DF0', b: '#4DE0E0',
  en: {
    name: 'EmpaLens',
    type: 'Product · Service · UX · Wearables',
    tag: 'An interactive system designed to enhance empathy and communication in intimate relationships involving autistic individuals.',
    thesis: 'These partners have been likened to <b>Cassandra from Greek mythology — able to foresee the future but not believed.</b>',
    role: 'Product design, UX, ML integration, industrial design',
    disc: 'Product · Service · Wearables',
    tools: 'CNN · FER-2013 · OpenCV / Keras · AR · Figma',
    year: '2025',
    tags: ['CNN · FER-2013', 'OpenCV / Keras', 'AR', 'Wearables'],
    context: {
      lead: 'When we talk about autism, <b>the neurotypical partner is invisible.</b>',
      probs: [
        'Partners live with loneliness and despair — "Cassandra Syndrome".',
        '13% of mothers of autistic individuals had affective disorders.',
        'Nonverbal cues are hard to read in the moment; conflict escalates.'
      ]
    },
    research: {
      label: 'Research',
      lead: 'A validated scale grounds an invisible experience in measurement.',
      type: 'bandscale',
      title: 'CS-RIDS-24 · Relationship & Identity Distress Scale',
      subs: ['Relational Distress', 'Identity Erosion', 'Communication & Validation', 'Coping & Resilience'],
      bands: [['No / mild', '#35C46A', 56], ['Moderate', '#F4B740', 88], ['Severe', '#FF5A52', 120]],
      min: 24,
      cap: '24 items · 4 subscales · total range 24–120'
    },
    concept: {
      lead: 'Translate emotion in the moment — a glanceable signal <b>for both people.</b>',
      type: 'states',
      note: 'The chest badge broadcasts the wearer\'s state so a partner can read it across a room; the glasses read <b>others\'</b> emotions as text with likely causes.',
      data: [
        ['😄', 'Happy', 'assets/empabadge-happy.png', '#35C46A'],
        ['😠', 'Angry', 'assets/empabadge-angry.png', '#FF5A52'],
        ['🙂', 'Calm', 'assets/empabadge-calm.png', '#4D8DF0'],
        ['😮', 'Surprised', 'assets/empabadge-surprised.png', '#F4A72A']
      ],
      figcap: '<b>The EmpaBadge</b> — the wearer\'s state, made visible and ambient. Four of the states the ring can hold.'
    },
    system: {
      lead: 'A working recognition core, a wearable system, industrial design.',
      pipe: [
        ['Recognize', 'A CNN on FER-2013 (OpenCV / Keras) — face detection, seven emotions, ~0.05s refresh.'],
        ['Wear', 'Smart glasses (AR display, camera) plus an LED chest badge translate and broadcast.'],
        ['Reflect', 'A hi-fi app: emotion journal, insights, empathy-building exercises.']
      ],
      stack: ['CNN · FER-2013', 'OpenCV / Keras', 'AR display', 'Wearables', 'Figma']
    },
    experience: 'Using smart glasses and wearable badges, it translates and visualizes real-time emotional states, logs interactions, and provides AI-guided exercises. It supports mutual understanding, emotional awareness, and <b>proactive conflict prevention</b> through playful, personalized training.',
    outcome: {
      tiles: [
        ['~0.05s', 'recognition refresh', 'working FER-2013 CNN, real time'],
        ['3', 'surfaces', 'glasses · badge · app — read, broadcast, reflect'],
        ['The partner', 'the market', 'an under-served group nobody designs for']
      ],
      reflect: ['The ethical move and the market move are the same one: <b>build for the partner</b>, the person every other product forgets.']
    },
    videos: []
  },
  zh: {
    name: 'EmpaLens 共感之镜',
    type: '产品 · 服务 · UX · 可穿戴',
    tag: '一套交互系统，用于增进涉及自闭症人士的亲密关系中的共情与沟通。',
    thesis: '这些伴侣常被比作<b>希腊神话中的卡桑德拉 —— 能预见未来，却没有人相信她。</b>',
    role: '产品设计、UX、机器学习集成、工业设计',
    disc: '产品 · 服务 · 可穿戴',
    tools: 'CNN · FER-2013 · OpenCV / Keras · AR · Figma',
    year: '2025',
    tags: ['CNN · FER-2013', 'OpenCV / Keras', 'AR', '可穿戴'],
    context: {
      lead: '我们谈论自闭症的时候，<b>神经典型的那一方伴侣是隐形的。</b>',
      probs: [
        '伴侣长期处在孤独与绝望里 —— 所谓"卡桑德拉综合征"。',
        '自闭症人士的母亲中有 13% 患有情感障碍。',
        '非语言线索在当下很难读懂，冲突因此不断升级。'
      ]
    },
    research: {
      label: '调研',
      lead: '一份经过验证的量表，把一种隐形的经验落进了可测量的范围。',
      type: 'bandscale',
      title: 'CS-RIDS-24 · 关系与身份困扰量表',
      subs: ['关系困扰', '身份侵蚀', '沟通与被确认', '应对与韧性'],
      bands: [['无 / 轻度', '#35C46A', 56], ['中度', '#F4B740', 88], ['重度', '#FF5A52', 120]],
      min: 24,
      cap: '24 个题项 · 4 个分量表 · 总分范围 24–120'
    },
    concept: {
      lead: '在当下翻译情绪 —— 一个<b>两个人都看得懂</b>的、一瞥即知的信号。',
      type: 'states',
      note: '胸前的徽章广播佩戴者自己的状态，让伴侣隔着房间也能读到；眼镜则把<b>对方</b>的情绪读成文字，并给出可能的原因。',
      data: [
        ['😄', '开心', 'assets/empabadge-happy.png', '#35C46A'],
        ['😠', '生气', 'assets/empabadge-angry.png', '#FF5A52'],
        ['🙂', '平静', 'assets/empabadge-calm.png', '#4D8DF0'],
        ['😮', '惊讶', 'assets/empabadge-surprised.png', '#F4A72A']
      ],
      figcap: '<b>EmpaBadge 情绪徽章</b> —— 把佩戴者的状态变得可见、且不打扰。这是光环能呈现的其中四种状态。'
    },
    system: {
      lead: '一个真正能跑的识别内核、一套可穿戴系统、一份工业设计。',
      pipe: [
        ['识别', '基于 FER-2013 的 CNN（OpenCV / Keras）—— 人脸检测、七种情绪、约 0.05 秒刷新。'],
        ['佩戴', '智能眼镜（AR 显示、摄像头）加 LED 胸章，负责翻译与广播。'],
        ['回看', '一个高保真 App：情绪日记、洞察、共情练习。']
      ],
      stack: ['CNN · FER-2013', 'OpenCV / Keras', 'AR 显示', '可穿戴', 'Figma']
    },
    experience: '借助智能眼镜与可穿戴徽章，它实时翻译并可视化情绪状态、记录互动，并提供由 AI 引导的练习。通过带有游戏性的个性化训练，支持相互理解、情绪觉察，以及<b>主动的冲突预防</b>。',
    outcome: {
      tiles: [
        ['约 0.05 秒', '识别刷新', '真正跑起来的 FER-2013 CNN，实时'],
        ['3', '个界面', '眼镜 · 徽章 · App —— 读取、广播、回看'],
        ['伴侣', '市场', '一个没有人为其设计的、被忽视的群体']
      ],
      reflect: ['伦理上的选择和市场上的选择是同一个：<b>为伴侣而做</b>，那个被其他所有产品遗忘的人。']
    },
    videos: []
  }
},

/* ================================================================ 06 */
{
  id: '06', key: 'through-eyes', img: 'assets/through-eyes.jpg', a: '#FF5A52', b: '#FF9E45',
  en: {
    name: 'Through Their Eyes',
    type: 'Interactive Installation · Critical Design',
    tag: 'Many, as first-time observers, cannot truly empathize with the harm caused by being secretly recorded. I aimed to create an experience that makes these people feel this harm.',
    thesis: 'This project does not aim to condemn the perpetrators. Instead, it uses artistic means to transform the often misunderstood experiences of women into <b>crisis scenarios that anyone could potentially encounter.</b>',
    role: 'Concept, research, installation design — solo',
    disc: 'Interactive installation · Critical design',
    tools: 'Pinhole cameras · AI generation · Real-time installation',
    year: '2025',
    tags: ['Pinhole cameras', 'AI generation', 'Installation'],
    context: {
      lead: 'The harm of secret filming is dismissed by <b>people who have never been the target.</b>',
      probs: [
        '"No harm if it isn\'t shared. No privacy in public anyway."',
        'The "Mask Park" ring made covert filming feel ordinary.',
        'First-time observers can\'t imagine losing control of their own image.'
      ]
    },
    research: {
      label: 'Research',
      lead: 'Most people know the harm is real — a stubborn minority still won\'t feel it.',
      type: 'donut',
      items: [['Yes — it causes lasting harm', 63, '#FF5A52'], ['Not sure', 23, '#F4B740'], ['No', 14, '#5F6B74']],
      center: ['63%', 'said yes'],
      stat: ['627k', 'users across the "Mask Park" covert-filming ring'],
      pills: ['Power outlet', 'Router', 'Phone', 'Lighter', 'Glasses'],
      pillcap: 'Covert cameras hide inside everyday objects — turning ordinary rooms into surveillance.'
    },
    concept: {
      lead: 'Make the bystander the target — <b>so the harm stops being abstract.</b>',
      type: 'loop',
      note: 'You tear the papers and switch off the TV — but the printer keeps printing and the TV turns itself back on. <b>The loop is the point.</b>',
      data: ['You explore', 'Hidden cameras film you', 'AI fabricates your "news"', 'The printer spools tabloids', 'It won\'t stop'],
      fig: ['assets/through-eyes.jpg', '<b>The reveal</b> — the TV shows you inside fabricated breaking news while the printer spools tabloids of the same.']
    },
    system: {
      lead: 'An ecosystem critique, staged as an experience.',
      pipe: [
        ['Map', 'An ecosystem diagram: technology, distribution, gendered power and lagging law manufacture the harm together.'],
        ['Stage', 'Everyday objects conceal pinhole cameras; a TV and a printer form the reveal.'],
        ['Reveal', 'AI generates fake news of the visitor in real time — the story is about you.']
      ],
      stack: ['Pinhole cameras', 'Real-time AI generation', 'Installation design']
    },
    experience: 'A television initially plays footage of previous visitors, so new viewers are unaware of their own exposure. As viewers look curiously, a printer begins producing false tabloid sheets, and the TV shifts to show the audience themselves being secretly recorded and slandered. <b>Only then do viewers realize they have unknowingly become the targets.</b>',
    outcome: {
      tiles: [
        ['Structure', 'not blame', 'maps the system that produces the harm'],
        ['First person', 'method', 'the bystander becomes the target'],
        ['"Just watching"', '→ watched', 'the argument words can\'t make']
      ],
      reflect: ['You can\'t argue someone into empathy. You can only <b>put them in the frame</b> — and let them feel what they dismissed.']
    },
    videos: []
  },
  zh: {
    name: '以他人之眼',
    type: '交互装置 · 批判性设计',
    tag: '很多人作为初次的旁观者，无法真正共情被偷拍所造成的伤害。我想造出一种体验，让这些人感受到这种伤害。',
    thesis: '这个项目并不意在谴责施害者。它用艺术的方式，把常被误解的女性经验，转化为<b>任何人都可能遭遇的危机情境。</b>',
    role: '概念、研究、装置设计 —— 独立完成',
    disc: '交互装置 · 批判性设计',
    tools: '针孔摄像头 · AI 生成 · 实时装置',
    year: '2025',
    tags: ['针孔摄像头', 'AI 生成', '装置'],
    context: {
      lead: '偷拍造成的伤害，总是被<b>那些从来没当过目标的人</b>轻描淡写地带过。',
      probs: [
        '"不传播就没有伤害。反正公共场合本来就没有隐私。"',
        '"面具公园"那个偷拍团伙，让偷拍这件事显得稀松平常。',
        '第一次旁观的人，想象不出失去对自己形象的控制是什么感觉。'
      ]
    },
    research: {
      label: '调研',
      lead: '大多数人知道伤害是真的 —— 但仍有固执的一小部分人感觉不到。',
      type: 'donut',
      items: [['是 —— 会造成长期伤害', 63, '#FF5A52'], ['不确定', 23, '#F4B740'], ['否', 14, '#5F6B74']],
      center: ['63%', '回答"是"'],
      stat: ['62.7 万', '"面具公园"偷拍团伙涉及的用户数'],
      pills: ['插座', '路由器', '手机', '打火机', '眼镜'],
      pillcap: '偷拍设备藏在日常物件里 —— 把普通房间变成监视现场。'
    },
    concept: {
      lead: '让旁观者成为目标 —— <b>伤害才不再是抽象的。</b>',
      type: 'loop',
      note: '你撕掉那些报纸、关掉电视 —— 但打印机继续打，电视自己又开了。<b>这个循环本身就是作品。</b>',
      data: ['你四处查看', '隐藏摄像头拍下你', 'AI 编造关于你的"新闻"', '打印机吐出小报', '它停不下来'],
      fig: ['assets/through-eyes.jpg', '<b>揭示的那一刻</b> —— 电视里播着关于你的虚构突发新闻，打印机同时吐出同样内容的小报。']
    },
    system: {
      lead: '一份关于生态的批判，被搭成了一次体验。',
      pipe: [
        ['测绘', '一张生态图：技术、传播渠道、性别权力与滞后的法律，共同制造了这种伤害。'],
        ['布置', '日常物件里藏着针孔摄像头；一台电视和一台打印机构成揭示装置。'],
        ['揭示', 'AI 实时生成关于观众的假新闻 —— 这条新闻是关于你的。']
      ],
      stack: ['针孔摄像头', '实时 AI 生成', '装置设计']
    },
    experience: '电视起初播放的是此前观众的影像，所以新来的人并不知道自己已经暴露。当观众好奇地四处查看时，打印机开始吐出伪造的小报，电视随即切换成观众自己被偷拍与诽谤的画面。<b>直到这时，观众才意识到自己已经在不知情中成为目标。</b>',
    outcome: {
      tiles: [
        ['结构', '而非归咎', '测绘出制造这种伤害的整个系统'],
        ['第一人称', '方法', '旁观者变成目标'],
        ['"只是看看"', '→ 被看', '语言做不到的那个论证']
      ],
      reflect: ['你没法把一个人说服到共情。你只能<b>把他放进画面里</b> —— 让他亲身感受他刚才轻描淡写带过的东西。']
    },
    videos: []
  }
}

];


/* ------------------------------------------------------------------
   履历 —— 全部来自《尹紫涔_艺术家简介》，未增补、未润色
   ------------------------------------------------------------------ */
window.CV = {
  awards: {
    zh: [
      ['2022–2023', '中央美术学院优秀学生奖学金'],
      ['2026', '中央美术学院优秀毕业作品奖'],
      ['2026', '第三届全国大学生美术作品展 终评入围'],
      ['2026', 'CGTN 报道 —— 中央美术学院 2026 毕业展']
    ],
    en: [
      ['2022–2023', 'Outstanding Student Scholarship, CAFA'],
      ['2026', 'Outstanding Graduation Work Award, CAFA'],
      ['2026', 'Shortlisted, final review — 3rd National Exhibition of Fine Arts for University Students'],
      ['2026', 'Featured by CGTN — CAFA 2026 Graduation Exhibition']
    ]
  },
  shows: {
    zh: [
      ['2023.04', '海洋传感器', '中央美术学院美术馆，北京'],
      ['2023.11', '艺术之桥 —— 安特卫普到北京，再回来', '安特卫普皇家艺术学院美术馆，比利时'],
      ['2024.04', '景德镇的他者', '景德镇陶瓷大学美术馆，景德镇'],
      ['2024.04', '来美术馆跳舞 —— 美术馆场域内的身体与编舞', '中央美术学院美术馆，北京'],
      ['2024.08', '裁风寻迹 —— 中央美术学院剪纸习作展', '榆阳区文化艺术中心，榆林市'],
      ['2026.06', '', '郑州八翼美术馆，郑州'],
      ['2026.07', '入口空间', '郑州']
    ],
    en: [
      ['2023.04', 'Ocean Sensor', 'CAFA Art Museum, Beijing'],
      ['2023.11', 'A Bridge of Art — Antwerp to Beijing, and Back', 'Royal Academy of Fine Arts Antwerp Museum, Belgium'],
      ['2024.04', 'The Other of Jingdezhen', 'Jingdezhen Ceramic University Art Museum, Jingdezhen'],
      ['2024.04', 'Dance in the Museum — Body and Choreography in the Museum Field', 'CAFA Art Museum, Beijing'],
      ['2024.08', 'Tracing the Wind — CAFA Papercutting Studies', 'Yuyang District Culture and Art Centre, Yulin'],
      ['2026.06', '', 'Bayi Art Museum, Zhengzhou'],
      ['2026.07', 'Entrance Space', 'Zhengzhou']
    ]
  }
};

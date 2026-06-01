import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Color Palette ──────────────────────────────────────────────
const C = {
  darkBg:       "0A1628",
  lightBg:      "F8FAFC",
  primary:      "065A82",   // deep blue
  primaryLight: "0D7490",
  teal:         "0D9488",
  tealLight:    "14B8A6",
  cardBg:       "E8F4F8",
  cardBorder:   "B8D8E8",
  white:        "FFFFFF",
  text:         "1E293B",
  muted:        "64748B",
  accent:       "F59E0B",   // amber accent for data highlights
  green:        "059669",
  red:          "DC2626",
  lineGray:     "CBD5E1",
};

const FONT_H = "Arial Black";
const FONT_B = "Calibri";

// ── Helpers ────────────────────────────────────────────────────
function makeShadow() {
  return { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.08 };
}

// Add a slide number at bottom-right
function slideNum(slide, num) {
  slide.addText(String(num), {
    x: 9.3, y: 5.3, w: 0.5, h: 0.25,
    fontSize: 8, color: C.muted, fontFace: FONT_B, align: "right",
  });
}

// Full-width page title with left accent bar
function pageTitle(slide, title, subtitle) {
  // Left accent bar
  slide.addShape("rect", { x: 0.5, y: 0.38, w: 0.06, h: 0.42, fill: { color: C.teal } });
  slide.addText(title, {
    x: 0.75, y: 0.3, w: 8.5, h: 0.5,
    fontSize: 26, fontFace: FONT_H, color: C.text, margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.75, y: 0.78, w: 8.5, h: 0.32,
      fontSize: 12, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  }
}

// ── Create Presentation ───────────────────────────────────────
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Candidate";
pres.title = "AI Infra 面试 PPT";

// ═══════════════════════════════════════════════════════════════
// SLIDE 1: Cover
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  // Decorative top-right shape
  s.addShape("rect", { x: 6.5, y: -1, w: 4.5, h: 3, fill: { color: C.primary, transparency: 60 }, rotate: 15 });
  s.addShape("rect", { x: 7, y: -0.5, w: 4, h: 2.5, fill: { color: C.teal, transparency: 50 }, rotate: 10 });

  // Thin top line
  s.addShape("rect", { x: 0.8, y: 1.55, w: 1.5, h: 0.04, fill: { color: C.teal } });

  // Main title
  s.addText("从工具到伙伴", {
    x: 0.8, y: 1.7, w: 8, h: 0.7,
    fontSize: 40, fontFace: FONT_H, color: C.white, bold: true, margin: 0,
  });
  s.addText("AI 数字人/NPC 统一基础设施\n架构设计与工程实践", {
    x: 0.8, y: 2.4, w: 8, h: 1.0,
    fontSize: 22, fontFace: FONT_B, color: "94A3B8", margin: 0, lineSpacingMultiple: 1.4,
  });

  // Separator line
  s.addShape("rect", { x: 0.8, y: 3.6, w: 2.5, h: 0.03, fill: { color: C.teal, transparency: 50 } });

  // Personal info
  s.addText([
    { text: "面向大模型时代的 AI Infra 建设与思考", options: { breakLine: true, fontSize: 14, color: C.tealLight } },
    { text: "7年分布式系统 ｜ AI推理平台0→1 ｜ 服务2.3亿用户", options: { fontSize: 11, color: "94A3B8" } },
  ], {
    x: 0.8, y: 3.8, w: 5, h: 0.8, fontFace: FONT_B, margin: 0, lineSpacingMultiple: 1.6,
  });
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 2: Personal Capability Overview
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };

  // Top value proposition banner
  s.addShape("rect", { x: 0, y: 0, w: 10, h: 1.05, fill: { color: C.primary } });
  s.addText("核心价值定位", {
    x: 0.5, y: 0.06, w: 2, h: 0.35,
    fontSize: 11, fontFace: FONT_B, color: "94A3B8", margin: 0, bold: true,
  });
  s.addText("以工程化能力驱动 AI 落地，从 0 到 1 搭建支撑亿级用户的 AI 基础设施平台", {
    x: 0.5, y: 0.42, w: 9, h: 0.5,
    fontSize: 18, fontFace: FONT_B, color: C.white, margin: 0,
  });

  // Three capability columns
  const cols = [
    { title: "架构设计", items: ["大规模推理平台架构", "多模态编排引擎设计", "全球分布式部署架构", "五层微服务体系"], icon: "▸" },
    { title: "技术管理", items: ["12人跨职能团队带领", "6个月0→1完整交付", "全流程项目管理体系", "技术选型与供应商管理"], icon: "▸" },
    { title: "业务价值", items: ["GPU利用率 28%→72%", "推理成本降低 62%", "年节省成本4300万+", "用户体验持续提升"], icon: "▸" },
  ];

  const colW = 2.8, colX = [0.6, 3.6, 6.6];
  cols.forEach((col, i) => {
    // Card background
    s.addShape("rect", {
      x: colX[i], y: 1.35, w: colW, h: 3.8,
      fill: { color: C.white }, shadow: makeShadow(),
      line: { color: C.cardBorder, width: 0.5 },
    });
    // Card header
    s.addShape("rect", {
      x: colX[i], y: 1.35, w: colW, h: 0.55,
      fill: { color: C.primary },
    });
    s.addText(col.title, {
      x: colX[i] + 0.2, y: 1.35, w: colW - 0.4, h: 0.55,
      fontSize: 15, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    // Items
    const items = col.items.map((item, j) => ({
      text: col.icon + " " + item,
      options: { bullet: false, breakLine: j < col.items.length - 1, fontSize: 12, color: C.text },
    }));
    s.addText(items, {
      x: colX[i] + 0.2, y: 2.1, w: colW - 0.4, h: 2.8,
      fontFace: FONT_B, margin: 0, paraSpaceAfter: 6, lineSpacingMultiple: 1.5,
    });
  });

  slideNum(s, 2);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 3: Project Background & Challenges
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "项目背景与核心挑战", "AI 数字人/NPC 统一基础设施 — 行业痛点与新挑战");

  // Left: Traditional NPC pain points
  s.addShape("rect", { x: 0.5, y: 1.3, w: 4.4, h: 3.7, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("传统NPC三大根本痛点", {
    x: 0.7, y: 1.4, w: 4, h: 0.4,
    fontSize: 14, fontFace: FONT_H, color: C.primary, margin: 0,
  });
  const pains = [
    { num: "01", title: "交互体验极其有限", desc: "预设对话树，无法开放式交流，任何超出预设范围的问题都得到机械回复" },
    { num: "02", title: "开发成本高昂", desc: "单个高质量NPC开发周期3-6个月，成本超百万元，难以规模化" },
    { num: "03", title: "内容固化无法更新", desc: "上线即固定，无法根据玩家行为调整，千人一面无个性化" },
  ];
  pains.forEach((p, i) => {
    s.addText(p.num, {
      x: 0.7, y: 1.95 + i * 0.95, w: 0.5, h: 0.8,
      fontSize: 24, fontFace: FONT_H, color: C.teal, margin: 0, valign: "top",
    });
    s.addText(p.title, {
      x: 1.3, y: 1.95 + i * 0.95, w: 3.4, h: 0.3,
      fontSize: 12, fontFace: FONT_H, color: C.text, margin: 0, bold: true,
    });
    s.addText(p.desc, {
      x: 1.3, y: 2.25 + i * 0.95, w: 3.4, h: 0.55,
      fontSize: 10, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  });

  // Right: New challenges after LLM
  s.addShape("rect", { x: 5.2, y: 1.3, w: 4.3, h: 3.7, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("大模型引入后的新挑战", {
    x: 5.4, y: 1.4, w: 3.9, h: 0.4,
    fontSize: 14, fontFace: FONT_H, color: C.red, margin: 0,
  });
  const challenges = [
    { icon: "⚡", title: "实时性要求极高", desc: "端到端响应需 < 300ms\n传统串行流程 > 1秒" },
    { icon: "💰", title: "推理成本高昂", desc: "单个AI NPC成本是传统\nNPC的数十倍" },
    { icon: "🎭", title: "人设一致性难保证", desc: "大模型容易忘记身份\n说出不符合角色的话" },
    { icon: "🛡️", title: "内容安全风险突出", desc: "开放式对话可能产生\n违规内容，引入合规风险" },
  ];
  challenges.forEach((ch, i) => {
    const row = Math.floor(i / 2), col = i % 2;
    const cx = 5.4 + col * 2.1, cy = 1.9 + row * 1.5;
    s.addText(ch.icon + " " + ch.title, {
      x: cx, y: cy, w: 2.0, h: 0.3,
      fontSize: 11, fontFace: FONT_H, color: C.text, margin: 0,
    });
    s.addText(ch.desc, {
      x: cx, y: cy + 0.35, w: 2.0, h: 0.65,
      fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  });

  // Key metrics sidebar (right edge)
  const metrics = [
    { num: "12人", label: "跨职能团队" },
    { num: "6个月", label: "0→1交付" },
    { num: "2.3亿", label: "覆盖玩家" },
    { num: "1200万", label: "日活用户" },
  ];
  metrics.forEach((m, i) => {
    const my = 1.35 + i * 1.05;
    s.addShape("rect", {
      x: 9.05, y: my, w: 0.08, h: 0.85,
      fill: { color: C.teal },
    });
    s.addText(m.num, {
      x: 9.2, y: my + 0.05, w: 0.7, h: 0.35,
      fontSize: 15, fontFace: FONT_H, color: C.teal, align: "center", margin: 0,
    });
    s.addText(m.label, {
      x: 9.2, y: my + 0.42, w: 0.7, h: 0.25,
      fontSize: 7, fontFace: FONT_B, color: C.muted, align: "center", margin: 0,
    });
  });

  // Bottom bar moved up to avoid overlap
  s.addShape("rect", { x: 0.5, y: 5.0, w: 9, h: 0.22, fill: { color: C.cardBg } });
  s.addText("▶ 项目定位：构建通用的、可复用的 AI 数字人基础设施平台，为公司所有游戏和端外业务提供标准化的数字人能力支撑", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.22,
    fontSize: 9, fontFace: FONT_B, color: C.primary, margin: 0, italic: true,
  });

  slideNum(s, 3);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 4: Architecture Design
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "整体架构设计", "五层微服务架构 — 平台化、模块化、可插拔");

  // Five layer boxes
  const layers = [
    { name: "接 入 层", sub: "多协议网关 · 终端适配 · 负载均衡 · 安全认证 · 流量控制", color: C.primary },
    { name: "编 排 层", sub: "数字人统一编排引擎 · 会话管理 · 状态同步 · 事件总线", color: C.teal },
    { name: "能 力 层", sub: "对话 · 语音 · 视觉 · 动作 · 记忆 · 游戏交互 · 内容安全 · 个性化 · 工具调用", color: "2563EB" },
    { name: "模 型 层", sub: "大语言模型 · 语音识别 · 语音合成 · 表情生成 · 动作生成 · 内容审核 · 向量模型", color: "7C3AED" },
    { name: "基础设施层", sub: "K8s/EKS · GPU集群 · Redis · MySQL · VecDB · Prometheus · SkyWalking", color: "4B5563" },
  ];

  const layerH = 0.7;
  const layerYStart = 1.35;
  const layerGap = 0.08;

  layers.forEach((layer, i) => {
    const y = layerYStart + i * (layerH + layerGap);
    // Layer box
    s.addShape("rect", {
      x: 0.5, y: y, w: 6.5, h: layerH,
      fill: { color: layer.color, transparency: 12 },
      line: { color: layer.color, width: 1.2 },
    });
    // Label
    s.addText(layer.name, {
      x: 0.6, y: y, w: 1.45, h: layerH,
      fontSize: 10, fontFace: FONT_H, color: layer.color, align: "center", valign: "middle", margin: 0,
    });
    // Sub description
    s.addText(layer.sub, {
      x: 2.2, y: y, w: 4.7, h: layerH,
      fontSize: 9, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0,
    });
    // Arrow between layers (except last)
    if (i < layers.length - 1) {
      s.addText("▼", {
        x: 3.6, y: y + layerH - 0.05, w: 0.5, h: layerGap + 0.1,
        fontSize: 10, color: C.lineGray, align: "center", fontFace: FONT_B, margin: 0,
      });
    }
  });

  // Right: Design philosophy cards
  const philosophies = [
    { title: "平台化 · 模块化 · 可插拔", desc: "所有数字人共享基础能力，避免重复造轮子；模块独立开发/测试/部署" },
    { title: "工程优先 · 算法赋能", desc: "优先使用成熟方案，聚焦工程化实现；通过工程手段弥补算法瓶颈" },
    { title: "业务价值导向", desc: "选择最适合而非最先进的技术；任何方案必须能提升用户体验或降低成本" },
  ];

  philosophies.forEach((p, i) => {
    const py = 1.35 + i * 1.3;
    s.addShape("rect", {
      x: 7.3, y: py, w: 2.3, h: 1.1,
      fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 },
    });
    // Top accent bar
    s.addShape("rect", { x: 7.3, y: py, w: 2.3, h: 0.04, fill: { color: C.teal } });
    s.addText(p.title, {
      x: 7.45, y: py + 0.12, w: 2.0, h: 0.3,
      fontSize: 10, fontFace: FONT_H, color: C.primary, margin: 0,
    });
    s.addText(p.desc, {
      x: 7.45, y: py + 0.42, w: 2.0, h: 0.6,
      fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  });

  slideNum(s, 4);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 5: Core Tech - Plan-Fill Orchestration
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "核心技术突破", "\"计划-填充\" 两阶段流式编排架构 — 端到端延迟从 1秒+ 降至 180ms");

  // Traditional (left) - with red X
  s.addShape("rect", { x: 0.5, y: 1.3, w: 4.3, h: 3.8, fill: { color: "FEF2F2" }, line: { color: "FECACA", width: 1 } });
  s.addText("传统串行流程", {
    x: 0.7, y: 1.4, w: 3, h: 0.35,
    fontSize: 13, fontFace: FONT_H, color: C.red, margin: 0,
  });
  const tradSteps = ["文本生成", "语音合成", "表情生成", "动作生成"];
  tradSteps.forEach((step, i) => {
    s.addShape("rect", {
      x: 1.0, y: 1.95 + i * 0.55, w: 2.5, h: 0.4,
      fill: { color: "FEE2E2" }, line: { color: C.red, width: 0.5 },
    });
    s.addText(step, {
      x: 1.0, y: 1.95 + i * 0.55, w: 2.5, h: 0.4,
      fontSize: 10, fontFace: FONT_B, color: C.red, align: "center", valign: "middle", margin: 0,
    });
    if (i < tradSteps.length - 1) {
      s.addText("↓", {
        x: 2.1, y: 2.35 + i * 0.55, w: 0.3, h: 0.2,
        fontSize: 10, color: C.red, align: "center", fontFace: FONT_B, margin: 0,
      });
    }
  });
  s.addText("端到端延迟 > 1000ms\n串行等待 · 同步性差", {
    x: 0.7, y: 4.25, w: 3.9, h: 0.7,
    fontSize: 10, fontFace: FONT_B, color: C.red, align: "center", margin: 0,
  });

  // Our solution (right) - with green check
  s.addShape("rect", { x: 5.2, y: 1.3, w: 4.3, h: 3.8, fill: { color: "ECFDF5" }, line: { color: "A7F3D0", width: 1 } });
  s.addText("我们的方案", {
    x: 5.4, y: 1.4, w: 3, h: 0.35,
    fontSize: 13, fontFace: FONT_H, color: C.green, margin: 0,
  });

  // Phase 1
  s.addShape("rect", {
    x: 5.7, y: 1.9, w: 3.4, h: 0.65,
    fill: { color: "D1FAE5" }, line: { color: C.green, width: 0.8 },
  });
  s.addText("第一阶段（0-50ms）", {
    x: 5.9, y: 1.9, w: 1.6, h: 0.25,
    fontSize: 9, fontFace: FONT_H, color: C.green, margin: 0, bold: true,
  });
  s.addText("语义计划生成 — 结构化JSON（核心内容+情感基调+表情动作需求+语音参数），仅几十token，50ms内完成", {
    x: 5.9, y: 2.15, w: 3.0, h: 0.35,
    fontSize: 8, fontFace: FONT_B, color: C.text, margin: 0,
  });

  // Arrow
  s.addText("▼ 并行执行 ▼", {
    x: 5.7, y: 2.62, w: 3.4, h: 0.2,
    fontSize: 10, fontFace: FONT_H, color: C.green, align: "center", margin: 0,
  });

  // Phase 2 - four parallel boxes
  const phase2 = ["文本生成", "语音合成", "表情生成", "动作生成"];
  const px = [5.7, 7.3, 5.7, 7.3];
  const py = [2.9, 2.9, 3.4, 3.4];
  phase2.forEach((step, i) => {
    s.addShape("rect", {
      x: px[i], y: py[i], w: 1.5, h: 0.38,
      fill: { color: C.green, transparency: 85 }, line: { color: C.green, width: 0.6 },
    });
    s.addText(step, {
      x: px[i], y: py[i], w: 1.5, h: 0.38,
      fontSize: 9, fontFace: FONT_B, color: C.green, align: "center", valign: "middle", margin: 0,
    });
  });

  // Phase 3 result
  s.addShape("rect", {
    x: 5.7, y: 3.95, w: 3.4, h: 0.5,
    fill: { color: "D1FAE5" }, line: { color: C.green, width: 0.8 },
  });
  s.addText("多模态流式同步输出", {
    x: 5.9, y: 3.95, w: 3.0, h: 0.25,
    fontSize: 10, fontFace: FONT_H, color: C.green, align: "center", margin: 0, bold: true,
  });
  s.addText("端到端延迟 < 180ms  ·  同步误差 < 40ms", {
    x: 5.9, y: 4.22, w: 3.0, h: 0.2,
    fontSize: 9, fontFace: FONT_B, color: C.text, align: "center", margin: 0,
  });

  // Bottom summary
  s.addShape("rect", { x: 0.5, y: 5.0, w: 9, h: 0.22, fill: { color: C.cardBg } });
  s.addText("核心创新：先让大模型花50ms生成结构化「语义计划」，所有模态基于同一计划并行生成 — 低延迟 + 天然同步 + 高容错", {
    x: 0.7, y: 5.0, w: 8.6, h: 0.22,
    fontSize: 9, fontFace: FONT_B, color: C.primary, margin: 0, italic: true,
  });

  slideNum(s, 5);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 6: Core Tech - Cost Optimization
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "核心技术突破", "系统性推理成本优化 — 成本降低 62%，年节省 2800 万+");

  // Four optimization dimensions - 2x2 grid
  const opts = [
    {
      title: "流式生成 + 动态批处理",
      sub: "vLLM + PagedAttention",
      metrics: ["GPU内存利用率 25%→65%", "吞吐量提升 2-3倍", "请求动态加入/离开批次"],
    },
    {
      title: "模型量化",
      sub: "AWQ 4bit + 混合精度推理",
      metrics: ["模型大小减少 75%", "推理速度提升 2倍", "关键层保持高精度"],
    },
    {
      title: "多级缓存机制",
      sub: "L1内存 → L2 Redis → L3 向量缓存",
      metrics: ["命中率：40%+25%+15%", "减少80%模型调用", "语义相似请求复用"],
    },
    {
      title: "智能模型路由",
      sub: "分级服务，最优性价比",
      metrics: ["简单请求→小模型(1.8B)", "复杂请求→大模型(7B)", "付费用户→专用实例"],
    },
  ];

  const ox = [0.5, 5.1, 0.5, 5.1];
  const oy = [1.3, 1.3, 2.95, 2.95];

  opts.forEach((opt, i) => {
    s.addShape("rect", {
      x: ox[i], y: oy[i], w: 4.4, h: 1.5,
      fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 },
    });
    // Left accent
    s.addShape("rect", { x: ox[i], y: oy[i], w: 0.06, h: 1.5, fill: { color: C.teal } });
    // Number circle
    s.addShape("oval", {
      x: ox[i] + 0.2, y: oy[i] + 0.15, w: 0.35, h: 0.35,
      fill: { color: C.teal },
    });
    s.addText(String(i + 1), {
      x: ox[i] + 0.2, y: oy[i] + 0.15, w: 0.35, h: 0.35,
      fontSize: 14, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText(opt.title, {
      x: ox[i] + 0.7, y: oy[i] + 0.15, w: 3.5, h: 0.28,
      fontSize: 13, fontFace: FONT_H, color: C.text, margin: 0,
    });
    s.addText(opt.sub, {
      x: ox[i] + 0.7, y: oy[i] + 0.45, w: 3.5, h: 0.22,
      fontSize: 9, fontFace: FONT_B, color: C.teal, margin: 0,
    });
    // Metrics (2-col layout: j0=row0col0, j1=row0col1, j2=row1col0)
    opt.metrics.forEach((m, j) => {
      const col = (j === 1) ? 1 : 0;
      const row = (j >= 2) ? 1 : 0;
      s.addText("▸ " + m, {
        x: ox[i] + 0.7 + col * 1.7, y: oy[i] + 0.78 + row * 0.28, w: 1.8, h: 0.25,
        fontSize: 9, fontFace: FONT_B, color: C.text, margin: 0,
      });
    });
  });

  // Bottom highlight
  s.addShape("rect", { x: 0.5, y: 4.55, w: 9, h: 0.45, fill: { color: C.primary } });
  s.addText("总成果", {
    x: 0.7, y: 4.55, w: 1.0, h: 0.45,
    fontSize: 13, fontFace: FONT_H, color: C.white, valign: "middle", margin: 0,
  });
  s.addText("推理成本降低62%   年节省2800万+   推理速度提升2-3倍   减少80%模型调用", {
    x: 1.8, y: 4.55, w: 7.5, h: 0.45,
    fontSize: 11, fontFace: FONT_B, color: C.white, valign: "middle", margin: 0,
  });

  slideNum(s, 6);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 7: Core Tech - Memory System
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "核心技术突破", "四层分层记忆系统 + 人设校验机制");

  // Four-layer memory diagram (left)
  const memLayers = [
    { name: "L0 人设记忆层（永久）", desc: "角色设定 · 背景故事 · 性格特征 · 说话风格 · 行为准则", color: C.primary, note: "每次对话注入 — 保证人设一致性" },
    { name: "L1 长期记忆层（月度）", desc: "用户档案 · 偏好习惯 · 重要事件 · 关系图谱 · 知识储备", color: C.teal, note: "自动提取认知 — 跨会话延续" },
    { name: "L2 中期记忆层（周度）", desc: "会话摘要 · 任务状态 · 临时信息 · 情绪状态 · 交互历史", color: "2563EB", note: "定期压缩整理 — 保留重要信息" },
    { name: "L3 短期记忆层（会话）", desc: "当前上下文 · 实时状态 · 未完成任务 · 临时变量 · 缓存", color: "7C3AED", note: "超限自动摘要 — 释放上下文空间" },
  ];

  const mlH = 0.78;
  memLayers.forEach((ml, i) => {
    const y = 1.25 + i * (mlH + 0.06);
    s.addShape("rect", {
      x: 0.5, y: y, w: 6.2, h: mlH,
      fill: { color: ml.color, transparency: 90 }, line: { color: ml.color, width: 0.8 },
    });
    s.addText(ml.name, {
      x: 0.65, y: y + 0.05, w: 5.9, h: 0.28,
      fontSize: 11, fontFace: FONT_H, color: ml.color, margin: 0,
    });
    s.addText(ml.desc, {
      x: 0.65, y: y + 0.33, w: 4.2, h: 0.22,
      fontSize: 9, fontFace: FONT_B, color: C.text, margin: 0,
    });
    s.addText(ml.note, {
      x: 4.8, y: y + 0.33, w: 1.8, h: 0.22,
      fontSize: 8, fontFace: FONT_B, color: ml.color, margin: 0, italic: true,
    });
    // Arrow
    if (i < memLayers.length - 1) {
      s.addText("▲", {
        x: 3.3, y: y + mlH - 0.05, w: 0.5, h: 0.18,
        fontSize: 10, color: C.lineGray, align: "center", fontFace: FONT_B, margin: 0,
      });
    }
  });

  // Right: Persona verification mechanism
  s.addShape("rect", { x: 7.0, y: 1.25, w: 2.6, h: 3.35, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("人设校验机制", {
    x: 7.15, y: 1.35, w: 2.3, h: 0.35,
    fontSize: 12, fontFace: FONT_H, color: C.primary, margin: 0,
  });

  // Flow: AI生成 → 校验模型 → 通过→输出 / 不通过→重新生成
  s.addShape("rect", { x: 7.3, y: 1.85, w: 2.0, h: 0.45, fill: { color: C.cardBg } });
  s.addText("AI 生成回复", {
    x: 7.3, y: 1.85, w: 2.0, h: 0.45,
    fontSize: 10, fontFace: FONT_B, color: C.text, align: "center", valign: "middle", margin: 0,
  });
  s.addText("↓", { x: 8.2, y: 2.32, w: 0.2, h: 0.2, fontSize: 14, color: C.muted, align: "center", margin: 0 });

  s.addShape("rect", { x: 7.3, y: 2.55, w: 2.0, h: 0.45, fill: { color: C.teal, transparency: 85 }, line: { color: C.teal, width: 0.8 } });
  s.addText("人设校验模型", {
    x: 7.3, y: 2.55, w: 2.0, h: 0.45,
    fontSize: 10, fontFace: FONT_B, color: C.teal, align: "center", valign: "middle", margin: 0,
  });

  // Two branches
  s.addText("✓ 通过", { x: 7.1, y: 3.15, w: 0.7, h: 0.25, fontSize: 9, fontFace: FONT_H, color: C.green, align: "center", margin: 0 });
  s.addText("✗ 不通过", { x: 8.45, y: 3.15, w: 0.7, h: 0.25, fontSize: 9, fontFace: FONT_H, color: C.red, align: "center", margin: 0 });

  s.addShape("rect", { x: 6.9, y: 3.45, w: 1.0, h: 0.38, fill: { color: C.green, transparency: 88 } });
  s.addText("正常输出", {
    x: 6.9, y: 3.45, w: 1.0, h: 0.38,
    fontSize: 9, fontFace: FONT_B, color: C.green, align: "center", valign: "middle", margin: 0,
  });
  s.addShape("rect", { x: 8.35, y: 3.45, w: 1.0, h: 0.38, fill: { color: C.red, transparency: 90 } });
  s.addText("重新生成 / 兜底", {
    x: 8.35, y: 3.45, w: 1.0, h: 0.38,
    fontSize: 8, fontFace: FONT_B, color: C.red, align: "center", valign: "middle", margin: 0,
  });

  // Arrow back
  s.addText("⟲ 重新生成", {
    x: 8.35, y: 3.9, w: 1.0, h: 0.2,
    fontSize: 8, fontFace: FONT_B, color: C.muted, align: "center", margin: 0, italic: true,
  });

  // Bottom summary
  s.addShape("rect", { x: 0.5, y: 4.55, w: 9, h: 0.6, fill: { color: C.cardBg } });
  s.addText([
    { text: "设计理念：模拟人类记忆 — ", options: { bold: true, fontSize: 9, color: C.primary } },
    { text: "永久不变的\"我是谁\" → 长期\"我对你的了解\" → 近期\"发生的事\" → 当前\"在聊什么\"。", options: { fontSize: 9, color: C.text, breakLine: true } },
    { text: "人设校验：", options: { bold: true, fontSize: 9, color: C.primary } },
    { text: "每次输出前用小模型做人设审查，不符合就打回去重来，确保 NPC 永远是\"它自己\"。", options: { fontSize: 9, color: C.text } },
  ], {
    x: 0.7, y: 4.6, w: 8.6, h: 0.5, fontFace: FONT_B, margin: 0,
  });

  slideNum(s, 7);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 8: Global Deployment & Ops
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "全球部署与运维体系", "8 区域中心 + 弹性伸缩 + 全链路可观测 + 灰度 A/B");

  // Section 1: Global deployment
  s.addShape("rect", { x: 0.5, y: 1.3, w: 4.4, h: 1.9, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("全球分布式部署", {
    x: 0.65, y: 1.4, w: 3, h: 0.3,
    fontSize: 13, fontFace: FONT_H, color: C.primary, margin: 0,
  });
  const regions = [
    ["中国", "新加坡", "日本", "美国"],
    ["德国", "巴西", "印度", "俄罗斯"],
  ];
  regions.forEach((row, ri) => {
    row.forEach((r, ci) => {
      s.addShape("rect", {
        x: 0.65 + ci * 1.1, y: 1.8 + ri * 0.5, w: 1.0, h: 0.4,
        fill: { color: C.cardBg }, line: { color: C.teal, width: 0.5 },
      });
      s.addText(r, {
        x: 0.65 + ci * 1.1, y: 1.8 + ri * 0.5, w: 1.0, h: 0.4,
        fontSize: 9, fontFace: FONT_B, color: C.text, align: "center", valign: "middle", margin: 0,
      });
    });
  });
  s.addText("各中心独立计算+存储+网络，专线互联，自动故障转移", {
    x: 0.65, y: 2.85, w: 4.1, h: 0.2,
    fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0, italic: true,
  });

  // Section 2: Elastic Scaling
  s.addShape("rect", { x: 5.2, y: 1.3, w: 4.3, h: 1.9, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("弹性伸缩体系", {
    x: 5.35, y: 1.4, w: 3, h: 0.3,
    fontSize: 13, fontFace: FONT_H, color: C.primary, margin: 0,
  });
  const scales = [
    { level: "日常伸缩", desc: "基于历史流量预测，提前扩缩容" },
    { level: "突发伸缩", desc: "流量突然激增时，快速扩容应对" },
    { level: "紧急伸缩", desc: "系统负载超阈值，紧急扩容+降级" },
  ];
  scales.forEach((sc, i) => {
    s.addText("▸ " + sc.level + "：", {
      x: 5.35, y: 1.82 + i * 0.42, w: 1.2, h: 0.22,
      fontSize: 10, fontFace: FONT_H, color: C.text, margin: 0,
    });
    s.addText(sc.desc, {
      x: 6.55, y: 1.82 + i * 0.42, w: 2.8, h: 0.22,
      fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  });
  s.addText("基于K8s HPA · CPU/GPU/延迟/队列多指标动态调整", {
    x: 5.35, y: 3.0, w: 4.0, h: 0.15,
    fontSize: 8, fontFace: FONT_B, color: C.muted, margin: 0, italic: true,
  });

  // Section 3: Full-link observability
  s.addShape("rect", { x: 0.5, y: 3.45, w: 4.4, h: 1.7, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("全链路可观测性", {
    x: 0.65, y: 3.55, w: 3, h: 0.3,
    fontSize: 13, fontFace: FONT_H, color: C.primary, margin: 0,
  });
  const obsItems = [
    { icon: "📊", name: "指标监控", desc: "Prometheus+Grafana · 业务/性能/资源指标 · 告警规则" },
    { icon: "📝", name: "日志分析", desc: "腾讯云CLS · 全量日志采集 · TraceID跨服务关联" },
    { icon: "🔗", name: "链路追踪", desc: "SkyWalking分布式追踪 · 每个请求唯一TraceID" },
  ];
  obsItems.forEach((item, i) => {
    s.addText(item.icon + " " + item.name, {
      x: 0.65, y: 3.95 + i * 0.37, w: 1.5, h: 0.22,
      fontSize: 9, fontFace: FONT_H, color: C.text, margin: 0,
    });
    s.addText(item.desc, {
      x: 2.15, y: 3.95 + i * 0.37, w: 2.6, h: 0.22,
      fontSize: 9, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  });

  // Section 4: Grayscale & A/B
  s.addShape("rect", { x: 5.2, y: 3.45, w: 4.3, h: 1.7, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("灰度发布 & A/B 测试", {
    x: 5.35, y: 3.55, w: 3, h: 0.3,
    fontSize: 13, fontFace: FONT_H, color: C.primary, margin: 0,
  });
  const phases = [
    "① 开发测试环境验证",
    "② 内部员工灰度使用",
    "③ 1%用户小流量验证",
    "④ 逐步扩大至全量上线",
  ];
  phases.forEach((ph, i) => {
    s.addText(ph, {
      x: 5.55, y: 3.95 + i * 0.3, w: 3.8, h: 0.25,
      fontSize: 10, fontFace: FONT_B, color: i < 2 ? C.muted : C.text, margin: 0,
    });
  });

  slideNum(s, 8);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 9: Quantitative Results
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "量化成果与业务价值", "用数据证明 — AI 数字人不只是噱头");

  // Left: Business results
  s.addShape("rect", { x: 0.5, y: 1.3, w: 4.4, h: 3.9, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("业务成果", {
    x: 0.65, y: 1.4, w: 3, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.teal, margin: 0,
  });
  const bizResults = [
    { metric: "2.3亿", label: "覆盖全球玩家" },
    { metric: "1200万+", label: "日活用户" },
    { metric: "1.2→7.8轮", label: "平均对话轮次" },
    { metric: "3.2→4.6分", label: "用户满意度（5分制）" },
    { metric: "18%", label: "次日留存率提升" },
    { metric: "12%", label: "7日留存率提升" },
    { metric: "12%", label: "付费转化率提升" },
  ];
  bizResults.forEach((r, i) => {
    const ry = 1.9 + i * 0.45;
    s.addText(r.metric, {
      x: 0.8, y: ry, w: 1.3, h: 0.35,
      fontSize: 16, fontFace: FONT_H, color: C.teal, margin: 0,
    });
    s.addText(r.label, {
      x: 2.2, y: ry, w: 2.5, h: 0.35,
      fontSize: 11, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0,
    });
  });

  // Right: Technical results
  s.addShape("rect", { x: 5.2, y: 1.3, w: 4.3, h: 3.9, fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 } });
  s.addText("技术成果", {
    x: 5.35, y: 1.4, w: 3, h: 0.35,
    fontSize: 15, fontFace: FONT_H, color: C.primary, margin: 0,
  });
  const techResults = [
    { metric: "180ms", label: "端到端延迟（1000ms+→）" },
    { metric: "25%→65%", label: "GPU内存利用率" },
    { metric: "62%", label: "推理成本降低" },
    { metric: "85%", label: "开发效率提升" },
    { metric: "1500万+", label: "年节省研发成本" },
    { metric: "2800万+", label: "年节省云资源成本" },
    { metric: "99.97%", label: "违规内容拦截率" },
  ];
  techResults.forEach((r, i) => {
    const ry = 1.9 + i * 0.45;
    s.addText(r.metric, {
      x: 5.5, y: ry, w: 1.5, h: 0.35,
      fontSize: 16, fontFace: FONT_H, color: C.primary, margin: 0,
    });
    s.addText(r.label, {
      x: 7.1, y: ry, w: 2.2, h: 0.35,
      fontSize: 11, fontFace: FONT_B, color: C.text, valign: "middle", margin: 0,
    });
  });

  // Bottom quote
  s.addShape("rect", { x: 0.5, y: 5.1, w: 9, h: 0.18, fill: { color: C.cardBg } });
  s.addText("\"每个数字都有对应的技术故事支撑 — 成本降低62%对应四维优化体系，延迟180ms对应'计划-填充'编排架构\"", {
    x: 0.7, y: 5.1, w: 8.6, h: 0.18,
    fontSize: 8, fontFace: FONT_B, color: C.muted, margin: 0, italic: true, align: "center",
  });

  slideNum(s, 9);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 10: Lessons Learned
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "经验教训与核心认知", "从 0 到 1 的关键反思 — 比技术成果更有价值的是认知升级");

  const lessons = [
    {
      num: "01",
      title: "工程化能力是AI项目成功的关键",
      desc: "算法模型只是AI项目的一部分，更重要的是如何转化为稳定、高效、可扩展的产品。这也是非算法出身的AI Infra负责人的核心价值所在。",
    },
    {
      num: "02",
      title: "业务理解比技术能力更重要",
      desc: "项目开始前花大量时间与策划、运营、玩家交流，深入理解需求。技术方案必须服务于业务问题，否则再先进也无法创造价值。",
    },
    {
      num: "03",
      title: "渐进式迭代优于完美主义",
      desc: "AI技术发展极快，等什么都成熟了再动就晚了。先上核心功能，根据反馈快速迭代。MVP思维在AI项目上比传统项目更重要。",
    },
    {
      num: "04",
      title: "跨团队协作是项目成功的保障",
      desc: "后端、算法、客户端、产品、运营、安全 — 六个团队密切配合。建立高效协作机制和清晰接口定义至关重要。12人跨职能团队，6个月完成从0到1。",
    },
  ];

  lessons.forEach((l, i) => {
    const y = 1.3 + i * 0.92;
    s.addShape("rect", {
      x: 0.5, y: y, w: 9, h: 0.78,
      fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 },
    });
    // Left accent + number
    s.addShape("rect", { x: 0.5, y: y, w: 0.06, h: 0.78, fill: { color: i === 0 ? C.teal : C.primary } });
    s.addText(l.num, {
      x: 0.7, y: y, w: 0.55, h: 0.78,
      fontSize: 20, fontFace: FONT_H, color: i === 0 ? C.teal : C.primary, valign: "middle", margin: 0,
    });
    s.addText(l.title, {
      x: 1.3, y: y + 0.06, w: 8, h: 0.28,
      fontSize: 12, fontFace: FONT_H, color: C.text, margin: 0,
    });
    s.addText(l.desc, {
      x: 1.3, y: y + 0.36, w: 8, h: 0.36,
      fontSize: 10, fontFace: FONT_B, color: C.muted, margin: 0,
    });
  });

  slideNum(s, 10);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 11: Core Competitiveness & Future Planning
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.lightBg };
  pageTitle(s, "核心竞争力与未来规划", "我不是来做工程师的，我是来做 AI Infra 负责人的");

  // Top: Core competitiveness - 4 cards
  const comps = [
    { title: "技术深度", desc: "全栈AI Infra能力\n推理平台架构\n多模态编排引擎" },
    { title: "管理能力", desc: "12人跨职能团队\n6个月0→1交付\n全流程项目管理" },
    { title: "业务能力", desc: "深度理解游戏场景\n年节省4300万+\n技术直接创造商业价值" },
    { title: "战略能力", desc: "行业趋势判断\n技术路线图制定\n0→1方法论沉淀" },
  ];
  const cx = [0.5, 2.85, 5.2, 7.55];
  comps.forEach((c, i) => {
    s.addShape("rect", {
      x: cx[i], y: 1.35, w: 2.2, h: 1.7,
      fill: { color: C.white }, shadow: makeShadow(), line: { color: C.cardBorder, width: 0.5 },
    });
    s.addShape("rect", { x: cx[i], y: 1.35, w: 2.2, h: 0.45, fill: { color: i === 0 ? C.teal : C.primary } });
    s.addText(c.title, {
      x: cx[i], y: 1.35, w: 2.2, h: 0.45,
      fontSize: 13, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
    });
    s.addText(c.desc, {
      x: cx[i] + 0.15, y: 1.95, w: 1.9, h: 0.95,
      fontSize: 10, fontFace: FONT_B, color: C.text, margin: 0,
    });
  });

  // Bottom: Three-stage plan
  s.addText("三阶段规划框架", {
    x: 0.5, y: 3.3, w: 3, h: 0.35,
    fontSize: 14, fontFace: FONT_H, color: C.primary, margin: 0,
  });

  const stages = [
    { period: "阶段一：0-6月", title: "全面评估 + 夯实基础", items: "全面评估现有AI基础设施 · 解决最紧急的性能和稳定性问题 · 建立基础监控和运维体系" },
    { period: "阶段二：6-18月", title: "平台化建设 + 能力提升", items: "构建统一推理平台 · 优化资源调度和成本管控 · 提升AI研发效率 · 降低整体AI成本" },
    { period: "阶段三：18-36月", title: "智能化演进 + 战略支撑", items: "探索智能化运维 · 支撑更大规模应用 · 打造行业领先的AI Infra能力" },
  ];

  stages.forEach((st, i) => {
    const sy = 3.65 + i * 0.48;
    s.addShape("rect", {
      x: 0.5, y: sy, w: 9, h: 0.42,
      fill: { color: C.white }, line: { color: C.cardBorder, width: 0.5 },
    });
    // Color bar
    s.addShape("rect", { x: 0.5, y: sy, w: 0.06, h: 0.42, fill: { color: i === 0 ? C.green : i === 1 ? C.primary : C.teal } });
    s.addText(st.period, {
      x: 0.75, y: sy, w: 1.5, h: 0.42,
      fontSize: 9, fontFace: FONT_H, color: i === 0 ? C.green : i === 1 ? C.primary : C.teal, valign: "middle", margin: 0,
    });
    s.addText(st.title, {
      x: 2.3, y: sy, w: 1.8, h: 0.42,
      fontSize: 9, fontFace: FONT_H, color: C.text, valign: "middle", margin: 0,
    });
    s.addText(st.items, {
      x: 4.1, y: sy, w: 5.2, h: 0.42,
      fontSize: 8, fontFace: FONT_B, color: C.muted, valign: "middle", margin: 0,
    });
  });

  s.addText("※ 针对不同公司，规划内容需根据对方业务和AI战略进行定制", {
    x: 0.5, y: 5.08, w: 9, h: 0.15,
    fontSize: 8, fontFace: FONT_B, color: C.muted, margin: 0, italic: true, align: "center",
  });

  slideNum(s, 11);
}

// ═══════════════════════════════════════════════════════════════
// SLIDE 12: Thank You & Q&A
// ═══════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  // Decorative shapes
  s.addShape("rect", { x: -1, y: -1, w: 4, h: 3, fill: { color: C.primary, transparency: 70 }, rotate: 20 });
  s.addShape("rect", { x: 7.5, y: 4, w: 4.5, h: 2.5, fill: { color: C.teal, transparency: 60 }, rotate: -15 });

  s.addText("感谢聆听", {
    x: 0, y: 1.5, w: 10, h: 0.9,
    fontSize: 44, fontFace: FONT_H, color: C.white, align: "center", valign: "middle", margin: 0,
  });
  s.addText("欢迎提问", {
    x: 0, y: 2.4, w: 10, h: 0.5,
    fontSize: 18, fontFace: FONT_B, color: "94A3B8", align: "center", margin: 0,
  });

  // Separator
  s.addShape("rect", { x: 3.5, y: 3.1, w: 3, h: 0.03, fill: { color: C.teal, transparency: 40 } });

  s.addText("我是一名以工程化能力推动 AI 落地的 AI Infra 建设者", {
    x: 0, y: 3.4, w: 10, h: 0.4,
    fontSize: 13, fontFace: FONT_B, color: C.tealLight, align: "center", margin: 0, italic: true,
  });

  // Contact info
  s.addText("姓名 ｜ 邮箱 ｜ 电话/微信", {
    x: 0, y: 4.2, w: 10, h: 0.3,
    fontSize: 12, fontFace: FONT_B, color: "94A3B8", align: "center", margin: 0,
  });
}

// ── Save ─────────────────────────────────────────────────────
const outPath = path.join(__dirname, "..", "AI数字人-面试PPT.pptx");
await pres.writeFile({ fileName: outPath });
console.log("PPT generated: " + outPath);

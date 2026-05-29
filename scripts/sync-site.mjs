/**
 * 从 docs 生成 web/src/data/site.json（L1 个人信息 + L2 产业 + L3 技术方案/项目）
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderIndexHtml } from './render-html.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(root, 'docs');
const industriesRoot = path.join(docsRoot, '行业解决方案');
const personalPath = path.join(docsRoot, '个人信息.md');
const outputPath = path.join(root, 'web/data/site.json');
const htmlPath = path.join(root, 'web/index.html');

const INDUSTRY_CONFIG = [
  {
    id: 'gaming',
    dir: '游戏与互动娱乐',
    shortName: '游戏',
    featured: true,
    cardSummary: '游戏 AI NPC、海外多语言、玩法融合',
  },
  {
    id: 'virtual-human',
    dir: '虚拟人与数字内容',
    shortName: '虚拟人',
    featured: true,
    cardSummary: '数字人、直播、对话式 AI、IP 运营',
  },
  {
    id: 'ecommerce',
    dir: '电商与消费科技',
    shortName: '电商',
    featured: true,
    cardSummary: '交易中台、高净值运营、消费 IoT',
  },
  {
    id: 'platform',
    dir: '互联网平台建设与研效',
    shortName: '技术底座',
    featured: false,
    cardSummary: '微服务、云原生、研效、可观测',
  },
];

function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.+)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function parseFeaturedProjects(md) {
  const block = md.match(/## 精选技术案例[\s\S]*?(?=\n## |$)/)?.[0] ?? '';
  const projects = [];
  for (const line of block.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (!linkMatch || linkMatch[1] === '案例') continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    const rel = linkMatch[2].replace(/^\.\.\//, '');
    projects.push({
      title: stripMd(linkMatch[1]),
      docPath: `docs/${rel}`.replace(/\\/g, '/'),
      industry: stripMd(cells[1] ?? ''),
      highlight: stripMd(cells[2] ?? ''),
    });
  }
  return projects;
}

function stripMd(text) {
  return (text ?? '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/→\s*项目 STAR.*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function parseTableRows(block) {
  const rows = [];
  for (const line of block.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2 || cells[0].includes('---') || cells[0] === '类型' || cells[0] === '阶段')
      continue;
    if (['项目', '领域', '挑战', '能力域', '层次', '指标'].includes(cells[0])) continue;
    rows.push(cells.map(stripMd));
  }
  return rows;
}

function sectionByNumber(md, num) {
  const re = new RegExp(`## ${num}\\. [^\\n]+([\\s\\S]*?)(?=\\n## |$)`);
  return md.match(re)?.[1]?.trim() ?? '';
}

function bullets(block) {
  return block
    .split('\n')
    .filter((l) => /^[-*]\s/.test(l.trim()) || /^\d+\.\s/.test(l.trim()))
    .map((l) => stripMd(l.replace(/^[-*\d.]+\s+/, '')));
}

function firstParagraph(block, max = 320) {
  const lines = block.split('\n').map((l) => l.trim());
  const para = [];
  for (const line of lines) {
    if (!line || line.startsWith('#') || line.startsWith('|') || line.startsWith('```') || line.startsWith('>'))
      continue;
    if (line.startsWith('-') || line.startsWith('*')) break;
    para.push(line);
  }
  const text = stripMd(para.join(' '));
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function listMdFiles(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listMdFiles(full, base));
    else if (ent.name.endsWith('.md') && ent.name !== 'README.md') {
      out.push({
        filePath: full,
        relPath: path.relative(base, full).replace(/\\/g, '/'),
        title: stripMd(readText(full).match(/^#\s+(.+)/m)?.[1] ?? ent.name.replace(/\.md$/, '')),
      });
    }
  }
  return out;
}

function parseProjectMd(filePath, industryDir, relPath) {
  const md = readText(filePath);
  const fm = parseFrontmatter(md);
  const title = stripMd(md.match(/^#\s+(.+)/m)?.[1] ?? '');
  const meta = md.match(/\*\*角色[：:]\*\*\s*([^·]+)(?:·\s*\*\*周期[：:]\*\*\s*(.+))?/);
  const showcase = stripMd(
    md.match(/## 展示摘要\s*\n+([\s\S]*?)(?=\n## |\n---|$)/)?.[1]?.trim() ?? '',
  );
  const oneLiner = stripMd(
    showcase ||
      (md.match(/## 一句话\s*\n+([\s\S]*?)(?=\n## |\n---|$)/)?.[1]?.trim() ??
        firstParagraph(md.split('\n').slice(1).join('\n'), 200)),
  );
  const tags = stripMd(md.match(/## 技术栈\s*\n+([\s\S]*?)(?=\n## |$)/)?.[1] ?? '')
    .split(/[、,·]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && t.length < 24)
    .slice(0, 6);
  return {
    id: relPath.replace(/\.md$/, '').replace(/[/\\]/g, '-'),
    title,
    role: meta?.[1]?.trim() ?? '',
    period: meta?.[2]?.trim() ?? '',
    oneLiner,
    docPath: `docs/行业解决方案/${industryDir}/项目经验/${relPath}`.replace(/\\/g, '/'),
    tags,
    featured: fm.featured === 'true',
    hero: fm.hero === 'true',
  };
}

function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    const score = (p) => (p.hero ? 2 : 0) + (p.featured ? 1 : 0);
    const d = score(b) - score(a);
    if (d !== 0) return d;
    return (b.period || '').localeCompare(a.period || '');
  });
}

function parseTechMd(filePath, industryDir, relPath) {
  const md = readText(filePath);
  const title = stripMd(md.match(/^#\s+(.+)/m)?.[1] ?? '');
  const summary = firstParagraph(md.replace(/^#[^\n]+\n+/, ''), 240);
  return {
    id: relPath.replace(/\.md$/, '').replace(/[/\\]/g, '-'),
    title,
    summary,
    docPath: `docs/行业解决方案/${industryDir}/技术方案/${relPath}`.replace(/\\/g, '/'),
  };
}

function parseCrossLinks(md) {
  const block = md.match(/\*\*关联行业[：:]\*\*([\s\S]*?)(?=\n\n|$)/)?.[1] ?? '';
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const name = stripMd(m[1]);
    let industryId = null;
    if (m[2].includes('虚拟人')) industryId = 'virtual-human';
    else if (m[2].includes('游戏')) industryId = 'gaming';
    else if (m[2].includes('电商')) industryId = 'ecommerce';
    else if (m[2].includes('互联网')) industryId = 'platform';
    links.push({ name, industryId });
  }
  return links;
}

function parseIndustry(industryDir, config) {
  const base = path.join(industriesRoot, industryDir);
  const mdPath = path.join(base, '行业解决方案.md');
  const md = fs.existsSync(mdPath) ? readText(mdPath) : '';

  const name = stripMd(md.match(/^#\s+(.+)/m)?.[1] ?? config.dir) || config.dir;
  const quotes = [...md.matchAll(/^>\s*(.+)/gm)].map((m) => stripMd(m[1]));
  const overview =
    quotes.find((q) => !q.startsWith('层级说明') && !q.startsWith('L1') && q.length > 20) ??
    config.cardSummary;

  const sec1 = sectionByNumber(md, 1);
  const sec2 = sectionByNumber(md, 2);
  const sec3 = sectionByNumber(md, 3);
  const sec4 = sectionByNumber(md, 4);

  const problems = [...bullets(sec2)];
  for (const row of parseTableRows(sec2)) {
    if (row.length >= 2) problems.push(`${row[0]}：${row[1]}`);
  }

  const capabilityRows = parseTableRows(sec4);
  const capabilityMap = capabilityRows.map((row) => ({
    domain: row[0] ?? '',
    points: row[1] ?? '',
    results: row[2] ?? row[1] ?? '',
  }));

  const principles = bullets(sec3).filter((b) => b.length < 120).slice(0, 6);

  const techDir = path.join(base, '技术方案');
  const projDir = path.join(base, '项目经验');
  const techSolutions = listMdFiles(techDir, techDir).map((f) =>
    parseTechMd(f.filePath, industryDir, f.relPath),
  );
  const projects = sortProjects(
    listMdFiles(projDir, projDir).map((f) => parseProjectMd(f.filePath, industryDir, f.relPath)),
  );

  return {
    id: config.id,
    name,
    shortName: config.shortName,
    featured: config.featured,
    cardSummary: config.cardSummary,
    overview,
    landscape: firstParagraph(sec1, 400),
    problems: problems.slice(0, 8),
    frameworkSummary: firstParagraph(sec3, 360),
    principles,
    capabilityMap,
    crossLinks: parseCrossLinks(md),
    techSolutions,
    projects,
    docPath: `docs/行业解决方案/${industryDir}/行业解决方案.md`,
  };
}

// --- L1: 个人信息 ---
const md = readText(personalPath);

function parseTable(block) {
  const rows = {};
  for (const line of block.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2 || cells[0].includes('---') || cells[0] === '项目') continue;
    rows[cells[0].replace(/\*\*/g, '')] = cells[1].replace(/\*\*/g, '');
  }
  return rows;
}

function mdSection(name) {
  const re = new RegExp(`## ${name}[\\s\\S]*?(?=\\n## |$)`);
  return md.match(re)?.[0] ?? '';
}

const basicSec = mdSection('基本信息');
const basic = parseTable(basicSec);
const taglineBlock = basicSec.match(/### 职业标签[\s\S]*?(?=---|\n## )/)?.[0] ?? '';
const tagline =
  taglineBlock
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#')) ?? '';

const showcaseSec = md.match(/## 对外技术展示\s*\n+([\s\S]*?)(?=\n## |$)/)?.[1] ?? '';
const showcaseIntro = firstParagraph(showcaseSec, 480);
const featuredProjects = parseFeaturedProjects(md);

const coreSec = mdSection('核心优势');
const intentSec = mdSection('求职意向');
const intentTable = parseTable(intentSec);
const focusMatch = intentSec.match(/\*\*统一定位：\*\*\s*(.+)/);

const metricsSec = md.match(/### 量化成果[\s\S]*?(?=\n---|\n## |$)/)?.[0] ?? '';
const metrics = [];
for (const row of parseTableRows(metricsSec)) {
  if (row.length >= 2 && row[0] !== '领域') metrics.push({ label: row[0], value: row[1] });
}

const eduSec = mdSection('教育背景');
const honorsSec = mdSection('荣誉与奖项');
const eduTable = parseTable(eduSec);

const skillSec = mdSection('技术能力');
const skills = [];
for (const block of skillSec.split(/### /).slice(1)) {
  const title = block.split('\n')[0].trim();
  if (title === '量化成果') break;
  const items = bullets(block);
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('|') && !l.startsWith('#') && !/^[-*]/.test(l))
    .map(stripMd)
    .filter((l) => l !== title);
  const merged = items.length ? items.map(stripMd).filter((l) => l !== title) : lines;
  if (merged.length) skills.push({ category: title, items: merged });
}

const workSec = mdSection('工作经历');
const experience = [];
for (const block of workSec.split(/### /).slice(1)) {
  const company = block.split('\n')[0].trim();
  const table = parseTable(block);
  const allBullets = bullets(block).map(stripMd);
  experience.push({
    company,
    role: table['职位'] ?? '',
    period: (table['时间'] ?? '').replace(/–|—/g, ' — '),
    department: table['部门'] ?? '',
    summary: stripMd(
      block.match(/\*\*核心职责[：:]\*\*\s*(.+)/)?.[1] ?? allBullets[0] ?? '',
    ),
    achievements: allBullets.slice(0, 6),
  });
}

const l1 = {
  profile: {
    name: basic['姓名'] ?? '周金成',
    nameEn: 'Jayce Zhou',
    title: (basic['职位'] ?? '').trim(),
    company: '腾讯 · IEG 用户平台部',
    location: '深圳',
    years: (basic['工作年限'] ?? '').replace(/（.*?）/g, '').trim(),
    email: basic['邮箱'] ?? '',
    emailAlt: basic['Gmail'] ?? '',
    phone: basic['手机/微信'] ?? '',
  },
  tagline: stripMd(tagline),
  summary: stripMd(firstParagraph(coreSec.replace(/## 核心优势\s*/, ''))),
  highlights: bullets(coreSec).map(stripMd).slice(0, 6),
  metrics: metrics.slice(0, 6),
  showcaseIntro: showcaseIntro || undefined,
  featuredProjects,
  intents: {
    roles: (intentTable['目标职位'] ?? '').split(/[/、]/).map((s) => s.trim()).filter(Boolean),
    location: intentTable['工作地点'] ?? '深圳优先',
    status: intentTable['状态'] ?? '可商议',
    focus: stripMd(focusMatch?.[1] ?? ''),
  },
  experience,
  skills: skills.slice(0, 7),
  education: {
    school: '北京理工大学（珠海）',
    major: '计算机科学与技术',
    degree: basic['学历'] ?? '本科 · 工学学士',
    period: '2010 — 2014',
    honors: bullets(honorsSec).map(stripMd).filter(Boolean),
    activities: (eduTable['职务'] ?? '').split('；').map((s) => s.trim()).filter(Boolean),
  },
};

const industries = INDUSTRY_CONFIG.map((c) => parseIndustry(c.dir, c));
const featuredIds = industries.filter((i) => i.featured).map((i) => i.id);
const platform = industries.find((i) => i.id === 'platform');

const site = {
  schemaVersion: 2,
  readingPath: ['个人信息', '产业行业方案', '技术方案', '项目经验'],
  l1,
  l2: {
    featuredIds,
    industries,
    platform,
  },
  _meta: {
    generatedAt: new Date().toISOString(),
    sources: ['docs/个人信息.md', 'docs/行业解决方案/*/行业解决方案.md', '技术方案/', '项目经验/'],
  },
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(site, null, 2) + '\n', 'utf-8');
fs.writeFileSync(htmlPath, renderIndexHtml(site), 'utf-8');

const projCount = industries.reduce((n, i) => n + i.projects.length, 0);
const techCount = industries.reduce((n, i) => n + i.techSolutions.length, 0);
console.log(`✓ ${path.relative(root, outputPath)}`);
console.log(`✓ ${path.relative(root, htmlPath)}`);
console.log(`  L1 个人信息 · L2 产业 ${industries.length} · L3 技术方案 ${techCount} · 项目 ${projCount}`);

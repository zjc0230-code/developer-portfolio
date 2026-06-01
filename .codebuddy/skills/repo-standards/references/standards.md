# Repository Governance Standards

> Machine-readable version of `docs/维护指南.md` and `docs/技术展示标准.md`.
> This file is the canonical reference for CodeBuddy when making changes to this repository.
> Update this file whenever conventions change, and keep it in sync with the human-facing docs.

---

## Directory Contract

```
docs/
├── 个人信息.md                 # L1 - Single entry point
├── 能力全景图.md               # Cross-industry index (optional reading)
├── 改进建议.md                 # Roadmap / backlog
├── 维护指南.md                 # Maintenance guide (this file's human counterpart)
├── 展示内容路线图.md            # Content roadmap
├── 技术展示标准.md              # Content quality standards
├── 原始资料/                   # Raw reference materials (new)
├── _templates/                 # Copy-able templates
├── 行业解决方案/<产业>/
│   ├── README.md               # Industry index
│   ├── 行业解决方案.md          # L2 - Macro industry analysis (REQUIRED)
│   ├── 技术方案/                # L2+ - Technical deep-dives (recommended)
│   └── 项目经验/                # L3 - Project cases (REQUIRED)
├── 博客/
└── 内部资料/                   # Not public by default
```

## Content Creation Rules

| Operation | Rule |
|-----------|------|
| New industry | Copy `_templates/产业目录说明.md`, create all four layer files |
| New project | Add only under corresponding industry `项目经验/`; link to L2/L2+ at top |
| New architecture article | Place in `技术方案/`, mark `level: L2+` at top |
| Duplicate content | Industry doc writes methodology, tech doc writes implementation, project writes STAR; NO full-text copy across three places |
| Raw materials | Store in `docs/原始资料/` with descriptive subdirectories |

## Link Conventions

- Industry directory names: **Chinese full name**, matching folder name
- Relative paths: Within same industry use `../行业解决方案.md`; cross-industry use `../../<industry>/...`
- Attachments: Large images/PDFs go in `项目经验/<project>/assets/`, register in README

## Frontmatter Convention (optional, for sync)

```yaml
---
level: L3
industry: 游戏与互动娱乐
role: 技术负责人
period: 2024-07/2024-11
company: 腾讯
status: stable
---
```

## Current Industries

1. `互联网平台建设与研效` — Platform engineering & R&D efficiency
2. `游戏与互动娱乐` — Gaming & interactive entertainment
3. `电商与消费科技` — E-commerce & consumer tech
4. `虚拟人与数字内容` — Virtual beings & digital content

## L3 Content Quality Standards

Each hero/project case MUST include:

| Section | Purpose |
|---------|---------|
| `## 展示摘要` | Card/hero text (≤120 chars), consumed by sync |
| `## 一句话` | Legacy one-liner, consumed by sync |
| `## 技术挑战与约束` | Difficulties, constraints, non-goals |
| `## 关键架构决策` | Decision table or 2-4 ADR-style entries |
| STAR four sections | Situation/Task/Action/Result |
| `## 结果` (metrics table) | Quantified evidence, consumed by sync |
| `## 技术栈` | Tags, consumed by sync |
| `## 文档链接` | Backlinks to L2/L2+ |

## Writing Principles

1. **Problem first**: State the pain point clearly, then the solution
2. **Traceable decisions**: Each key decision has "what was considered, why not chosen"
3. **Contextual metrics**: e.g., "18→7 steps" must explain what process, who benefits
4. **Desensitized for external**: Internal system names can stay Tencent stack; customer data redact
5. **One fact, one place**: STAR only in L3; L2+ writes implementation; L2 writes methodology

## Docs → Web Sync Contract

| site.json field | docs source |
|-----------------|-------------|
| `hero` / `bio` | `个人信息.md` summary section |
| `industries[]` | `行业解决方案/<industry>/README.md` + one-liner |
| `projects[]` | L3 frontmatter table + `## 一句话` + `## 结果` metrics |
| `blog[]` | `博客/` directory index |

**Sync principle**: docs is the single source of truth. L3 with frontmatter is preferred for machine parsing.

**Command**: `npm run sync:site` — docs → `web/data/site.json` + `web/index.html`

**DO NOT manually edit `web/index.html` or `web/data/site.json`.**

## Internal vs Public Data

- Tailored resume: Extract from `个人信息.md` + target industry L3; do NOT copy `内部资料/周金成全量…` to public pages
- `内部资料/简历方向/` — keep only header title references
- `docs/原始资料/` — raw reference materials, not synced to web

## Update Checklist

When making structural changes, verify:
- [ ] `行业解决方案/README.md` contains all industry and tech solution links
- [ ] `个人信息.md` has industry entry points and navigation
- [ ] `能力全景图.md` has representative project rows
- [ ] Paths use consistent industry directory names
- [ ] New L3 follows `_templates/项目经验.md` template
- [ ] After docs changes, run `npm run sync:site`

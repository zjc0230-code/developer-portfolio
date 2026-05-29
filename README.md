# Developer Portfolio

周金成的个人作品集。`docs/` 为知识库，`web/` 为**纯静态 HTML** 站点。

## 项目结构

```
developer-portfolio/
├── docs/                 # 知识库（Markdown 源材料）
├── web/                  # 静态站点（HTML + CSS）
│   ├── index.html        # 生成物
│   ├── css/main.css
│   └── data/site.json
├── server/               # Go 微服务（可选后端）
└── scripts/
    ├── sync-site.mjs     # docs → site.json + index.html
    └── render-html.mjs
```

## 技术方案（Web）

| 项 | 选型 |
|----|------|
| 页面 | 纯 HTML5，无框架 |
| 样式 | 原生 CSS |
| 内容 | `docs/` → Node 同步脚本生成 |
| 本地预览 | `serve` 静态目录 |
| 构建 | 无编译，仅 `npm run sync:site` |

## 数据流（L1 → L2 → L3）

```
docs/个人信息.md + docs/行业解决方案/**  →  npm run sync:site
    →  web/data/site.json
    →  web/index.html
```

## 快速开始

```bash
npm run sync:site
npm run dev          # http://localhost:4321
```

## 阅读顺序（站点内）

个人信息 → 产业行业方案 → 技术方案 → 项目经验

## 许可证

MIT

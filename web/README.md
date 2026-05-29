# Web 站点（纯静态 HTML）

```
web/
├── index.html      # 由 npm run sync:site 生成，勿手改
├── css/main.css    # 样式（可手改）
└── data/site.json  # 中间数据（可选，供调试或后续 API）
```

## 命令（在仓库根目录）

```bash
npm run sync:site   # docs → site.json + index.html
npm run dev         # 同步后本地预览 http://localhost:4321
npm run build       # 等同 sync:site，产物即 web/ 目录
```

部署：将 `web/` 整个目录上传到静态托管即可。

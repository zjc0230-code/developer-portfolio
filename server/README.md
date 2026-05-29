# Server（后端微服务）

Go 实现的微服务目录。每个子目录为**独立服务**，自带 `go.mod`，通过 `go.work` 在本地联调。

## 目录结构

```
server/
├── go.work                 # Go workspace，本地多模块联调
├── README.md
├── gateway/                # API 网关 / BFF，统一对外入口
├── profile/                # 个人资料（简介、经历摘要等）
├── content/                # 内容服务（博客、项目叙事等，对接 docs）
└── contact/                # 联系与留言
```

## 服务约定

| 服务 | 默认端口 | 职责 |
|------|----------|------|
| `gateway` | 8080 | 路由、鉴权、聚合下游（后续实现） |
| `profile` | 8081 | 读取/更新展示用个人资料 |
| `content` | 8082 | 文章、项目条目；未来对接 `docs/` |
| `contact` | 8083 | 联系表单、留言提交 |

> 端口可在各服务环境变量中覆盖，当前仅为占位约定。

## 单服务目录规范

```
<service>/
├── cmd/server/main.go      # 入口
├── internal/
│   └── handler/            # HTTP 处理器
├── go.mod
└── README.md
```

后续按需扩展：`internal/service/`、`internal/repository/`、`api/`（proto/OpenAPI）等。

## 本地开发

```bash
cd server
go work sync

# 分别启动（多终端）
cd gateway && go run ./cmd/server
cd profile && go run ./cmd/server
cd content && go run ./cmd/server
cd contact && go run ./cmd/server
```

健康检查：`GET /health` → `{"status":"ok","service":"<name>"}`

## 与仓库其他部分的关系

```
docs/     ──►  content（未来同步）──►  gateway ──►  web/（可选动态数据）
web/      ──►  当前静态站点，暂不依赖 server
```

当前阶段：**仅目录与骨架**，业务逻辑后续迭代。

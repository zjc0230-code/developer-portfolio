# gateway

API 网关 / BFF。对外统一 HTTP 入口，路由至 `profile`、`content`、`contact` 等下游服务。

- 默认端口：`8080`
- 健康检查：`GET /health`

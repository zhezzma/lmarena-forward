# LM Arena Forward

一个基于 Cloudflare Workers 的 LM Arena 代理转发服务，用于智能路由和负载均衡。

## 📋 项目简介

LM Arena Forward 是一个轻量级的代理服务，部署在 Cloudflare Workers 上，能够根据日期自动选择不同的后端服务器进行请求转发。该服务主要用于 LM Arena 相关应用的负载均衡和高可用性保障。

## ✨ 主要特性

- 🚀 **零延迟启动** - 基于 Cloudflare Workers 的无服务器架构
- 🌍 **全球分布** - 利用 Cloudflare 的全球边缘网络
- 📅 **智能路由** - 根据日期自动选择最优后端服务器
- 🔄 **自动故障转移** - 内置负载均衡和故障转移机制
- 🛡️ **CORS 支持** - 完整的跨域资源共享支持
- 📊 **可观测性** - 内置监控和日志记录

## 🏗️ 架构设计

```
客户端请求 → Cloudflare Workers → 后端服务器
                    ↓
              智能路由选择
              (基于日期规则)
```

### 路由规则

服务根据当前日期（月份中的天数）选择对应的后端服务器：

- **19日及以后**: `https://pdsjifsoyqoy.us-west-1.clawcloudrun.com`
- **1-18日**: `https://hzaxwwzmncif.ap-northeast-1.clawcloudrun.com`

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn
- Cloudflare 账户

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 或者使用
npm start
```

开发服务器将在 `http://localhost:8787` 启动。

### 运行测试

```bash
npm test
```

### 部署到生产环境

```bash
npm run deploy
```

## 📁 项目结构

```
lmarena-forward/
├── src/
│   └── index.js          # 主要的 Worker 代码
├── test/
│   └── index.spec.js     # 测试文件
├── package.json          # 项目配置
├── wrangler.jsonc        # Cloudflare Workers 配置
├── vitest.config.js      # 测试配置
└── README.md            # 项目文档
```

## ⚙️ 配置说明

### URL 配置

在 `src/index.js` 中的 `URL_CONFIG` 数组定义了路由规则：

```javascript
const URL_CONFIG = [
  {
    start: 19,  // 从19日开始
    url: "https://pdsjifsoyqoy.us-west-1.clawcloudrun.com"
  },
  {
    start: 1,   // 从1日开始
    url: "https://hzaxwwzmncif.ap-northeast-1.clawcloudrun.com"
  }
];
```

### Wrangler 配置

`wrangler.jsonc` 文件包含了 Cloudflare Workers 的部署配置：

- **name**: Worker 名称
- **main**: 入口文件路径
- **compatibility_date**: 兼容性日期
- **routes**: 自定义域名路由
- **observability**: 监控配置

## 🔧 开发指南

### 添加新的后端服务器

1. 在 `URL_CONFIG` 数组中添加新的配置项
2. 确保 `start` 值按降序排列
3. 测试路由逻辑

### 修改路由规则

路由选择逻辑在 `getTargetUrl()` 函数中实现，可以根据需要修改选择算法。

### CORS 配置

如果需要启用 CORS 支持，可以取消注释 `forwardRequest()` 函数中的相关代码。

## 🧪 测试

项目使用 Vitest 进行测试，配合 `@cloudflare/vitest-pool-workers` 在 Workers 环境中运行测试。

```bash
# 运行所有测试
npm test

# 监听模式
npm test -- --watch
```

## 📊 监控和日志

- 启用了 Cloudflare Workers 的可观测性功能
- 错误会返回结构化的 JSON 响应
- 包含时间戳的错误日志

## 🚀 部署

### 自定义域名

项目配置了自定义域名 `lmarena-forward.godgodgame.com`，确保：

1. 域名已添加到 Cloudflare
2. DNS 记录正确配置
3. SSL/TLS 设置正确

### 环境变量

如需添加环境变量，在 `wrangler.jsonc` 中配置：

```json
"vars": {
  "MY_VARIABLE": "production_value"
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目为私有项目，请遵守相关使用条款。

## 🔗 相关链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Vitest 测试框架](https://vitest.dev/)

## 📞 支持

如有问题或建议，请通过以下方式联系：

- 创建 Issue
- 发送邮件至项目维护者
- 查看项目 Wiki

---

**注意**: 本服务依赖于 Cloudflare Workers 平台，请确保账户配额充足并遵守平台使用条款。

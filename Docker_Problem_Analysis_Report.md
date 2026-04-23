# Docker 环境问题分析与解决方案报告

## 📋 问题概述

项目在本地环境运行正常，但在 Docker 容器中出现大量错误。

---

## 🔍 问题诊断与分析

### 问题 1：Prisma Query Engine 不兼容

**错误信息**：
```
Prisma Client could not locate the Query Engine for runtime "debian-openssl-3.0.x".
This happened because Prisma Client was generated for "linux-musl", but the actual deployment required "debian-openssl-3.0.x".
```

**根本原因**：
- **本地环境**：Windows 系统
- **最初 Docker 镜像**：Alpine Linux (linux-musl)
- **当前 Docker 镜像**：Debian Bookworm (debian-openssl-3.0.x)
- Prisma Client 生成时只包含了构建时的目标平台，未包含运行时平台

**影响范围**：
- 所有涉及 Prisma 查询的页面和 API
- Dashboard、Calendar、Tasks、Projects 等功能

---

### 问题 2：数据库文件路径不一致

**错误表现**：
- 容器内数据库与本地数据库分离
- 数据在容器重启后可能丢失

**根本原因**：
- Docker 卷挂载配置不当
- `DATABASE_URL` 路径相对路径导致定位问题

---

### 问题 3：node_modules 卷挂载冲突

**潜在风险**：
- 本地 node_modules (Windows) 与容器内 node_modules (Linux) 不兼容
- 依赖项二进制文件平台差异

---

## 📊 Docker 环境与本地环境差异对比

| 方面 | 本地环境 | Docker 环境 | 差异影响 |
|------|---------|------------|---------|
| **操作系统** | Windows | Debian Linux (Bookworm) | Prisma 引擎二进制不兼容 |
| **OpenSSL 版本** | Windows 特定 | OpenSSL 3.0.x | 加密库依赖差异 |
| **文件系统** | NTFS | EXT4 | 权限、路径分隔符 |
| **数据库位置** | `./prisma/dev.db` | `/app/prisma/dev.db` | 路径配置需要调整 |
| **Prisma 生成目标** | Windows 原生 | 需要多平台支持 | 引擎二进制缺失 |

---

## 🔧 已实施的解决方案

### 修复 1：Prisma Schema 配置更新

**文件**：`prisma/schema.prisma`

**修改内容**：
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x", "linux-musl-openssl-3.0.x", "windows"]
}
```

**说明**：
- `native` - 当前构建平台
- `debian-openssl-3.0.x` - Docker 运行时平台
- `linux-musl-openssl-3.0.x` - Alpine 备用平台
- `windows` - 本地开发平台

---

### 修复 2：Docker Compose 配置优化

**文件**：`docker-compose.yml`

**关键改进**：
```yaml
volumes:
  - ./:/app
  - /app/node_modules          # 独立容器 node_modules
  - /app/.next                # 独立 .next 缓存
  - app_prisma:/app/prisma    # 持久化数据库
environment:
  - DATABASE_URL=file:/app/prisma/dev.db  # 绝对路径
```

---

### 修复 3：Dockerfile 基础镜像切换

**从**：`node:20-alpine` (Musl libc)

**到**：`node:20-bookworm-slim` (GNU libc)

**优势**：
- 更好的兼容性
- 更完整的系统库
- Prisma 官方支持更好

---

## 🚀 部署与验证步骤

### 完整重新构建流程

```powershell
# 1. 停止并清理旧容器和卷
docker compose down -v

# 2. 重新构建并启动
docker compose up --build -d

# 3. 查看启动日志
docker compose logs -f

# 4. 在容器内重新生成 Prisma Client
docker compose exec app npx prisma generate

# 5. 运行数据库迁移（如需要）
docker compose exec app npx prisma migrate dev

# 6. 填充种子数据
docker compose exec app npm run db:seed
```

---

### 健康检查清单

- [ ] 容器状态为 `Up (healthy)`
- [ ] Next.js 服务在 30000 端口监听
- [ ] 可以访问 `http://localhost:30001`
- [ ] Prisma 查询正常工作
- [ ] Dashboard 页面加载成功
- [ ] Calendar 功能正常
- [ ] Tasks 列表可以显示
- [ ] 数据库数据持久化

---

## 🛡️ 预防措施与最佳实践

### 1. Prisma 配置最佳实践

**始终配置多平台 binaryTargets**：
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x", "linux-musl-openssl-3.0.x", "windows"]
}
```

### 2. Docker 卷挂载策略

**推荐的卷挂载配置**：
```yaml
volumes:
  # 源代码挂载（支持热重载）
  - ./:/app
  
  # 隔离的依赖（避免平台冲突）
  - /app/node_modules
  
  # 独立的构建缓存
  - /app/.next
  
  # 持久化数据
  - app_data:/app/prisma
```

### 3. 开发工作流建议

**本地开发**：
```powershell
npm install
npx prisma generate
npm run dev
```

**Docker 开发**：
```powershell
docker compose up -d
docker compose exec app npx prisma generate
```

---

## 📁 修改的文件清单

| 文件 | 修改内容 |
|------|---------|
| `prisma/schema.prisma` | 添加 multi-platform binaryTargets |
| `docker-compose.yml` | 优化卷挂载和数据库路径 |
| `Dockerfile` | 切换到 Debian 基础镜像 |

---

## 🎯 预期结果

修复后项目应该能够：

1. ✅ 在 Docker 容器中正常启动
2. ✅ Prisma 查询正常工作
3. ✅ 所有页面功能正常
4. ✅ 数据库持久化正确
5. ✅ 热重载功能正常
6. ✅ 与本地环境行为一致

---

## 📞 进一步支持

如果问题仍然存在，请检查：
1. `docker compose logs -f` 的详细输出
2. `TROUBLESHOOTING.md` 中的故障排查指南
3. 确认 Prisma 版本兼容性

---

**报告生成时间**：2026-04-18
**状态**：✅ 问题分析完成，已实施修复方案

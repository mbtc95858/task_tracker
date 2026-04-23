# Docker 开发环境

本项目已配置完整的 Docker 开发环境，支持本地开发与容器化环境的无缝衔接。

## 系统要求

- Docker 20.10+
- Docker Compose 2.0+

## 快速开始

### 1. 首次启动（构建并运行）

```bash
docker-compose up -d --build
```

### 2. 启动开发环境

```bash
docker-compose up -d
```

### 3. 停止开发环境

```bash
docker-compose down
```

### 4. 重启服务

```bash
docker-compose restart
```

### 5. 查看日志

查看所有服务日志：
```bash
docker-compose logs -f
```

查看特定服务日志：
```bash
docker-compose logs -f app
```

## 开发工作流

### 容器内执行命令

#### 进入容器 shell
```bash
docker-compose exec app sh
```

#### 安装依赖
```bash
docker-compose exec app npm install
```

#### 数据库操作

生成 Prisma Client：
```bash
docker-compose exec app npx prisma generate
```

运行迁移：
```bash
docker-compose exec app npx prisma migrate dev
```

重置数据库：
```bash
docker-compose exec app npm run db:reset
```

填充种子数据：
```bash
docker-compose exec app npm run db:seed
```

## 文件同步与热重载

- 本地代码修改会自动同步到容器
- Next.js 热重载正常工作
- 数据库文件通过命名卷持久化

## 端口说明

| 服务 | 主机端口 | 容器端口 | 说明 |
|------|---------|---------|------|
| 应用服务 | `30001` | `30000` | Web 应用访问 |
| 调试端口 | `9230` | `9229` | Node.js 调试 |

## 访问应用

启动后访问：`http://localhost:30001`

### 端口自定义

如需修改端口，请编辑 `docker-compose.yml` 中的端口映射配置，详见 `PORT_CONFIG.md`。

## 生产构建

如需构建生产镜像：

```bash
docker build --target runner -t task_tracker:latest .
```

运行生产容器：
```bash
docker run -p 30000:30000 task_tracker:latest
```

## 故障排除

### 依赖问题
```bash
docker-compose down -v
docker-compose up -d --build
```

### 容器无法启动
```bash
docker-compose logs app
```

### 清理所有资源
```bash
docker-compose down -v --rmi all
```

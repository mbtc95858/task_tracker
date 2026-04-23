# Docker 故障排查指南

本文档详细说明如何排查和解决 "容器运行正常但服务不可用" 的问题。

---

## 一、问题诊断流程

### 步骤 1：检查容器状态

```powershell
# 查看所有容器
docker ps -a

# 使用 Docker Compose 查看
docker compose ps
```

**容器状态说明：**
| 状态 | 含义 |
|------|------|
| `Up` | 正常运行 ✅ |
| `Created` | 已创建但未启动 ❌ |
| `Exited` | 已退出 ❌ |
| `Restarting` | 重启中 ⚠️ |

---

### 步骤 2：查看容器日志

```powershell
# 查看容器日志
docker logs task_tracker_dev

# 实时跟踪日志
docker logs -f task_tracker_dev

# 使用 Docker Compose 查看
docker compose logs -f
docker compose logs app
```

---

### 步骤 3：检查端口映射

```powershell
# 查看端口绑定
docker port task_tracker_dev

# 检查主机端口占用
netstat -ano | findstr "30001"
```

---

### 步骤 4：进入容器内部检查

```powershell
# 进入容器 shell
docker compose exec app sh

# 在容器内执行
# 检查进程
ps aux

# 检查端口监听
netstat -tulpn

# 测试本地访问
curl http://localhost:30000
```

---

### 步骤 5：检查网络连通性

```powershell
# 从主机测试容器端口
# 使用 PowerShell
Test-NetConnection -ComputerName localhost -Port 30001

# 或使用 curl
curl http://localhost:30001
```

---

## 二、常见问题与解决方案

### 问题 1：容器处于 Created 状态，未启动

**症状：**
```
STATUS: Created
```

**解决方案：**
```powershell
# 1. 删除旧容器
docker rm -f task_tracker_dev

# 2. 重新启动
docker compose up -d --build

# 3. 查看实时日志
docker compose logs -f
```

---

### 问题 2：容器内应用未正常启动

**检查清单：**
- [ ] Node.js 依赖是否完整安装
- [ ] Prisma Client 是否已生成
- [ ] 数据库文件是否存在
- [ ] 端口 30000 是否在容器内被监听

**解决方案：**
```powershell
# 进入容器
docker compose exec app sh

# 在容器内执行
cd /app
ls -la

# 检查 node_modules
ls -la node_modules

# 生成 Prisma Client
npx prisma generate

# 检查数据库
ls -la prisma/

# 手动启动服务查看错误
npm run dev
```

---

### 问题 3：端口映射问题

**症状：** 容器内服务正常，但主机无法访问

**检查命令：**
```powershell
# 1. 检查容器内服务是否正常
docker compose exec app curl http://localhost:30000

# 2. 检查端口映射
docker port task_tracker_dev

# 3. 检查主机防火墙
# 临时关闭防火墙测试（仅用于调试）
```

---

### 问题 4：Next.js 启动缓慢

**症状：** 容器启动后需要等待较长时间才能访问

**原因：** Next.js 开发模式需要编译项目

**解决方案：**
```powershell
# 查看日志等待编译完成
docker compose logs -f

# 看到类似输出表示已就绪：
# - ready started server on 0.0.0.0:30000
```

---

## 三、完整启动与诊断流程

### 推荐的完整启动步骤

```powershell
# 1. 清理旧资源
docker compose down -v

# 2. 重新构建并启动
docker compose up --build -d

# 3. 立即查看日志
docker compose logs -f

# 4. 在另一个终端检查状态
docker compose ps
```

---

### 健康状态判断

等待看到以下日志表示服务已就绪：

```
▲ Next.js 14.x.x
- Local:        http://localhost:30000
- Ready in ...ms
```

---

## 四、容器内部诊断命令

进入容器后执行：

```sh
# 1. 检查目录结构
cd /app
ls -la

# 2. 检查依赖
ls -la node_modules

# 3. 检查环境变量
env

# 4. 检查运行进程
ps aux

# 5. 检查端口监听
netstat -tulpn 2>/dev/null || ss -tulpn

# 6. 本地测试服务
curl -v http://localhost:30000

# 7. 生成 Prisma Client（如需要）
npx prisma generate

# 8. 检查数据库
ls -la prisma/
```

---

## 五、快速修复脚本

### 完全重置并重新启动

```powershell
# 完整重置
docker compose down -v
docker system prune -f

# 重新启动
docker compose up --build -d

# 查看日志
docker compose logs -f
```

---

## 六、关键检查点清单

### 启动前检查
- [ ] Docker Desktop 正在运行
- [ ] 端口 30001 和 9230 未被占用
- [ ] 有足够的磁盘空间

### 启动后检查
- [ ] 容器状态为 `Up`
- [ ] 端口映射正确 `0.0.0.0:30001->30000/tcp`
- [ ] 日志显示 Next.js 已启动
- [ ] 可以从容器内部访问 `http://localhost:30000`
- [ ] 可以从主机访问 `http://localhost:30001`

---

## 七、获取帮助

如果问题持续存在，请收集以下信息：

1. `docker ps -a` 输出
2. `docker compose logs` 输出
3. `docker inspect task_tracker_dev` 输出
4. 主机操作系统信息

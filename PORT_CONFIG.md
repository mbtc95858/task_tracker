# 端口配置指南

本文档详细说明如何管理和修改项目的端口配置。

## 当前端口映射

| 服务 | 容器内端口 | 主机映射端口 | 说明 |
|------|-----------|-------------|------|
| 应用服务 | 30000 | **30001** | Web 应用访问 |
| 调试端口 | 9229 | **9230** | Node.js 调试 |

## 一、如何检查端口占用

### Windows 系统

```powershell
# 检查特定端口
netstat -ano | findstr "30000"

# 检查多个端口
netstat -ano | findstr "30000 30001 9229 9230"

# 查看所有监听端口
netstat -ano | findstr "LISTENING"
```

### 根据 PID 查找进程

```powershell
# 查找占用端口的进程
tasklist | findstr "<PID>"
```

### 结束占用端口的进程

```powershell
# 强制结束进程
taskkill /F /PID <PID>
```

## 二、如何修改端口映射

### 2.1 修改 docker-compose.yml

端口映射格式：`"主机端口:容器端口"`

```yaml
ports:
  - "30001:30000"   # 主机端口 30001 → 容器端口 30000
  - "9230:9229"     # 主机端口 9230 → 容器端口 9229
```

### 2.2 自定义端口示例

假设您想使用端口 40000 和 40001：

```yaml
ports:
  - "40000:30000"
  - "40001:9229"
```

### 2.3 修改后重启服务

```powershell
# 停止旧容器
docker compose down

# 使用新配置启动
docker compose up -d

# 查看日志
docker compose logs -f
```

## 三、端口配置完整说明

### 端口映射概念

```
主机端口（Host Port）      ←→    容器端口（Container Port）
（外部可访问）                   （容器内部使用）

例如：
    30001:30000
     ↑      ↑
  主机   容器
```

### 为什么容器内端口保持 30000？

- 容器内应用配置使用固定端口
- 通过 Docker 端口映射实现灵活访问
- 避免修改应用代码

## 四、快速启动方案

### 方案 A：使用当前配置（端口 30001）

```powershell
# 启动服务
docker compose up -d

# 访问应用
# 浏览器打开：http://localhost:30001
```

### 方案 B：使用其他任意端口

编辑 `docker-compose.yml`：

```yaml
ports:
  - "<您想要的端口>:30000"
  - "<调试端口>:9229"
```

然后：

```powershell
docker compose down
docker compose up -d
```

## 五、常用端口参考

| 用途 | 推荐端口范围 |
|------|-------------|
| Web 应用 | 30000-39999 |
| 调试端口 | 9229-9299 |
| API 服务 | 40000-49999 |

## 六、故障排查

### 问题 1：端口仍然被占用

```powershell
# 检查所有相关端口
netstat -ano | findstr "3000"

# 结束旧容器（可能残留）
docker ps -a
docker rm -f task_tracker_dev
```

### 问题 2：无法访问应用

```powershell
# 查看容器状态
docker compose ps

# 查看详细日志
docker compose logs app
```

### 问题 3：需要恢复默认端口

将 `docker-compose.yml` 改回：

```yaml
ports:
  - "30000:30000"
  - "9229:9229"
```

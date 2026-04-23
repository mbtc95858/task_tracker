# Docker初始化脚本 - 一键启动并配置
Write-Host "🚀 初始化Task Tracker Docker环境..." -ForegroundColor Cyan

Write-Host "`n1️⃣  停止并清理旧容器..." -ForegroundColor Yellow
docker compose down -v

Write-Host "`n2️⃣  构建并启动容器..." -ForegroundColor Yellow
docker compose up --build -d

Write-Host "`n3️⃣  等待容器启动和数据库初始化..." -ForegroundColor Yellow
Start-Sleep -Seconds 45

Write-Host "`n4️⃣  生成示例数据..." -ForegroundColor Yellow
docker compose exec app npm run db:seed

Write-Host "`n✅ 完成！" -ForegroundColor Green
Write-Host "访问地址: http://localhost:30001"
Write-Host "查看日志: docker compose logs -f"

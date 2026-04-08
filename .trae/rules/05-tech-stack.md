# Tech Stack

## 推荐技术栈
优先建议：
- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- Zod

## 技术原则
1. 全栈 TypeScript
2. 明确类型定义，禁止 any 泛滥
3. 前后端共享 schema / types
4. API 输入输出必须校验
5. 页面组件不承载重业务逻辑
6. 领域逻辑放在 service / feature / server 层
7. seed 数据必须可用于本地演示
8. MVP 优先简单、真实可运行、方便扩展

## 替换技术栈条件
如果要替换推荐栈，必须满足：
- 本地快速启动
- 结构清晰
- 易于扩展
- 不增加 MVP 落地复杂度

## 目录组织原则
建议至少包含：
- app
- components
- features
- lib
- config
- prisma
- server
- validators
- types

## 实现优先级
严格按以下顺序推进：
1. Task CRUD
2. 阻力分析字段
3. 三层动作
4. AVOIDED 状态
5. Progress Log
6. 积分系统
7. Dashboard
8. Daily Review
9. Insights
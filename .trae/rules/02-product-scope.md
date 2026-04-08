# Product Scope

## MVP 必须包含

### 1. Task 基础能力
支持：
- 创建任务
- 编辑任务
- 删除任务
- 查看任务列表
- 查看任务详情
- 更新任务状态

### 2. 阻力分析
每个任务支持：
- fearLevel
- resistanceLevel
- clarityLevel
- painLevel
- startDifficulty
- resistanceReasons[]
- resistanceNote

### 3. 三层动作
每个任务必须支持：
- contactStep：接触动作
- tinyStep：最小可执行动作
- normalStep：标准推进动作

### 4. Avoided 状态
任务状态至少包括：
- INBOX
- PLANNED
- ACTIVE
- BLOCKED
- AVOIDED
- DONE
- ARCHIVED

其中 AVOIDED 是核心状态，表示任务被心理回避。

### 5. Progress Log
支持：
- TOUCHED
- STARTED_TINY_STEP
- MADE_PROGRESS
- COMPLETED
- REACTIVATED

### 6. Points
必须有积分系统，由后端统一结算。

### 7. Daily Review
支持每日复盘，并保存历史。

### 8. Dashboard
首页必须是减压型今日面板，而不是普通任务列表。

### 9. Insights
必须有简版统计页，用于查看阻力模式和状态概览。

## MVP 不做
- 团队协作
- 多用户权限
- 聊天系统
- 复杂 AI 助手
- 深度日历集成
- 复杂通知系统
- 社交排名
- 重游戏化商城
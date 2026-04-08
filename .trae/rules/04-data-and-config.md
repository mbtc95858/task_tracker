# Data And Config Rules

## 核心实体
至少包含以下实体：

### Task
字段建议：
- id
- title
- description
- category
- priority
- dueDate
- estimatedMinutes
- status
- fearLevel
- resistanceLevel
- clarityLevel
- painLevel
- startDifficulty
- resistanceReasons[]
- resistanceNote
- contactStep
- tinyStep
- normalStep
- createdAt
- updatedAt

### TaskProgressLog
- id
- taskId
- actionType
- note
- createdAt

### DailyReview
- id
- date
- mostAvoidedTaskId
- didStart
- blockingReason
- effectiveStarter
- actualPainLevel
- painComparison
- note
- createdAt
- updatedAt

### PointTransaction
- id
- sourceType
- sourceId
- delta
- reason
- createdAt

## 枚举集中管理
以下内容必须集中配置，禁止散落硬编码：
- TaskStatus
- Priority
- TaskProgressActionType
- ResistanceReason
- PainComparison
- PointSourceType

## 配置集中管理
以下内容应放在 config 层：
- 阻力原因标签映射
- 状态标签映射
- 积分规则
- 默认筛选参数
- 友好文案

## 原则
1. 先定义 schema / types / API contract，再写页面
2. 前后端共享类型
3. 表单校验和 API 校验尽量复用同一套 schema
4. 避免把业务常量写死在组件里
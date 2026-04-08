# Business Rules

## 高阻力任务判定
满足以下任一条件即可视为高阻力任务：
- fearLevel >= 7
- resistanceLevel >= 7
- startDifficulty >= 7
- status = AVOIDED

Dashboard 需要优先展示这类任务。

## 推荐动作逻辑
推荐优先级如下：
1. 若任务为 AVOIDED，优先推荐 contactStep
2. 若 fearLevel 或 resistanceLevel 很高，优先推荐 tinyStep
3. 若多次 TOUCHED 但没有推进，推荐 tinyStep
4. 若任务已启动，则推荐 normalStep

## Daily Review 规则
- 每日最多一条 review
- 当天已有记录时进入编辑模式，而不是重复创建

## 状态建议逻辑
默认只做建议，不强制自动切换状态：
- 长时间未动且高阻力 -> 建议 AVOIDED
- 有 REACTIVATED 或 STARTED_TINY_STEP -> 可建议 ACTIVE
- 完成 -> DONE

## 积分原则
积分重点奖励：
- 创建清晰任务
- 识别阻力
- 接触任务
- 完成最小动作
- 重启 Avoided 任务
- 完成每日复盘

## 产品行为原则
1. 不用高压提醒驱动用户
2. 不把回避当失败，而当作需要识别的阻力
3. 强调“今天只接触一下也算进步”
4. 系统应帮助用户从大压力任务降级到最小动作
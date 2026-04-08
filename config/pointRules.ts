import { PointSourceType } from './constants';

export interface PointRule {
  delta: number;
  reason: string;
}

export const POINT_RULES: Record<PointSourceType, PointRule> = {
  [PointSourceType.TASK_CREATED]: {
    delta: 1,
    reason: '创建任务',
  },
  [PointSourceType.RESISTANCE_FILLED]: {
    delta: 2,
    reason: '填写阻力分析',
  },
  [PointSourceType.TASK_TOUCHED]: {
    delta: 3,
    reason: '完成接触动作',
  },
  [PointSourceType.TINY_STEP_DONE]: {
    delta: 5,
    reason: '完成最小动作',
  },
  [PointSourceType.TASK_PROGRESS]: {
    delta: 8,
    reason: '正常推进任务',
  },
  [PointSourceType.TASK_COMPLETED]: {
    delta: 15,
    reason: '完成任务',
  },
  [PointSourceType.TASK_REACTIVATED]: {
    delta: 8,
    reason: '重启 Avoided 任务',
  },
  [PointSourceType.DAILY_REVIEW_COMPLETED]: {
    delta: 3,
    reason: '完成每日复盘',
  },
};

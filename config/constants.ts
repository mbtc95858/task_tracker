export enum TaskStatus {
  INBOX = 'INBOX',
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  AVOIDED = 'AVOIDED',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TaskProgressActionType {
  TOUCHED = 'TOUCHED',
  STARTED_TINY_STEP = 'STARTED_TINY_STEP',
  MADE_PROGRESS = 'MADE_PROGRESS',
  COMPLETED = 'COMPLETED',
  REACTIVATED = 'REACTIVATED',
}

export enum ResistanceReason {
  DONT_KNOW_HOW_TO_START = 'DONT_KNOW_HOW_TO_START',
  TOO_BIG_OR_VAGUE = 'TOO_BIG_OR_VAGUE',
  FEAR_OF_FAILURE = 'FEAR_OF_FAILURE',
  FEAR_OF_RESULT = 'FEAR_OF_RESULT',
  TOO_ANNOYING = 'TOO_ANNOYING',
  TOO_BORING = 'TOO_BORING',
  TOO_MENTALLY_DEMANDING = 'TOO_MENTALLY_DEMANDING',
  TOO_MANY_DECISIONS = 'TOO_MANY_DECISIONS',
  FAILED_BEFORE = 'FAILED_BEFORE',
  SHAME_FROM_DELAY = 'SHAME_FROM_DELAY',
  NOT_SURE_IF_WORTH_IT = 'NOT_SURE_IF_WORTH_IT',
  SOCIAL_PRESSURE = 'SOCIAL_PRESSURE',
  PERFECTIONISM = 'PERFECTIONISM',
  FEAR_IT_WONT_END = 'FEAR_IT_WONT_END',
  LOW_ENERGY = 'LOW_ENERGY',
}

export enum PainComparison {
  LIGHTER_THAN_EXPECTED = 'LIGHTER_THAN_EXPECTED',
  ABOUT_AS_EXPECTED = 'ABOUT_AS_EXPECTED',
  HEAVIER_THAN_EXPECTED = 'HEAVIER_THAN_EXPECTED',
}

export enum PointSourceType {
  TASK_CREATED = 'TASK_CREATED',
  RESISTANCE_FILLED = 'RESISTANCE_FILLED',
  TASK_TOUCHED = 'TASK_TOUCHED',
  TINY_STEP_DONE = 'TINY_STEP_DONE',
  TASK_PROGRESS = 'TASK_PROGRESS',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_REACTIVATED = 'TASK_REACTIVATED',
  DAILY_REVIEW_COMPLETED = 'DAILY_REVIEW_COMPLETED',
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.INBOX]: '收件箱',
  [TaskStatus.PLANNED]: '已计划',
  [TaskStatus.ACTIVE]: '进行中',
  [TaskStatus.BLOCKED]: '阻塞',
  [TaskStatus.AVOIDED]: '回避',
  [TaskStatus.DONE]: '已完成',
  [TaskStatus.ARCHIVED]: '已归档',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.LOW]: '低',
  [Priority.MEDIUM]: '中',
  [Priority.HIGH]: '高',
  [Priority.CRITICAL]: '紧急',
};

export const TASK_PROGRESS_ACTION_LABELS: Record<TaskProgressActionType, string> = {
  [TaskProgressActionType.TOUCHED]: '接触任务',
  [TaskProgressActionType.STARTED_TINY_STEP]: '完成最小动作',
  [TaskProgressActionType.MADE_PROGRESS]: '正常推进',
  [TaskProgressActionType.COMPLETED]: '完成任务',
  [TaskProgressActionType.REACTIVATED]: '重启任务',
};

export const RESISTANCE_REASON_LABELS: Record<ResistanceReason, string> = {
  [ResistanceReason.DONT_KNOW_HOW_TO_START]: '不知道从哪开始',
  [ResistanceReason.TOO_BIG_OR_VAGUE]: '太大或太模糊',
  [ResistanceReason.FEAR_OF_FAILURE]: '害怕失败',
  [ResistanceReason.FEAR_OF_RESULT]: '害怕结果',
  [ResistanceReason.TOO_ANNOYING]: '太烦人',
  [ResistanceReason.TOO_BORING]: '太无聊',
  [ResistanceReason.TOO_MENTALLY_DEMANDING]: '太费脑子',
  [ResistanceReason.TOO_MANY_DECISIONS]: '太多决策',
  [ResistanceReason.FAILED_BEFORE]: '之前失败过',
  [ResistanceReason.SHAME_FROM_DELAY]: '拖延的羞耻感',
  [ResistanceReason.NOT_SURE_IF_WORTH_IT]: '不确定是否值得',
  [ResistanceReason.SOCIAL_PRESSURE]: '社交压力',
  [ResistanceReason.PERFECTIONISM]: '完美主义',
  [ResistanceReason.FEAR_IT_WONT_END]: '害怕没完没了',
  [ResistanceReason.LOW_ENERGY]: '精力不足',
};

export const PAIN_COMPARISON_LABELS: Record<PainComparison, string> = {
  [PainComparison.LIGHTER_THAN_EXPECTED]: '比预想更轻',
  [PainComparison.ABOUT_AS_EXPECTED]: '差不多',
  [PainComparison.HEAVIER_THAN_EXPECTED]: '比预想更重',
};

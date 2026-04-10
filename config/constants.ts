export enum TaskStatus {
  INBOX = 'INBOX',
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  AVOIDED = 'AVOIDED',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export const TASK_STATUS_VALUES = Object.values(TaskStatus) as [TaskStatus, ...TaskStatus[]];

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export const PRIORITY_VALUES = Object.values(Priority) as [Priority, ...Priority[]];

export enum TaskProgressActionType {
  TOUCHED = 'TOUCHED',
  STARTED_TINY_STEP = 'STARTED_TINY_STEP',
  MADE_PROGRESS = 'MADE_PROGRESS',
  COMPLETED = 'COMPLETED',
  REACTIVATED = 'REACTIVATED',
}

export const TASK_PROGRESS_ACTION_VALUES = Object.values(TaskProgressActionType) as [TaskProgressActionType, ...TaskProgressActionType[]];

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

export const RESISTANCE_REASON_VALUES = Object.values(ResistanceReason) as [ResistanceReason, ...ResistanceReason[]];

export enum PainComparison {
  LIGHTER_THAN_EXPECTED = 'LIGHTER_THAN_EXPECTED',
  ABOUT_AS_EXPECTED = 'ABOUT_AS_EXPECTED',
  HEAVIER_THAN_EXPECTED = 'HEAVIER_THAN_EXPECTED',
}

export const PAIN_COMPARISON_VALUES = Object.values(PainComparison) as [PainComparison, ...PainComparison[]];

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

// ------------------------------
// 新增 Project 相关枚举
// ------------------------------

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export const PROJECT_STATUS_VALUES = Object.values(ProjectStatus) as [ProjectStatus, ...ProjectStatus[]];

export enum TaskType {
  PROJECT_PHASE = 'PROJECT_PHASE',
  MILESTONE = 'MILESTONE',
  TASK = 'TASK',
  SUBTASK = 'SUBTASK',
}

export const TASK_TYPE_VALUES = Object.values(TaskType) as [TaskType, ...TaskType[]];

export enum ProgressMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export const PROGRESS_MODE_VALUES = Object.values(ProgressMode) as [ProgressMode, ...ProgressMode[]];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.ACTIVE]: '进行中',
  [ProjectStatus.PAUSED]: '暂停',
  [ProjectStatus.COMPLETED]: '已完成',
  [ProjectStatus.ARCHIVED]: '已归档',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  [TaskType.PROJECT_PHASE]: '阶段',
  [TaskType.MILESTONE]: '里程碑',
  [TaskType.TASK]: '任务',
  [TaskType.SUBTASK]: '子任务',
};

export const PROGRESS_MODE_LABELS: Record<ProgressMode, string> = {
  [ProgressMode.AUTO]: '自动计算',
  [ProgressMode.MANUAL]: '手动填写',
};

// ------------------------------
// 任务分类
// ------------------------------

export enum TaskCategory {
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  STUDY = 'STUDY',
  HEALTH = 'HEALTH',
  FINANCE = 'FINANCE',
  CREATIVE = 'CREATIVE',
  SOCIAL = 'SOCIAL',
  ADMIN = 'ADMIN',
}

export const TASK_CATEGORY_VALUES = Object.values(TaskCategory) as [TaskCategory, ...TaskCategory[]];

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: '工作',
  [TaskCategory.PERSONAL]: '个人',
  [TaskCategory.STUDY]: '学习',
  [TaskCategory.HEALTH]: '健康',
  [TaskCategory.FINANCE]: '财务',
  [TaskCategory.CREATIVE]: '创意',
  [TaskCategory.SOCIAL]: '社交',
  [TaskCategory.ADMIN]: '行政',
};

export const TASK_CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  [TaskCategory.PERSONAL]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  [TaskCategory.STUDY]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  [TaskCategory.HEALTH]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  [TaskCategory.FINANCE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  [TaskCategory.CREATIVE]: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  [TaskCategory.SOCIAL]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  [TaskCategory.ADMIN]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

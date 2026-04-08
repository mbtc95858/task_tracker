import { z } from 'zod';

// 字符串枚举值，避免服务端 z.nativeEnum 问题
const TASK_STATUS_VALUES = ['INBOX', 'PLANNED', 'ACTIVE', 'BLOCKED', 'AVOIDED', 'DONE', 'ARCHIVED'] as const;
const PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const TASK_PROGRESS_ACTION_VALUES = ['TOUCHED', 'STARTED_TINY_STEP', 'MADE_PROGRESS', 'COMPLETED', 'REACTIVATED'] as const;
const RESISTANCE_REASON_VALUES = [
  'DONT_KNOW_HOW_TO_START',
  'TOO_BIG_OR_VAGUE',
  'FEAR_OF_FAILURE',
  'FEAR_OF_RESULT',
  'TOO_ANNOYING',
  'TOO_BORING',
  'TOO_MENTALLY_DEMANDING',
  'TOO_MANY_DECISIONS',
  'FAILED_BEFORE',
  'SHAME_FROM_DELAY',
  'NOT_SURE_IF_WORTH_IT',
  'SOCIAL_PRESSURE',
  'PERFECTIONISM',
  'FEAR_IT_WONT_END',
  'LOW_ENERGY',
] as const;
const PAIN_COMPARISON_VALUES = ['LIGHTER_THAN_EXPECTED', 'ABOUT_AS_EXPECTED', 'HEAVIER_THAN_EXPECTED'] as const;
const PROJECT_STATUS_VALUES = ['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'] as const;
const PROGRESS_MODE_VALUES = ['AUTO', 'MANUAL'] as const;

export const TaskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(PRIORITY_VALUES),
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  estimatedMinutes: z.number().int().positive().optional(),
  status: z.enum(TASK_STATUS_VALUES),
  fearLevel: z.number().int().min(1).max(10).optional(),
  resistanceLevel: z.number().int().min(1).max(10).optional(),
  clarityLevel: z.number().int().min(1).max(10).optional(),
  painLevel: z.number().int().min(1).max(10).optional(),
  startDifficulty: z.number().int().min(1).max(10).optional(),
  resistanceReasons: z.array(z.enum(RESISTANCE_REASON_VALUES)),
  resistanceNote: z.string().optional(),
  contactStep: z.string().optional(),
  tinyStep: z.string().optional(),
  normalStep: z.string().optional(),
});

export const CreateTaskSchema = TaskSchema.omit({});
export const UpdateTaskSchema = TaskSchema.partial();

export const TaskProgressLogSchema = z.object({
  actionType: z.enum(TASK_PROGRESS_ACTION_VALUES),
  note: z.string().optional(),
});

export const DailyReviewSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  mostAvoidedTaskId: z.string().optional(),
  didStart: z.boolean().optional(),
  blockingReason: z.string().optional(),
  effectiveStarter: z.string().optional(),
  actualPainLevel: z.number().int().min(1).max(10).optional(),
  painComparison: z.enum(PAIN_COMPARISON_VALUES).optional(),
  note: z.string().optional(),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  status: z.enum(PROJECT_STATUS_VALUES),
  priority: z.enum(PRIORITY_VALUES),
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  progressMode: z.enum(PROGRESS_MODE_VALUES),
  manualProgress: z.number().int().min(0).max(100).optional(),
  orderIndex: z.number().int().optional(),
});

export const CreateProjectSchema = ProjectSchema.omit({ orderIndex: true });
export const UpdateProjectSchema = ProjectSchema.partial();

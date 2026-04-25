import { z } from 'zod';
import {
  TASK_STATUS_VALUES,
  PRIORITY_VALUES,
  TASK_PROGRESS_ACTION_VALUES,
  RESISTANCE_REASON_VALUES,
  PAIN_COMPARISON_VALUES,
  PROJECT_STATUS_VALUES,
  PROGRESS_MODE_VALUES,
  TASK_TYPE_VALUES,
  TaskType,
} from '@/config/constants';

export const TaskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(PRIORITY_VALUES).optional(),
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  estimatedMinutes: z.number().int().positive().optional(),
  status: z.enum(TASK_STATUS_VALUES).optional(),
  fearLevel: z.number().int().min(1).max(10).optional(),
  resistanceLevel: z.number().int().min(1).max(10).optional(),
  clarityLevel: z.number().int().min(1).max(10).optional(),
  painLevel: z.number().int().min(1).max(10).optional(),
  startDifficulty: z.number().int().min(1).max(10).optional(),
  resistanceReasons: z.array(z.enum(RESISTANCE_REASON_VALUES)).optional(),
  resistanceNote: z.string().optional(),
  contactStep: z.string().optional(),
  tinyStep: z.string().optional(),
  normalStep: z.string().optional(),
  projectId: z.string().optional(),
});

export const CreateTaskSchema = TaskSchema.omit({});
export const UpdateTaskSchema = TaskSchema.partial();

export const CreateProjectTaskSchema = TaskSchema.extend({
  projectId: z.string().min(1),
  parentTaskId: z.string().optional(),
  taskType: z.enum(TASK_TYPE_VALUES).optional().default(TaskType.TASK),
});

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

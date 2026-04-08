import { z } from 'zod';
import {
  TaskStatus,
  Priority,
  TaskProgressActionType,
  ResistanceReason,
  PainComparison,
} from '@/config/constants';

export const TaskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.nativeEnum(Priority),
  dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  estimatedMinutes: z.number().int().positive().optional(),
  status: z.nativeEnum(TaskStatus),
  fearLevel: z.number().int().min(1).max(10).optional(),
  resistanceLevel: z.number().int().min(1).max(10).optional(),
  clarityLevel: z.number().int().min(1).max(10).optional(),
  painLevel: z.number().int().min(1).max(10).optional(),
  startDifficulty: z.number().int().min(1).max(10).optional(),
  resistanceReasons: z.array(z.nativeEnum(ResistanceReason)),
  resistanceNote: z.string().optional(),
  contactStep: z.string().optional(),
  tinyStep: z.string().optional(),
  normalStep: z.string().optional(),
});

export const CreateTaskSchema = TaskSchema.omit({});
export const UpdateTaskSchema = TaskSchema.partial();

export const TaskProgressLogSchema = z.object({
  actionType: z.nativeEnum(TaskProgressActionType),
  note: z.string().optional(),
});

export const DailyReviewSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  mostAvoidedTaskId: z.string().optional(),
  didStart: z.boolean().optional(),
  blockingReason: z.string().optional(),
  effectiveStarter: z.string().optional(),
  actualPainLevel: z.number().int().min(1).max(10).optional(),
  painComparison: z.nativeEnum(PainComparison).optional(),
  note: z.string().optional(),
});

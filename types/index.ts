import { Task, TaskProgressLog, DailyReview, PointTransaction } from '@prisma/client';

export type TaskWithRelations = Task & {
  progressLogs: TaskProgressLog[];
};

export type DailyReviewWithRelations = DailyReview & {
  mostAvoidedTask?: Task | null;
};

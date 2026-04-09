import { Task, TaskProgressLog, DailyReview, PointTransaction, Project } from '@prisma/client';
import { z } from 'zod';
import { TaskSchema, CreateTaskSchema, UpdateTaskSchema, CreateProjectSchema, UpdateProjectSchema, TaskProgressLogSchema, DailyReviewSchema } from '@/validators';

export type TaskWithRelations = Task & {
  progressLogs: TaskProgressLog[];
};

export type DailyReviewWithRelations = DailyReview & {
  mostAvoidedTask?: Task | null;
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
};

export type ProjectWithStats = Project & {
  progress: number;
  highResistanceCount: number;
  recommendedNode: Task | null;
};

export type ActionState = {
  error?: string | null;
  success?: boolean;
  [key: string]: unknown;
};

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type TaskProgressLogInput = z.infer<typeof TaskProgressLogSchema>;
export type DailyReviewInput = z.infer<typeof DailyReviewSchema>;

export interface TaskFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialData?: TaskWithRelations | null;
}

export interface ProjectFormProps {
  initialData?: Project | null;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}

export interface ProjectCardProps {
  project: ProjectWithStats;
}

export interface TaskListWithFiltersProps {
  tasks: TaskWithRelations[];
}

export interface DailyReviewClientProps {
  todayReview: DailyReviewWithRelations | null;
  reviewHistory: DailyReviewWithRelations[];
  tasks: Task[];
}

export interface TaskEditClientProps {
  task: TaskWithRelations;
}

export interface ProjectEditClientProps {
  project: Project;
}

export interface ProjectDetailClientProps {
  project: ProjectWithStats & {
    tasks: Task[];
    highResistanceNodes: Task[];
    recommendedNode: Task | null;
  };
}

export interface ProjectBoardClientProps {
  project: ProjectWithStats & {
    tasks: Task[];
    highResistanceNodes: Task[];
    recommendedNode: Task | null;
    tree: any[];
  };
}

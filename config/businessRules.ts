import { Task, TaskProgressLog, Project } from '@prisma/client';
import { TaskStatus, TaskProgressActionType, ProjectStatus, Priority } from './constants';

export function isHighResistanceTask(task: Task): boolean {
  return (
    task.status === TaskStatus.AVOIDED ||
    (task.fearLevel !== null && task.fearLevel >= 7) ||
    (task.resistanceLevel !== null && task.resistanceLevel >= 7) ||
    (task.startDifficulty !== null && task.startDifficulty >= 7)
  );
}

export function getRecommendedAction(
  task: Task,
  progressLogs: TaskProgressLog[]
): 'contactStep' | 'tinyStep' | 'normalStep' {
  if (task.status === TaskStatus.AVOIDED) {
    return 'contactStep';
  }

  const hasHighResistance =
    (task.fearLevel !== null && task.fearLevel >= 7) ||
    (task.resistanceLevel !== null && task.resistanceLevel >= 7);

  if (hasHighResistance) {
    return 'tinyStep';
  }

  const touchedCount = progressLogs.filter(
    (log) => log.actionType === TaskProgressActionType.TOUCHED
  ).length;
  const hasProgress = progressLogs.some((log) =>
    [
      TaskProgressActionType.STARTED_TINY_STEP,
      TaskProgressActionType.MADE_PROGRESS,
      TaskProgressActionType.COMPLETED,
    ].includes(log.actionType as TaskProgressActionType)
  );

  if (touchedCount >= 2 && !hasProgress) {
    return 'tinyStep';
  }

  return 'normalStep';
}

export function parseResistanceReasons(reasonsStr: string | null): string[] {
  if (!reasonsStr) return [];
  try {
    return JSON.parse(reasonsStr);
  } catch {
    return [];
  }
}

export function stringifyResistanceReasons(reasons: string[]): string {
  return JSON.stringify(reasons);
}

// ------------------------------
// 新增 Project 相关业务规则
// ------------------------------

interface TaskWithSubTasks extends Task {
  subTasks: TaskWithSubTasks[];
}

export function calculateNodeProgress(task: Task & { subTasks: Task[] }): number {
  if (task.subTasks.length === 0) {
    return task.status === TaskStatus.DONE ? 100 : 0;
  }

  const completedCount = task.subTasks.filter(t => t.status === TaskStatus.DONE).length;
  return Math.round((completedCount / task.subTasks.length) * 100);
}

export function calculateProjectProgress(
  project: Project & { tasks: Task[] },
  tasksWithSubTasks: TaskWithSubTasks[]
): number {
  if (project.progressMode === 'MANUAL' && project.manualProgress !== null) {
    return project.manualProgress;
  }

  const topLevelTasks = tasksWithSubTasks.filter(t => !t.parentTaskId);
  if (topLevelTasks.length === 0) return 0;

  const totalProgress = topLevelTasks.reduce((sum, task) => {
    return sum + calculateNodeProgress(task);
  }, 0);

  return Math.round(totalProgress / topLevelTasks.length);
}

export function getRecommendedNode(tasks: Task[]): Task | null {
  const incompleteTasks = tasks.filter(t =>
    t.status !== TaskStatus.DONE &&
    t.status !== TaskStatus.ARCHIVED
  );

  if (incompleteTasks.length === 0) return null;

  return incompleteTasks.sort((a, b) => {
    const priorityA = a.priority === Priority.HIGH ? 3 : a.priority === Priority.MEDIUM ? 2 : 1;
    const priorityB = b.priority === Priority.HIGH ? 3 : b.priority === Priority.MEDIUM ? 2 : 1;
    if (priorityB !== priorityA) return priorityB - priorityA;

    if (a.status === TaskStatus.AVOIDED && b.status !== TaskStatus.AVOIDED) return -1;
    if (b.status === TaskStatus.AVOIDED && a.status !== TaskStatus.AVOIDED) return 1;

    const aHighRes = isHighResistanceTask(a);
    const bHighRes = isHighResistanceTask(b);
    if (aHighRes && !bHighRes) return -1;
    if (bHighRes && !aHighRes) return 1;

    return 0;
  })[0];
}

export function buildTaskTree(tasks: Task[]): TaskWithSubTasks[] {
  const taskMap = new Map<string, TaskWithSubTasks>();
  const roots: TaskWithSubTasks[] = [];

  tasks.forEach(task => {
    taskMap.set(task.id, { ...task, subTasks: [] });
  });

  tasks.forEach(task => {
    const node = taskMap.get(task.id)!;
    if (task.parentTaskId) {
      const parent = taskMap.get(task.parentTaskId);
      if (parent) {
        parent.subTasks.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots.sort((a, b) => a.orderIndex - b.orderIndex);
}

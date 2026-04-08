import { Task, TaskProgressLog } from '@prisma/client';
import { TaskStatus, TaskProgressActionType } from './constants';

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

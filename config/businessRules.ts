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

export interface TaskTreeNode {
  id: string;
  title: string;
  taskType: string;
  status: string;
  fearLevel: number | null;
  resistanceLevel: number | null;
  startDifficulty: number | null;
  isHighResistance: boolean;
  contactStep: string | null;
  tinyStep: string | null;
  normalStep: string | null;
  isExpanded: boolean;
  children: TaskTreeNode[];
  subTasksCount: number;
  orderIndex: number;
}

export function buildTaskTree(tasks: Task[]): TaskTreeNode[] {
  const taskMap = new Map<string, TaskTreeNode>();
  const roots: TaskTreeNode[] = [];

  tasks.forEach(task => {
    taskMap.set(task.id, {
      id: task.id,
      title: task.title,
      taskType: task.taskType,
      status: task.status,
      fearLevel: task.fearLevel,
      resistanceLevel: task.resistanceLevel,
      startDifficulty: task.startDifficulty,
      isHighResistance: isHighResistanceTask(task),
      contactStep: task.contactStep,
      tinyStep: task.tinyStep,
      normalStep: task.normalStep,
      isExpanded: task.isExpanded,
      children: [],
      subTasksCount: 0,
      orderIndex: task.orderIndex,
    });
  });

  tasks.forEach(task => {
    const node = taskMap.get(task.id)!;
    if (task.parentTaskId) {
      const parent = taskMap.get(task.parentTaskId);
      if (parent) {
        parent.children.push(node);
        parent.subTasksCount++;
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  const sortNodesByOrder = (nodes: TaskTreeNode[]): TaskTreeNode[] => {
    const sorted = [...nodes].sort((a, b) => a.orderIndex - b.orderIndex);
    sorted.forEach(node => {
      if (node.children.length > 0) {
        node.children = sortNodesByOrder(node.children);
      }
    });
    return sorted;
  };

  return sortNodesByOrder(roots);
}

export function getRecommendedActionForNode(node: TaskTreeNode): 'contactStep' | 'tinyStep' | 'normalStep' {
  if (node.status === 'AVOIDED') {
    return 'contactStep';
  }
  if (node.isHighResistance) {
    return 'tinyStep';
  }
  return 'normalStep';
}

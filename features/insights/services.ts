import { prisma } from '@/lib/prisma';
import { TaskStatus, TaskProgressActionType } from '@/config/constants';
import { parseResistanceReasons } from '@/config/businessRules';

export async function getInsightsSummary() {
  const allTasks = await prisma.task.findMany();
  const allProgressLogs = await prisma.taskProgressLog.findMany();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weekProgressLogs = allProgressLogs.filter(
    (log) => new Date(log.createdAt) >= oneWeekAgo
  );

  const actionCounts: Record<string, number> = {
    [TaskProgressActionType.TOUCHED]: 0,
    [TaskProgressActionType.STARTED_TINY_STEP]: 0,
    [TaskProgressActionType.MADE_PROGRESS]: 0,
    [TaskProgressActionType.COMPLETED]: 0,
    [TaskProgressActionType.REACTIVATED]: 0,
  };

  weekProgressLogs.forEach((log) => {
    actionCounts[log.actionType] = (actionCounts[log.actionType] || 0) + 1;
  });

  const resistanceReasonsCount: Record<string, number> = {};
  allTasks.forEach((task) => {
    const reasons = parseResistanceReasons(task.resistanceReasons);
    reasons.forEach((reason) => {
      resistanceReasonsCount[reason] = (resistanceReasonsCount[reason] || 0) + 1;
    });
  });

  const topResistanceReasons = Object.entries(resistanceReasonsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return {
    totalTasks: allTasks.length,
    avoidedTasks: allTasks.filter((t) => t.status === TaskStatus.AVOIDED).length,
    highResistanceTasks: allTasks.filter((t) => 
      t.fearLevel !== null && t.fearLevel >= 7 ||
      t.resistanceLevel !== null && t.resistanceLevel >= 7 ||
      t.startDifficulty !== null && t.startDifficulty >= 7
    ).length,
    weekActionCounts: actionCounts,
    topResistanceReasons,
  };
}

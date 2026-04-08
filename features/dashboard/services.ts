import { prisma } from '@/lib/prisma';
import { isHighResistanceTask, parseResistanceReasons } from '@/config/businessRules';
import { TaskStatus } from '@/config/constants';

export async function getDashboardSummary() {
  const allTasks = await prisma.task.findMany({
    include: { progressLogs: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayProgressLogs = await prisma.taskProgressLog.findMany({
    where: { createdAt: { gte: today } },
    include: { task: true },
  });

  const highResistanceTasks = allTasks.filter(isHighResistanceTask);
  const avoidedTasks = allTasks.filter((t) => t.status === TaskStatus.AVOIDED);
  const activeTasks = allTasks.filter(
    (t) => t.status !== TaskStatus.DONE && t.status !== TaskStatus.ARCHIVED
  );

  const resistanceReasonsCount: Record<string, number> = {};
  allTasks.forEach((task) => {
    const reasons = parseResistanceReasons(task.resistanceReasons);
    reasons.forEach((reason) => {
      resistanceReasonsCount[reason] = (resistanceReasonsCount[reason] || 0) + 1;
    });
  });

  const topResistanceReasons = Object.entries(resistanceReasonsCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return {
    totalTasks: allTasks.length,
    activeTasks: activeTasks.length,
    highResistanceTasks: highResistanceTasks.length,
    avoidedTasks: avoidedTasks.length,
    todayProgressCount: todayProgressLogs.length,
    topResistanceReasons,
    todayProgressLogs,
    keyTasks: activeTasks.slice(0, 3),
    avoidedTasksList: avoidedTasks.slice(0, 3),
  };
}

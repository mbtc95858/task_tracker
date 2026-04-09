import { prisma } from '@/lib/prisma';
import { TaskStatus, TaskProgressActionType, PointSourceType } from '@/config/constants';
import { POINT_RULES } from '@/config/pointRules';

export async function logTaskProgress(
  taskId: string,
  actionType: string,
  note?: string
) {
  return await prisma.$transaction(async (tx) => {
    const progressLog = await tx.taskProgressLog.create({
      data: {
        taskId,
        actionType,
        note,
      },
    });

    let pointSourceType: PointSourceType | null = null;

    switch (actionType) {
      case TaskProgressActionType.TOUCHED:
        pointSourceType = PointSourceType.TASK_TOUCHED;
        break;
      case TaskProgressActionType.STARTED_TINY_STEP:
        pointSourceType = PointSourceType.TINY_STEP_DONE;
        break;
      case TaskProgressActionType.MADE_PROGRESS:
        pointSourceType = PointSourceType.TASK_PROGRESS;
        break;
      case TaskProgressActionType.COMPLETED:
        pointSourceType = PointSourceType.TASK_COMPLETED;
        await tx.task.update({
          where: { id: taskId },
          data: { status: TaskStatus.DONE },
        });
        break;
      case TaskProgressActionType.REACTIVATED:
        pointSourceType = PointSourceType.TASK_REACTIVATED;
        await tx.task.update({
          where: { id: taskId },
          data: { status: TaskStatus.ACTIVE },
        });
        break;
    }

    if (pointSourceType) {
      const rule = POINT_RULES[pointSourceType];
      await tx.pointTransaction.create({
        data: {
          sourceType: pointSourceType,
          sourceId: progressLog.id,
          delta: rule.delta,
          reason: rule.reason,
        },
      });
    }

    return progressLog;
  });
}

export async function getTaskProgress(taskId: string) {
  return prisma.taskProgressLog.findMany({
    where: { taskId },
    orderBy: { createdAt: 'desc' },
  });
}

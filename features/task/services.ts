import { prisma } from '@/lib/prisma';
import { Task, TaskProgressLog } from '@prisma/client';
import { parseResistanceReasons, stringifyResistanceReasons } from '@/config/businessRules';

export async function getTasks(filter?: {
  status?: string;
  priority?: string;
  search?: string;
}) {
  const where: any = {};
  
  if (filter?.status) {
    where.status = filter.status;
  }
  if (filter?.priority) {
    where.priority = filter.priority;
  }
  if (filter?.search) {
    where.title = {
      contains: filter.search,
    };
  }

  return prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { progressLogs: true },
  });
}

export async function getTask(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: { progressLogs: true },
  });
}

export async function createTask(data: any) {
  const taskData = {
    ...data,
    resistanceReasons: stringifyResistanceReasons(data.resistanceReasons || []),
  };

  const task = await prisma.task.create({ data: taskData });

  await prisma.pointTransaction.create({
    data: {
      sourceType: 'TASK_CREATED',
      sourceId: task.id,
      delta: 1,
      reason: '创建任务',
    },
  });

  return task;
}

export async function updateTask(id: string, data: any) {
  const updateData = { ...data };
  if (data.resistanceReasons !== undefined) {
    updateData.resistanceReasons = stringifyResistanceReasons(data.resistanceReasons);
  }

  return prisma.task.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}

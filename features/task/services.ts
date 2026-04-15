import { prisma } from '@/lib/prisma';
import { Task, TaskProgressLog } from '@prisma/client';
import { parseResistanceReasons, stringifyResistanceReasons } from '@/config/businessRules';
import { CreateTaskInput, UpdateTaskInput } from '@/types';
import { PointSourceType } from '@/config/constants';
import { POINT_RULES } from '@/config/pointRules';

interface TaskFilter {
  status?: string;
  priority?: string;
  search?: string;
}

export async function getTasks(filter?: TaskFilter) {
  const where: {
    status?: string;
    priority?: string;
    title?: { contains: string };
  } = {};
  
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

export async function createTask(data: CreateTaskInput) {
  return await prisma.$transaction(async (tx) => {
    const taskData: any = {
      ...data,
      resistanceReasons: stringifyResistanceReasons(data.resistanceReasons || []),
    };

    const task = await tx.task.create({ data: taskData });

    const rule = POINT_RULES[PointSourceType.TASK_CREATED];
    await tx.pointTransaction.create({
      data: {
        sourceType: PointSourceType.TASK_CREATED,
        sourceId: task.id,
        delta: rule.delta,
        reason: rule.reason,
      },
    });

    return task;
  });
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  return await prisma.$transaction(async (tx) => {
    const currentTask = await tx.task.findUnique({
      where: { id },
    });

    const updateData: any = { ...data };
    if (data.resistanceReasons !== undefined) {
      updateData.resistanceReasons = stringifyResistanceReasons(data.resistanceReasons);
    }

    const task = await tx.task.update({
      where: { id },
      data: updateData,
    });

    const hasResistanceFields = (data.fearLevel !== undefined || 
      data.resistanceLevel !== undefined || 
      data.clarityLevel !== undefined || 
      data.painLevel !== undefined || 
      data.startDifficulty !== undefined || 
      (data.resistanceReasons !== undefined && data.resistanceReasons.length > 0) ||
      data.resistanceNote !== undefined);

    const hadNoResistanceData = !currentTask?.fearLevel && 
      !currentTask?.resistanceLevel && 
      !currentTask?.clarityLevel && 
      !currentTask?.painLevel && 
      !currentTask?.startDifficulty && 
      (!currentTask?.resistanceReasons || parseResistanceReasons(currentTask.resistanceReasons).length === 0) &&
      !currentTask?.resistanceNote;

    if (hasResistanceFields && hadNoResistanceData) {
      const existingPoints = await tx.pointTransaction.findFirst({
        where: {
          sourceType: PointSourceType.RESISTANCE_FILLED,
          sourceId: id,
        },
      });

      if (!existingPoints) {
        const rule = POINT_RULES[PointSourceType.RESISTANCE_FILLED];
        await tx.pointTransaction.create({
          data: {
            sourceType: PointSourceType.RESISTANCE_FILLED,
            sourceId: id,
            delta: rule.delta,
            reason: rule.reason,
          },
        });
      }
    }

    return task;
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}

export async function getTasksByDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.task.findMany({
    where: {
      dueDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

export async function getProjectsByDate(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.project.findMany({
    where: {
      dueDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

export async function getAllActiveDays() {
  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        not: null,
      },
    },
    select: {
      dueDate: true,
    },
  });

  const projects = await prisma.project.findMany({
    where: {
      dueDate: {
        not: null,
      },
    },
    select: {
      dueDate: true,
    },
  });

  const activeDays = new Set<string>();
  
  [...tasks, ...projects].forEach((item) => {
    if (item.dueDate) {
      const date = new Date(item.dueDate);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      activeDays.add(dateStr);
    }
  });

  return activeDays;
}

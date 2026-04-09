import { prisma } from '@/lib/prisma';
import { isHighResistanceTask, buildTaskTree } from '@/config/businessRules';
import { ProjectWithStats } from '@/types';

export async function getProjects(): Promise<ProjectWithStats[]> {
  const projects = await prisma.project.findMany({
    orderBy: { orderIndex: 'asc' },
    include: { tasks: true },
  });

  return projects.map((project) => {
    const tasks = project.tasks;
    const highResistanceCount = tasks.filter((t) => isHighResistanceTask(t)).length;
    const recommendedNode = tasks.find((t) =>
      t.status !== 'DONE' && t.status !== 'ARCHIVED'
    ) || null;

    const completedCount = tasks.filter((t) => t.status === 'DONE').length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return {
      ...project,
      progress,
      highResistanceCount,
      recommendedNode,
    };
  });
}

export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: { 
      tasks: { include: { progressLogs: true } },
    },
  });

  if (!project) return null;

  const tasks = project.tasks;
  const highResistanceNodes = tasks.filter((t) => isHighResistanceTask(t));
  const recommendedNode = tasks.find((t) =>
    t.status !== 'DONE' && t.status !== 'ARCHIVED'
  ) || null;

  const completedCount = tasks.filter((t) => t.status === 'DONE').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const tree = buildTaskTree(tasks);

  return {
    ...project,
    progress,
    tasks,
    tree,
    highResistanceNodes,
    recommendedNode,
  };
}

export async function createProject(data: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  progressMode?: string;
  manualProgress?: number;
}) {
  const maxOrder = await prisma.project.aggregate({
    _max: { orderIndex: true },
  });

  return prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || 'ACTIVE',
      priority: data.priority || 'MEDIUM',
      dueDate: data.dueDate,
      progressMode: data.progressMode || 'AUTO',
      manualProgress: data.manualProgress,
      orderIndex: (maxOrder._max.orderIndex || 0) + 1,
    },
  });
}

export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: Date;
    progressMode: string;
    manualProgress: number;
    orderIndex: number;
  }>
) {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

'use server';

import { revalidatePath } from 'next/cache';
import { CreateProjectTaskSchema } from '@/validators';
import { createTask, updateTask, deleteTask } from '../task/services';
import { stringifyResistanceReasons } from '@/config/businessRules';

export async function createProjectTaskAction(prevState: any, formData: FormData) {
  const projectId = formData.get('projectId') as string;

  if (!projectId) {
    return { error: '缺少项目ID' };
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      category: formData.get('category') as string || undefined,
      priority: (formData.get('priority') as string) || 'MEDIUM',
      dueDate: formData.get('dueDate') as string || undefined,
      estimatedMinutes: formData.get('estimatedMinutes') ? parseInt(formData.get('estimatedMinutes') as string) : undefined,
      status: (formData.get('status') as string) || 'INBOX',
      fearLevel: formData.get('fearLevel') ? parseInt(formData.get('fearLevel') as string) : undefined,
      resistanceLevel: formData.get('resistanceLevel') ? parseInt(formData.get('resistanceLevel') as string) : undefined,
      clarityLevel: formData.get('clarityLevel') ? parseInt(formData.get('clarityLevel') as string) : undefined,
      painLevel: formData.get('painLevel') ? parseInt(formData.get('painLevel') as string) : undefined,
      startDifficulty: formData.get('startDifficulty') ? parseInt(formData.get('startDifficulty') as string) : undefined,
      resistanceReasons: formData.getAll('resistanceReasons') as string[],
      resistanceNote: formData.get('resistanceNote') as string || undefined,
      contactStep: formData.get('contactStep') as string || undefined,
      tinyStep: formData.get('tinyStep') as string || undefined,
      normalStep: formData.get('normalStep') as string || undefined,
      projectId,
      parentTaskId: (formData.get('parentTaskId') as string) || undefined,
      taskType: (formData.get('taskType') as string) || 'TASK',
    };

    const validated = CreateProjectTaskSchema.safeParse(rawData);
    if (!validated.success) {
      return { error: validated.error.errors[0].message };
    }

    const taskData = {
      ...validated.data,
      resistanceReasons: stringifyResistanceReasons(validated.data.resistanceReasons || []),
    };

    await createTask(taskData);
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/board`);
    return { error: null };
  } catch (error) {
    return { error: '创建任务失败' };
  }
}

export async function updateProjectTaskStatusAction(
  taskId: string,
  status: string,
  projectId: string
) {
  try {
    await updateTask(taskId, { status });
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/board`);
    revalidatePath(`/tasks/${taskId}`);
    return { error: null };
  } catch (error) {
    return { error: '更新任务状态失败' };
  }
}

export async function deleteProjectTaskAction(taskId: string, projectId: string) {
  try {
    await deleteTask(taskId);
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/board`);
    return { error: null };
  } catch (error) {
    return { error: '删除任务失败' };
  }
}

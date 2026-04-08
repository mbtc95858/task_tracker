'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateTaskSchema, UpdateTaskSchema } from '@/validators';
import * as taskServices from './services';

export async function createTaskAction(formData: FormData) {
  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    category: formData.get('category') as string || undefined,
    priority: formData.get('priority') as string,
    dueDate: formData.get('dueDate') as string || undefined,
    estimatedMinutes: formData.get('estimatedMinutes') ? parseInt(formData.get('estimatedMinutes') as string) : undefined,
    status: formData.get('status') as string,
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
  };

  const validated = CreateTaskSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: '输入校验失败' };
  }

  const task = await taskServices.createTask(validated.data);
  revalidatePath('/tasks');
  redirect(`/tasks/${task.id}`);
}

export async function updateTaskAction(prevState: any, formData: FormData) {
  const id = formData.get('id') as string;
  
  if (!id) {
    return { error: '缺少任务ID' };
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    category: formData.get('category') as string || undefined,
    priority: formData.get('priority') as string,
    dueDate: formData.get('dueDate') as string || undefined,
    estimatedMinutes: formData.get('estimatedMinutes') ? parseInt(formData.get('estimatedMinutes') as string) : undefined,
    status: formData.get('status') as string,
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
  };

  const validated = UpdateTaskSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: '输入校验失败' };
  }

  await taskServices.updateTask(id, validated.data);
  revalidatePath('/tasks');
  revalidatePath(`/tasks/${id}`);
  redirect(`/tasks/${id}`);
}

export async function deleteTaskAction(id: string) {
  await taskServices.deleteTask(id);
  revalidatePath('/tasks');
  redirect('/tasks');
}

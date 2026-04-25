'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateTaskSchema, UpdateTaskSchema } from '@/validators';
import * as taskServices from './services';

function parseNumber(value: FormDataEntryValue | null) {
  if (!value || value === '') return undefined;
  const num = parseInt(value as string);
  return isNaN(num) ? undefined : num;
}

export async function createTaskAction(prevState: any, formData: FormData) {
  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || undefined,
    category: formData.get('category') as string || undefined,
    priority: formData.get('priority') as string || 'MEDIUM',
    dueDate: formData.get('dueDate') as string || undefined,
    estimatedMinutes: parseNumber(formData.get('estimatedMinutes')),
    status: formData.get('status') as string || 'INBOX',
    fearLevel: parseNumber(formData.get('fearLevel')),
    resistanceLevel: parseNumber(formData.get('resistanceLevel')),
    clarityLevel: parseNumber(formData.get('clarityLevel')),
    painLevel: parseNumber(formData.get('painLevel')),
    startDifficulty: parseNumber(formData.get('startDifficulty')),
    resistanceReasons: formData.getAll('resistanceReasons') as string[],
    resistanceNote: formData.get('resistanceNote') as string || undefined,
    contactStep: formData.get('contactStep') as string || undefined,
    tinyStep: formData.get('tinyStep') as string || undefined,
    normalStep: formData.get('normalStep') as string || undefined,
    projectId: formData.get('projectId') as string || undefined,
  };

  const validated = CreateTaskSchema.safeParse(rawData);
  if (!validated.success) {
    console.error('Validation errors:', validated.error);
    return { error: '输入校验失败，请确保已填写任务标题' };
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
    priority: formData.get('priority') as string || undefined,
    dueDate: formData.get('dueDate') as string || undefined,
    estimatedMinutes: parseNumber(formData.get('estimatedMinutes')),
    status: formData.get('status') as string || undefined,
    fearLevel: parseNumber(formData.get('fearLevel')),
    resistanceLevel: parseNumber(formData.get('resistanceLevel')),
    clarityLevel: parseNumber(formData.get('clarityLevel')),
    painLevel: parseNumber(formData.get('painLevel')),
    startDifficulty: parseNumber(formData.get('startDifficulty')),
    resistanceReasons: formData.getAll('resistanceReasons') as string[],
    resistanceNote: formData.get('resistanceNote') as string || undefined,
    contactStep: formData.get('contactStep') as string || undefined,
    tinyStep: formData.get('tinyStep') as string || undefined,
    normalStep: formData.get('normalStep') as string || undefined,
    projectId: formData.get('projectId') as string || undefined,
  };

  const validated = UpdateTaskSchema.safeParse(rawData);
  if (!validated.success) {
    console.error('Validation errors:', validated.error);
    return { error: '输入校验失败，请确保已填写任务标题' };
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

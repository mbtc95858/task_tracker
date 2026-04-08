'use server';

import { revalidatePath } from 'next/cache';
import { TaskProgressLogSchema } from '@/validators';
import * as progressServices from './services';

export async function logTaskProgressAction(taskId: string, formData: FormData) {
  const rawData = {
    actionType: formData.get('actionType') as string,
    note: formData.get('note') as string || undefined,
  };

  const validated = TaskProgressLogSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: '输入校验失败' };
  }

  await progressServices.logTaskProgress(taskId, validated.data.actionType, validated.data.note);
  revalidatePath('/tasks');
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath('/dashboard');
  return { success: true };
}

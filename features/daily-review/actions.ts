'use server';

import { revalidatePath } from 'next/cache';
import { DailyReviewSchema } from '@/validators';
import * as reviewServices from './services';

type ActionState = { error?: string } | { success?: boolean };

export async function saveReviewAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = {
    date: new Date().toISOString(),
    mostAvoidedTaskId: formData.get('mostAvoidedTaskId') as string || undefined,
    didStart: formData.get('didStart') === 'on',
    blockingReason: formData.get('blockingReason') as string || undefined,
    effectiveStarter: formData.get('effectiveStarter') as string || undefined,
    actualPainLevel: formData.get('actualPainLevel')
      ? parseInt(formData.get('actualPainLevel') as string)
      : undefined,
    painComparison: formData.get('painComparison') as string || undefined,
    note: formData.get('note') as string || undefined,
  };

  const validated = DailyReviewSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: '输入校验失败' };
  }

  await reviewServices.saveReview(validated.data);
  revalidatePath('/daily-review');
  revalidatePath('/dashboard');
  return { success: true };
}

'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskProgressActionType } from '@/config/constants';
import { TASK_PROGRESS_ACTION_LABELS } from '@/config/constants';

interface ProgressLogFormProps {
  taskId: string;
  action: (prevState: any, formData: FormData) => Promise<any>;
}

export function ProgressLogForm({ taskId, action }: ProgressLogFormProps) {
  const [state, formAction] = useFormState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          动作类型
        </label>
        <Select name="actionType" required>
          {Object.entries(TaskProgressActionType).map(([key, value]) => (
            <option key={key} value={value}>
              {TASK_PROGRESS_ACTION_LABELS[value as keyof typeof TASK_PROGRESS_ACTION_LABELS]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          备注
        </label>
        <Textarea name="note" rows={2} placeholder="记录一下今天的感受..." />
      </div>

      {state?.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <Button type="submit">打卡</Button>
    </form>
  );
}

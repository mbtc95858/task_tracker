'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  ProjectStatus,
  Priority,
  ProgressMode,
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  PROGRESS_MODE_LABELS,
} from '@/config/constants';

interface ProjectFormProps {
  initialData?: any;
  action: any;
  submitLabel: string;
}

export function ProjectForm({ initialData, action, submitLabel }: ProjectFormProps) {
  const [state, formAction] = useFormState(action, { error: null });
  const data = initialData || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标题 *
            </label>
            <Input name="title" defaultValue={data.title || ''} placeholder="项目标题" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              描述
            </label>
            <Textarea
              name="description"
              defaultValue={data.description || ''}
              rows={3}
              placeholder="项目描述"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                状态
              </label>
              <Select name="status" defaultValue={data.status || ProjectStatus.ACTIVE}>
                {Object.entries(ProjectStatus).map(([key, value]) => (
                  <option key={key} value={value}>
                    {PROJECT_STATUS_LABELS[value as keyof typeof PROJECT_STATUS_LABELS]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                优先级
              </label>
              <Select name="priority" defaultValue={data.priority || Priority.MEDIUM}>
                {Object.entries(Priority).map(([key, value]) => (
                  <option key={key} value={value}>
                    {PRIORITY_LABELS[value as keyof typeof PRIORITY_LABELS]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                截止日期
              </label>
              <Input
                type="date"
                name="dueDate"
                defaultValue={data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                进度模式
              </label>
              <Select name="progressMode" defaultValue={data.progressMode || ProgressMode.AUTO}>
                {Object.entries(ProgressMode).map(([key, value]) => (
                  <option key={key} value={value}>
                    {PROGRESS_MODE_LABELS[value as keyof typeof PROGRESS_MODE_LABELS]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {data.progressMode === ProgressMode.MANUAL && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                手动进度 (0-100)
              </label>
              <Input
                type="number"
                name="manualProgress"
                min="0"
                max="100"
                defaultValue={data.manualProgress || ''}
              />
            </div>
          )}

          {state?.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <Button type="submit">{submitLabel}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

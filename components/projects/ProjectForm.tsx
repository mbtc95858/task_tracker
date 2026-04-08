'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  PROGRESS_MODE_LABELS,
  ProjectStatus,
  Priority,
  ProgressMode,
} from '@/config/constants';

const PROJECT_STATUS_VALUES = Object.values(ProjectStatus) as string[];
const PRIORITY_VALUES = Object.values(Priority) as string[];
const PROGRESS_MODE_VALUES = Object.values(ProgressMode) as string[];

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    dueDate?: string | Date | null;
    progressMode?: string;
    manualProgress?: number | null;
  };
  action: (prevState: any, formData: FormData) => Promise<any>;
  submitLabel: string;
}

export function ProjectForm({ initialData, action, submitLabel }: ProjectFormProps) {
  const [state, formAction] = useFormState(action, { error: null });
  const data = initialData || {};
  const [progressMode, setProgressMode] = useState(data.progressMode || 'AUTO');

  const dueDateStr = data.dueDate
    ? (typeof data.dueDate === 'string' ? data.dueDate.split('T')[0] : new Date(data.dueDate).toISOString().split('T')[0])
    : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitLabel}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {data.id && <input type="hidden" name="id" value={data.id} />}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标题 *
            </label>
            <Input name="title" defaultValue={data.title || ''} placeholder="项目标题" required />
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
              <Select name="status" defaultValue={data.status || 'ACTIVE'}>
                {PROJECT_STATUS_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {PROJECT_STATUS_LABELS[value as ProjectStatus]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                优先级
              </label>
              <Select name="priority" defaultValue={data.priority || 'MEDIUM'}>
                {PRIORITY_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {PRIORITY_LABELS[value as Priority]}
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
                defaultValue={dueDateStr}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                进度模式
              </label>
              <Select
                name="progressMode"
                defaultValue={progressMode}
                onChange={(e) => setProgressMode(e.target.value)}
              >
                {PROGRESS_MODE_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {PROGRESS_MODE_LABELS[value as ProgressMode]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {progressMode === 'MANUAL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                手动进度 (0-100)
              </label>
              <Input
                type="number"
                name="manualProgress"
                min="0"
                max="100"
                defaultValue={data.manualProgress ?? ''}
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

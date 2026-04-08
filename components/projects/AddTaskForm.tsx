'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  TASK_STATUS_LABELS,
  PRIORITY_LABELS,
  TASK_TYPE_LABELS,
  TaskStatus,
  Priority,
  TaskType,
} from '@/config/constants';
import { createProjectTaskAction } from '@/features/project/taskActions';

const TASK_STATUS_FOR_CREATE = [TaskStatus.INBOX, TaskStatus.PLANNED, TaskStatus.ACTIVE] as string[];
const PRIORITY_VALUES = Object.values(Priority) as string[];
const TASK_TYPE_VALUES = [TaskType.PROJECT_PHASE, TaskType.MILESTONE, TaskType.TASK, TaskType.SUBTASK] as string[];

interface AddTaskFormProps {
  projectId: string;
  parentTaskId?: string;
  defaultTaskType?: string;
  onClose?: () => void;
}

export function AddTaskForm({ projectId, parentTaskId, defaultTaskType, onClose }: AddTaskFormProps) {
  const [state, formAction] = useFormState(createProjectTaskAction, { error: null });
  const [showFull, setShowFull] = useState(false);

  return (
    <Card className="border-dashed border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">添加任务</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="projectId" value={projectId} />
          {parentTaskId && <input type="hidden" name="parentTaskId" value={parentTaskId} />}

          <div>
            <Input
              name="title"
              placeholder="任务标题"
              required
            />
          </div>

          {showFull && (
            <>
              <div>
                <Textarea
                  name="description"
                  placeholder="任务描述（可选）"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    类型
                  </label>
                  <Select name="taskType" defaultValue={defaultTaskType || 'TASK'}>
                    {TASK_TYPE_VALUES.map((value) => (
                      <option key={value} value={value}>
                        {TASK_TYPE_LABELS[value as TaskType]}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    状态
                  </label>
                  <Select name="status" defaultValue="INBOX">
                    {TASK_STATUS_FOR_CREATE.map((value) => (
                      <option key={value} value={value}>
                        {TASK_STATUS_LABELS[value as TaskStatus]}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    优先级
                  </label>
                  <Select name="priority" defaultValue="MEDIUM">
                    {PRIORITY_VALUES.map((value) => (
                      <option key={value} value={value}>
                        {PRIORITY_LABELS[value as Priority]}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    接触动作
                  </label>
                  <Input name="contactStep" placeholder="最轻量的接触方式" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    最小动作
                  </label>
                  <Input name="tinyStep" placeholder="最小的可执行步骤" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  推进动作
                </label>
                <Input name="normalStep" placeholder="标准推进步骤" />
              </div>
            </>
          )}

          {state?.error && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-sm">
              {state.error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              添加
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFull(!showFull)}
            >
              {showFull ? '收起' : '更多选项'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

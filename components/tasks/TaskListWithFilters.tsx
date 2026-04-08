'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '@/config/constants';
import { isHighResistanceTask } from '@/config/businessRules';
import { parseResistanceReasons } from '@/config/businessRules';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  fearLevel: number | null;
  resistanceLevel: number | null;
  clarityLevel: number | null;
  painLevel: number | null;
  startDifficulty: number | null;
  resistanceReasons: string | null;
  contactStep: string | null;
  tinyStep: string | null;
  normalStep: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskListWithFiltersProps {
  tasks: Task[];
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: '全部状态' },
  { value: 'INBOX', label: '收件箱' },
  { value: 'PLANNED', label: '已计划' },
  { value: 'ACTIVE', label: '进行中' },
  { value: 'BLOCKED', label: '受阻' },
  { value: 'AVOIDED', label: '已回避' },
  { value: 'DONE', label: '已完成' },
  { value: 'ARCHIVED', label: '已归档' },
];

const FILTER_OPTIONS = [
  { value: 'ALL', label: '全部' },
  { value: 'HIGH_RESISTANCE', label: '挑战性任务' },
  { value: 'AVOIDED', label: '已回避任务' },
];

export function TaskListWithFilters({ tasks }: TaskListWithFiltersProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [resistanceFilter, setResistanceFilter] = useState<string>('ALL');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'ALL' && task.status !== statusFilter) {
      return false;
    }

    if (resistanceFilter === 'HIGH_RESISTANCE' && !isHighResistanceTask(task)) {
      return false;
    }

    if (resistanceFilter === 'AVOIDED' && task.status !== 'AVOIDED') {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">状态：</span>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  statusFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">筛选：</span>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setResistanceFilter(option.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  resistanceFilter === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">没有找到匹配的任务</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">尝试调整筛选条件</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => {
            const isHighResistance = isHighResistanceTask(task);
            const resistanceReasons = parseResistanceReasons(task.resistanceReasons);

            return (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <Card className={`hover:shadow-md transition-shadow cursor-pointer ${isHighResistance ? 'border-l-4 border-l-indigo-400' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            状态: {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            优先级: {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
                          </span>
                          {isHighResistance && (
                            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                              💪 挑战性
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">
            显示 {filteredTasks.length} / {tasks.length} 个任务
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { TASK_STATUS_LABELS, TASK_CATEGORY_LABELS, TASK_CATEGORY_COLORS, TaskStatus } from '@/config/constants';
import { isHighResistanceTask } from '@/config/businessRules';

interface TaskWithProgress {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  priority: string;
  status: string;
  dueDate?: Date | null;
  createdAt: Date;
  fearLevel?: number | null;
  resistanceLevel?: number | null;
  startDifficulty?: number | null;
  progressLogs: any[];
}

interface TaskGanttChartProps {
  tasks: TaskWithProgress[];
  selectedCategory?: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  [TaskStatus.INBOX]: 'bg-gray-300',
  [TaskStatus.PLANNED]: 'bg-blue-300',
  [TaskStatus.ACTIVE]: 'bg-blue-500',
  [TaskStatus.BLOCKED]: 'bg-orange-500',
  [TaskStatus.AVOIDED]: 'bg-red-400',
  [TaskStatus.DONE]: 'bg-green-500',
  [TaskStatus.ARCHIVED]: 'bg-gray-400',
};

export function TaskGanttChart({ tasks, selectedCategory }: TaskGanttChartProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { dateRange, tasksWithDates } = useMemo(() => {
    const today = new Date();
    const filteredTasks = selectedCategory 
      ? tasks.filter(task => task.category === selectedCategory)
      : tasks;
      
    const tasksWithValidDates = filteredTasks
      .filter(task => task.dueDate || task.createdAt)
      .map(task => {
        const startDate = task.createdAt;
        const endDate = task.dueDate || new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return { ...task, startDate, endDate };
      });

    if (tasksWithValidDates.length === 0) {
      return { dateRange: [], tasksWithDates: [] };
    }

    const allDates = tasksWithValidDates.flatMap(task => [task.startDate, task.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));

    const rangeStart = new Date(minDate);
    rangeStart.setDate(rangeStart.getDate() - 3);
    
    const rangeEnd = new Date(maxDate);
    rangeEnd.setDate(rangeEnd.getDate() + 3);

    const dateRange: Date[] = [];
    let current = new Date(rangeStart);
    while (current <= rangeEnd) {
      dateRange.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { dateRange, tasksWithDates: tasksWithValidDates };
  }, [tasks, selectedCategory]);

  const getDatePosition = (date: Date) => {
    if (dateRange.length === 0) return 0;
    const index = dateRange.findIndex(d => 
      d.toDateString() === date.toDateString()
    );
    return index >= 0 ? index : 0;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ← 上周
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            今天
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            下周 →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <div className="w-64 flex-shrink-0 p-3 font-semibold text-gray-900 dark:text-white">
              任务
            </div>
            <div className="flex-1 flex">
              {dateRange.map((date, index) => (
                <div
                  key={index}
                  className={`flex-1 min-w-[80px] p-2 text-center text-sm border-l border-gray-200 dark:border-gray-700 ${
                    isToday(date)
                      ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-300'
                      : isWeekend(date)
                      ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div>{formatDate(date)}</div>
                  <div className="text-xs">
                    {date.toLocaleDateString('zh-CN', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {tasksWithDates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              暂无带日期的任务
            </div>
          ) : (
            tasksWithDates.map((task) => {
              const isHighResistance = isHighResistanceTask(task);
              const category = task.category as keyof typeof TASK_CATEGORY_COLORS;
              const startIndex = getDatePosition(task.startDate);
              const endIndex = getDatePosition(task.endDate);
              const duration = Math.max(endIndex - startIndex + 1, 1);
              
              return (
                <div
                  key={task.id}
                  className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                >
                  <div className="w-64 flex-shrink-0 p-3">
                    <Link href={`/tasks/${task.id}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            STATUS_COLORS[task.status as keyof typeof STATUS_COLORS] || 'bg-gray-300'
                          }`} />
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {task.title}
                          </span>
                          {isHighResistance && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              高阻力
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                          </span>
                          {category && TASK_CATEGORY_LABELS[category] && (
                            <span className={`text-xs px-2 py-0.5 rounded ${TASK_CATEGORY_COLORS[category]}`}>
                              {TASK_CATEGORY_LABELS[category]}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1 flex relative">
                    {dateRange.map((date, index) => (
                      <div
                        key={index}
                        className={`flex-1 min-w-[80px] border-l border-gray-100 dark:border-gray-800 ${
                          isToday(date) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                        } ${isWeekend(date) ? 'bg-gray-50/30 dark:bg-gray-800/20' : ''}`}
                      />
                    ))}
                    
                    <div
                      className={`absolute top-2 bottom-2 rounded-md ${
                        STATUS_COLORS[task.status as keyof typeof STATUS_COLORS] || 'bg-gray-300'
                      } ${task.status === TaskStatus.DONE ? 'opacity-70' : ''}`}
                      style={{
                        left: `${(startIndex / dateRange.length) * 100}%`,
                        width: `${(duration / dateRange.length) * 100}%`,
                        transform: duration === 1 ? 'translateX(25%) scaleX(0.5)' : 'none',
                      }}
                    >
                      <Link href={`/tasks/${task.id}`} className="block h-full w-full" />
                    </div>

                    {isToday(currentDate) && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{
                          left: `${(dateRange.findIndex(d => d.toDateString() === currentDate.toDateString()) / dateRange.length) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">状态图例：</span>
            {Object.entries(TASK_STATUS_LABELS).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded ${
                  STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-300'
                }`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

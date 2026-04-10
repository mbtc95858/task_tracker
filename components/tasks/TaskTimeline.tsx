'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { TASK_STATUS_LABELS, TASK_CATEGORY_LABELS, TASK_CATEGORY_COLORS } from '@/config/constants';
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

interface TaskTimelineProps {
  tasks: TaskWithProgress[];
  selectedCategory?: string | null;
}

export function TaskTimeline({ tasks, selectedCategory }: TaskTimelineProps) {
  const filteredTasks = selectedCategory 
    ? tasks.filter(task => task.category === selectedCategory)
    : tasks;

  const tasksByDate = filteredTasks.reduce((acc, task) => {
    const date = task.dueDate || task.createdAt;
    const dateKey = date.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {} as Record<string, TaskWithProgress[]>);

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
    }
  };

  return (
    <div className="space-y-8">
      {sortedDates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">暂无任务</p>
        </div>
      ) : (
        sortedDates.map((dateKey) => (
          <div key={dateKey} className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {new Date(dateKey).getDate()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatDate(dateKey)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tasksByDate[dateKey].length} 个任务
                </p>
              </div>
            </div>

            <div className="ml-6 pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
              {tasksByDate[dateKey].map((task, index) => {
                const isHighResistance = isHighResistanceTask(task);
                const category = task.category as keyof typeof TASK_CATEGORY_COLORS;
                
                return (
                  <div key={task.id} className="relative">
                    <div className="absolute -left-10 top-4 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600" />
                    
                    <Link href={`/tasks/${task.id}`}>
                      <Card className={`hover:shadow-md transition-all cursor-pointer ${
                        isHighResistance ? 'ring-2 ring-red-200 dark:ring-red-900/30' : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                                {isHighResistance && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                    高阻力
                                  </span>
                                )}
                              </div>
                              
                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                  {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                                </span>
                                {category && TASK_CATEGORY_LABELS[category] && (
                                  <span className={`text-xs px-2 py-1 rounded ${TASK_CATEGORY_COLORS[category]}`}>
                                    {TASK_CATEGORY_LABELS[category]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

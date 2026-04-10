'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TaskTimeline } from '@/components/tasks/TaskTimeline';
import { TaskFilterButtons } from '@/components/tasks/TaskFilterButtons';
import { TASK_CATEGORY_LABELS } from '@/config/constants';

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

interface TimelineClientProps {
  tasks: TaskWithProgress[];
}

export function TimelineClient({ tasks }: TimelineClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))] as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">时间轴</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            按时间查看你的任务
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>+ 新建任务</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>分类筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskFilterButtons
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </CardContent>
      </Card>

      <TaskTimeline tasks={tasks} selectedCategory={selectedCategory} />
    </div>
  );
}

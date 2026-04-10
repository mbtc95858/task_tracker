import { Suspense } from 'react';
import { getTasks } from '@/features/task/services';
import { TimelineClient } from './TimelineClient';

export default async function TimelinePage() {
  const tasks = await getTasks();
  const tasksWithDates = tasks.filter(task => task.dueDate || task.createdAt);

  return (
    <Suspense fallback={<div className="text-center py-12">加载中...</div>}>
      <TimelineClient tasks={tasksWithDates} />
    </Suspense>
  );
}

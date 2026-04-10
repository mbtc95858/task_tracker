import { Suspense } from 'react';
import { getTasks } from '@/features/task/services';
import { TimetableClient } from './TimetableClient';

export default async function TimetablePage() {
  const tasks = await getTasks();
  const tasksWithDates = tasks.filter(task => task.dueDate || task.createdAt);

  return (
    <Suspense fallback={<div className="text-center py-12">加载中...</div>}>
      <TimetableClient tasks={tasksWithDates} />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { getTasks } from '@/features/task/services';
import { TaskListWithFilters } from '@/components/tasks/TaskListWithFilters';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">任务列表</h1>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <TaskListWithFilters tasks={tasks} />
      </Suspense>
    </div>
  );
}

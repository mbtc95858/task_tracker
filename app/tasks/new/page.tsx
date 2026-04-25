import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { TaskForm } from '@/components/tasks/TaskForm';
import { createTaskAction } from '@/features/task/actions';
import { getProjects } from '@/features/project/services';

export default async function CreateTaskPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/tasks" 
          className="inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 px-5 py-2.5 text-base text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80"
        >
          ← 返回
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">创建任务</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TaskForm action={createTaskAction} projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
}

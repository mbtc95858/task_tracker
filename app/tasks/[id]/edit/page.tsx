import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TaskForm } from '@/components/tasks/TaskForm';
import { getTask } from '@/features/task/services';
import { updateTaskAction, deleteTaskAction } from '@/features/task/actions';
import { notFound } from 'next/navigation';

interface EditTaskPageProps {
  params: { id: string };
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const task = await getTask(params.id);

  if (!task) {
    notFound();
  }

  const updateActionWithId = updateTaskAction.bind(null, params.id);
  const deleteActionWithId = deleteTaskAction.bind(null, params.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/tasks/${params.id}`}>
            <Button variant="ghost">← 返回</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">编辑任务</h1>
        </div>
        <form action={deleteActionWithId}>
          <Button type="submit" variant="danger" onClick={(e) => {
            if (!confirm('确定要删除这个任务吗？')) {
              e.preventDefault();
            }
          }}>
            删除任务
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TaskForm action={updateActionWithId} initialData={task} />
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { TaskForm } from '@/components/tasks/TaskForm';
import { updateTaskAction, deleteTaskAction } from '@/features/task/actions';

interface TaskEditClientProps {
  task: any;
}

export function TaskEditClient({ task }: TaskEditClientProps) {
  const params = useParams();

  const handleDelete = async () => {
    if (confirm('确定要删除这个任务吗？')) {
      await deleteTaskAction(params.id as string);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/tasks/${params.id}`}>
            <Button variant="ghost">← 返回</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">编辑任务</h1>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          删除任务
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TaskForm action={updateTaskAction} initialData={{ ...task, id: params.id }} />
        </CardContent>
      </Card>
    </div>
  );
}

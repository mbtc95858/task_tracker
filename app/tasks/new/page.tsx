'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TaskForm } from '@/components/tasks/TaskForm';
import { createTaskAction } from '@/features/task/actions';

export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleBack = () => {
    if (from === 'home') {
      router.push('/');
    } else {
      router.push('/tasks');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack}>
          ← 返回
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">创建任务</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TaskForm action={createTaskAction} />
        </CardContent>
      </Card>
    </div>
  );
}

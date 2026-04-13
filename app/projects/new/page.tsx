'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { createProjectAction } from '@/features/project/actions';

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleBack = () => {
    if (from === 'home') {
      router.push('/');
    } else {
      router.push('/projects');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack}>
          ← 返回
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">新建项目</h1>
      </div>

      <ProjectForm action={createProjectAction} submitLabel="创建项目" />
    </div>
  );
}

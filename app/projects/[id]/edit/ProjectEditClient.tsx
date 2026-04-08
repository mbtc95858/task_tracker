'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { updateProjectAction, deleteProjectAction } from '@/features/project/actions';

interface ProjectEditClientProps {
  project: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    dueDate?: string | Date | null;
    progressMode: string;
    manualProgress?: number | null;
  };
}

export function ProjectEditClient({ project }: ProjectEditClientProps) {
  const params = useParams();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteProjectAction(params.id as string);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${params.id}`}>
            <Button variant="ghost">← 返回</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">编辑项目</h1>
        </div>
        <Button
          variant={confirmDelete ? 'danger' : 'ghost'}
          onClick={handleDelete}
          onBlur={() => setConfirmDelete(false)}
          className={confirmDelete ? '' : 'text-red-500 hover:text-red-600'}
        >
          {confirmDelete ? '确认删除?' : '删除项目'}
        </Button>
      </div>

      <ProjectForm
        initialData={{ ...project, id: params.id as string }}
        action={updateProjectAction}
        submitLabel="更新项目"
      />
    </div>
  );
}

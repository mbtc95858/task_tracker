'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { getProject } from '@/features/project/services';
import { updateProjectAction, deleteProjectAction } from '@/features/project/actions';
import { useEffect, useState } from 'react';

export default function EditProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      const data = await getProject(params.id as string);
      if (!data) {
        notFound();
      }
      setProject(data);
      setLoading(false);
    }
    loadProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <p>加载中...</p>
      </div>
    );
  }

  const boundUpdateAction = updateProjectAction.bind(null, params.id as string);
  const handleDelete = async () => {
    if (confirm('确定要删除这个项目吗？')) {
      await deleteProjectAction(params.id as string);
    }
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
        <Button variant="destructive" onClick={handleDelete}>
          删除项目
        </Button>
      </div>

      <ProjectForm
        initialData={project}
        action={boundUpdateAction}
        submitLabel="更新项目"
      />
    </div>
  );
}

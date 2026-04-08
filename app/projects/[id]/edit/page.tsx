import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getProject } from '@/features/project/services';
import { ProjectEditClient } from './ProjectEditClient';

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const serializedProject = {
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    priority: project.priority,
    dueDate: project.dueDate,
    progressMode: project.progressMode,
    manualProgress: project.manualProgress,
  };

  return <ProjectEditClient project={serializedProject} />;
}

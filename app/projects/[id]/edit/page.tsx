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

  return <ProjectEditClient project={project} />;
}

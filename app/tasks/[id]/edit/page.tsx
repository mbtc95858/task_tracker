import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { getTask } from '@/features/task/services';
import { getProjects } from '@/features/project/services';
import { TaskEditClient } from './TaskEditClient';

interface EditTaskPageProps {
  params: { id: string };
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const task = await getTask(params.id);
  const projects = await getProjects();

  if (!task) {
    notFound();
  }

  return <TaskEditClient task={task} projects={projects} />;
}

import { notFound } from 'next/navigation';
import { getProject } from '@/features/project/services';
import { ProjectDetailClient } from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
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
    progress: project.progress,
    tasks: project.tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      taskType: t.taskType,
      fearLevel: t.fearLevel,
      resistanceLevel: t.resistanceLevel,
      startDifficulty: t.startDifficulty,
      parentTaskId: t.parentTaskId,
    })),
    highResistanceNodes: project.highResistanceNodes.map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      taskType: t.taskType,
      fearLevel: t.fearLevel,
      resistanceLevel: t.resistanceLevel,
      startDifficulty: t.startDifficulty,
      parentTaskId: t.parentTaskId,
    })),
    recommendedNode: project.recommendedNode
      ? {
          id: project.recommendedNode.id,
          title: project.recommendedNode.title,
          status: project.recommendedNode.status,
        }
      : null,
  };

  return <ProjectDetailClient project={serializedProject} />;
}

import { notFound } from 'next/navigation';
import { getProject } from '@/features/project/services';
import { ProjectBoardClient } from './ProjectBoardClient';

interface ProjectBoardPageProps {
  params: { id: string };
}

export default async function ProjectBoardPage({ params }: ProjectBoardPageProps) {
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
    })),
    highResistanceNodes: project.highResistanceNodes.map((t: any) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    })),
    recommendedNode: project.recommendedNode
      ? {
          id: project.recommendedNode.id,
          title: project.recommendedNode.title,
          status: project.recommendedNode.status,
        }
      : null,
    tree: project.tree,
  };

  return <ProjectBoardClient project={serializedProject} />;
}

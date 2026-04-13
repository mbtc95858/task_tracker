import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects } from '@/features/project/services';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">项目</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            把长任务拆解成可开始的路径
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">还没有项目</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            请到首页创建第一个项目
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

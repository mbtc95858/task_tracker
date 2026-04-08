import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProjectTreeBoard } from '@/components/project-board/ProjectTreeBoard';
import { getProject } from '@/features/project/services';
import {
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/config/constants';

interface ProjectBoardPageProps {
  params: { id: string };
}

export default async function ProjectBoardPage({ params }: ProjectBoardPageProps) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${project.id}`}>
            <Button variant="ghost">← 返回</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS]}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                优先级: {PRIORITY_LABELS[project.priority as keyof typeof PRIORITY_LABELS]}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                进度: {project.progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">节点统计</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">总节点</span>
              <span className="font-medium">{project.tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">已完成</span>
              <span className="font-medium text-green-600">
                {project.tasks.filter((t: any) => t.status === 'DONE').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-600 dark:text-indigo-400">挑战性节点</span>
              <span className="font-medium text-indigo-600">
                {project.highResistanceNodes.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">推荐下一步</CardTitle>
          </CardHeader>
          <CardContent>
            {project.recommendedNode ? (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.recommendedNode.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {TASK_STATUS_LABELS[project.recommendedNode.status as keyof typeof TASK_STATUS_LABELS]}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">暂无可推荐节点</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">提示</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              点击 ▶ 展开子节点，点击任务查看详情。
              高阻力节点会高亮显示，推荐动作会突出展示。
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目看板</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectTreeBoard tree={project.tree} projectTitle={project.title} />
        </CardContent>
      </Card>
    </div>
  );
}

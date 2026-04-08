import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getProject } from '@/features/project/services';
import {
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/config/constants';

interface ProjectDetailPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const topLevelTasks = project.tasks.filter((t: any) => !t.parentTaskId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
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
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/board`}>
            <Button variant="secondary">看板</Button>
          </Link>
          <Link href={`/projects/${project.id}/edit`}>
            <Button variant="secondary">编辑</Button>
          </Link>
        </div>
      </div>

      {project.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">整体进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {project.progress}%
            </div>
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>顶层节点</CardTitle>
        </CardHeader>
        <CardContent>
          {topLevelTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">还没有顶层节点</p>
          ) : (
            <div className="space-y-3">
              {topLevelTasks.map((task: any) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

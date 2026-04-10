import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects } from '@/features/project/services';
import { getTasks } from '@/features/task/services';
import { TaskListWithFilters } from '@/components/tasks/TaskListWithFilters';
import { TASK_STATUS_LABELS } from '@/config/constants';

export default async function HomePage() {
  const [projects, tasks] = await Promise.all([
    getProjects(),
    getTasks(),
  ]);

  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">任务追踪</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            今天不要求完成，只要求接触
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/tasks/new">
          <Button className="w-full h-16 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            + 快速创建任务
          </Button>
        </Link>
        <Link href="/projects/new">
          <Button className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            + 快速创建项目
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近项目</CardTitle>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  查看全部 →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">还没有项目</p>
                <Link href="/projects/new" className="mt-3 inline-block">
                  <Button variant="ghost">创建第一个项目</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div key={project.id}>
                    <Link href={`/projects/${project.id}`}>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">进度</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              挑战性节点: {project.highResistanceCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近任务</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm">
                  查看全部 →
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">还没有任务</p>
                <Link href="/tasks/new" className="mt-3 inline-block">
                  <Button variant="ghost">创建第一个任务</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                              {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                            </span>
                            {task.priority && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                优先级: {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Link href="/dashboard">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">今日面板</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">查看今日重点</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tasks">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">全部任务</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">管理任务列表</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/projects">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">全部项目</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">管理项目列表</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/daily-review">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">每日复盘</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">总结今日进展</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

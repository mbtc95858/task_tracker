'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { AddTaskForm } from '@/components/projects/AddTaskForm';
import {
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  ProjectStatus,
} from '@/config/constants';
import { deleteProjectAction, updateProjectStatusAction } from '@/features/project/actions';
import { updateProjectTaskStatusAction, deleteProjectTaskAction } from '@/features/project/taskActions';

interface TaskItem {
  id: string;
  title: string;
  status: string;
  taskType: string;
  fearLevel: number | null;
  resistanceLevel: number | null;
  startDifficulty: number | null;
  parentTaskId: string | null;
}

interface ProjectDetailClientProps {
  project: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    progress: number;
    tasks: TaskItem[];
    highResistanceNodes: TaskItem[];
    recommendedNode: {
      id: string;
      title: string;
      status: string;
    } | null;
  };
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddTask, setShowAddTask] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const topLevelTasks = project.tasks.filter((t) => !t.parentTaskId);

  const handleStatusChange = async (status: string) => {
    await updateProjectStatusAction(project.id, status);
    startTransition(() => { router.refresh(); });
  };

  const handleDeleteProject = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteProjectAction(project.id);
  };

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    await updateProjectTaskStatusAction(taskId, status, project.id);
    startTransition(() => { router.refresh(); });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      await deleteProjectTaskAction(taskId, project.id);
      startTransition(() => { router.refresh(); });
    }
  };

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
              <Select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm py-1 px-2 w-auto"
              >
                {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
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
          <Button
            variant={confirmDelete ? 'danger' : 'ghost'}
            onClick={handleDeleteProject}
            onBlur={() => setConfirmDelete(false)}
            className={confirmDelete ? '' : 'text-red-500 hover:text-red-600'}
          >
            {confirmDelete ? '确认删除?' : '删除'}
          </Button>
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
                {project.tasks.filter((t) => t.status === 'DONE').length}
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
          <div className="flex items-center justify-between">
            <CardTitle>顶层节点</CardTitle>
            <Button size="sm" onClick={() => setShowAddTask(!showAddTask)}>
              {showAddTask ? '取消' : '+ 添加任务'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddTask && (
            <div className="mb-4">
              <AddTaskForm
                projectId={project.id}
                defaultTaskType="PROJECT_PHASE"
                onClose={() => setShowAddTask(false)}
              />
            </div>
          )}

          {topLevelTasks.length === 0 && !showAddTask ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">还没有顶层节点</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                点击上方添加任务开始拆解项目
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topLevelTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate"
                      >
                        {task.title}
                      </Link>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 shrink-0">
                        {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <Select
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                        className="text-xs py-1 px-2 w-auto"
                      >
                        {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

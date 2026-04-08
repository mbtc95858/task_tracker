'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { ProjectTreeBoard } from '@/components/project-board/ProjectTreeBoard';
import { AddTaskForm } from '@/components/projects/AddTaskForm';
import {
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  ProjectStatus,
} from '@/config/constants';
import { updateProjectStatusAction, deleteProjectAction } from '@/features/project/actions';

interface ProjectBoardClientProps {
  project: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    progress: number;
    tasks: {
      id: string;
      title: string;
      status: string;
    }[];
    highResistanceNodes: {
      id: string;
      title: string;
      status: string;
    }[];
    recommendedNode: {
      id: string;
      title: string;
      status: string;
    } | null;
    tree: any[];
  };
}

export function ProjectBoardClient({ project }: ProjectBoardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddTask, setShowAddTask] = useState(false);

  const handleStatusChange = async (status: string) => {
    await updateProjectStatusAction(project.id, status);
    startTransition(() => { router.refresh(); });
  };

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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                进度: {project.progress}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/edit`}>
            <Button variant="secondary">编辑项目</Button>
          </Link>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">提示</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              鼠标悬停在节点上可以看到操作按钮。
              点击 ▶ 展开子节点，点击任务查看详情。
              高阻力节点会高亮显示，推荐动作会突出展示。
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>项目看板</CardTitle>
            <Button size="sm" onClick={() => setShowAddTask(!showAddTask)}>
              {showAddTask ? '取消' : '+ 添加顶层节点'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddTask && (
            <div className="mb-6">
              <AddTaskForm
                projectId={project.id}
                defaultTaskType="PROJECT_PHASE"
                onClose={() => setShowAddTask(false)}
              />
            </div>
          )}
          <ProjectTreeBoard tree={project.tree} projectTitle={project.title} projectId={project.id} />
        </CardContent>
      </Card>
    </div>
  );
}

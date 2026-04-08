'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS, ProjectStatus } from '@/config/constants';
import { deleteProjectAction, updateProjectStatusAction } from '@/features/project/actions';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    priority: string;
    progress: number;
    highResistanceCount: number;
    recommendedNode?: {
      id: string;
      title: string;
      status: string;
    } | null;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('确定要删除这个项目吗？删除后无法恢复。')) {
      await deleteProjectAction(project.id);
    }
  };

  const handleStatusChange = async (e: React.MouseEvent, status: string) => {
    e.preventDefault();
    e.stopPropagation();
    await updateProjectStatusAction(project.id, status);
    startTransition(() => { router.refresh(); });
  };

  const statusLabel = PROJECT_STATUS_LABELS[project.status as ProjectStatus] || project.status;

  return (
    <Card className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <CardTitle className="text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {project.title}
            </CardTitle>
          </Link>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 ml-2 shrink-0">
            {statusLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.description && (
          <Link href={`/projects/${project.id}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          </Link>
        )}

        <Link href={`/projects/${project.id}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">进度</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </Link>

        <Link href={`/projects/${project.id}`}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              挑战性节点: {project.highResistanceCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              优先级: {PRIORITY_LABELS[project.priority as keyof typeof PRIORITY_LABELS]}
            </span>
          </div>
        </Link>

        {project.recommendedNode && (
          <Link href={`/projects/${project.id}`}>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-800 dark:text-green-200 font-medium">推荐下一步</p>
              <p className="text-sm text-green-900 dark:text-green-100 mt-1">
                {project.recommendedNode.title}
              </p>
            </div>
          </Link>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Link href={`/projects/${project.id}/edit`}>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              编辑
            </Button>
          </Link>
          <Link href={`/projects/${project.id}/board`}>
            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
              看板
            </Button>
          </Link>
          {project.status !== 'COMPLETED' && project.status !== 'ARCHIVED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStatusChange(e, 'COMPLETED')}
              className="text-green-600 hover:text-green-700"
            >
              完成
            </Button>
          )}
          {project.status === 'COMPLETED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleStatusChange(e, 'ACTIVE')}
              className="text-blue-600 hover:text-blue-700"
            >
              重启
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
          >
            删除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

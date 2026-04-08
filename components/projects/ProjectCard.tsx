import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from '@/config/constants';

interface ProjectCardProps {
  project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS]}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {project.description}
            </p>
          )}

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

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              高阻力节点: {project.highResistanceCount}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              优先级: {PRIORITY_LABELS[project.priority as keyof typeof PRIORITY_LABELS]}
            </span>
          </div>

          {project.recommendedNode && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-800 dark:text-green-200 font-medium">推荐下一步</p>
              <p className="text-sm text-green-900 dark:text-green-100 mt-1">
                {project.recommendedNode.title}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getProject } from '@/features/project/services';

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
      <div className="flex items-center gap-4">
        <Link href={`/projects/${project.id}`}>
          <Button variant="ghost">← 返回</Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">项目看板</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目看板（开发中）</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            横向树状看板正在开发中，敬请期待...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

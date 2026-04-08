import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">今日面板</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>欢迎使用 Task Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              这个工具帮助你面对、拆解和启动重要但容易逃避的任务。
            </p>
            <div className="flex gap-4">
              <Link href="/tasks">
                <Button>查看任务</Button>
              </Link>
              <Link href="/tasks/new">
                <Button variant="secondary">创建任务</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>下一步</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              功能开发中...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

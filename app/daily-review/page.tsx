import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DailyReviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">每日复盘</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>今日复盘</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}

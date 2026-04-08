import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">洞察</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>统计分析</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}

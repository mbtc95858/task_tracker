import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getInsightsSummary } from '@/features/insights/services';
import { TASK_PROGRESS_ACTION_LABELS, RESISTANCE_REASON_LABELS } from '@/config/constants';

export default async function InsightsPage() {
  const insights = await getInsightsSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">洞察</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          看见你的阻力模式
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{insights.totalTasks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">总任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{insights.avoidedTasks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">回避任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{insights.highResistanceTasks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">高阻力任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Object.values(insights.weekActionCounts).reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">本周推进</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>本周推进记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(insights.weekActionCounts).map(([actionType, count]) => (
                <div key={actionType} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    {TASK_PROGRESS_ACTION_LABELS[actionType as keyof typeof TASK_PROGRESS_ACTION_LABELS]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((count / Math.max(...Object.values(insights.weekActionCounts), 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {insights.topResistanceReasons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>最常见阻力原因</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.topResistanceReasons.map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {RESISTANCE_REASON_LABELS[reason as keyof typeof RESISTANCE_REASON_LABELS]}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min((count / Math.max(...insights.topResistanceReasons.map(([, c]) => c), 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

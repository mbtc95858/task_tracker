import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getDashboardSummary } from '@/features/dashboard/services';
import { getPointsSummary } from '@/features/points/services';
import { TASK_STATUS_LABELS, TASK_PROGRESS_ACTION_LABELS, RESISTANCE_REASON_LABELS } from '@/config/constants';
import { getRecommendedAction, parseResistanceReasons } from '@/config/businessRules';

export default async function DashboardPage() {
  const dashboard = await getDashboardSummary();
  const points = await getPointsSummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">今日面板</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            今天不要求完成，只要求接触
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">当前积分</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{points.totalPoints}</p>
          <p className="text-sm text-green-600 dark:text-green-400">+{points.todayPoints} 今日</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {dashboard.keyTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>今日重点任务</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard.keyTasks.map((task) => {
                const recommendedAction = getRecommendedAction(task, task.progressLogs);
                return (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                        </span>
                      </div>
                      {task[recommendedAction] && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-xs text-blue-800 dark:text-blue-200">推荐下一步</p>
                          <p className="text-sm text-blue-900 dark:text-blue-100">{task[recommendedAction]}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
              <Link href="/tasks">
                <Button variant="ghost" className="w-full">查看全部任务</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {dashboard.avoidedTasksList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>容易回避的任务</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                回避被记录下来，不代表失败，代表你看见了阻力
              </p>
              {dashboard.avoidedTasksList.map((task) => (
                <Link key={task.id} href={`/tasks/${task.id}`}>
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    {task.contactStep && (
                      <p className="text-sm text-indigo-700 dark:text-indigo-200 mt-1">
                        接触动作：{task.contactStep}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>今日推进</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.todayProgressCount === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">还没有今日推进记录</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">先做一个最小动作就够了</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.todayProgressLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{log.task.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {TASK_PROGRESS_ACTION_LABELS[log.actionType as keyof typeof TASK_PROGRESS_ACTION_LABELS]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {dashboard.topResistanceReasons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>常见阻力原因</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboard.topResistanceReasons.map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {RESISTANCE_REASON_LABELS[reason as keyof typeof RESISTANCE_REASON_LABELS]}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{count} 次</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboard.totalTasks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">总任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboard.activeTasks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{dashboard.highResistanceTasks}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">挑战性</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dashboard.todayProgressCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">今日推进</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

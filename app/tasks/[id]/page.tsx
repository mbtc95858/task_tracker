import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getTask } from '@/features/task/services';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, TASK_PROGRESS_ACTION_LABELS, RESISTANCE_REASON_LABELS } from '@/config/constants';
import { isHighResistanceTask, getRecommendedAction, parseResistanceReasons } from '@/config/businessRules';
import { notFound } from 'next/navigation';

interface TaskDetailPageProps {
  params: { id: string };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const task = await getTask(params.id);

  if (!task) {
    notFound();
  }

  const isHighResistance = isHighResistanceTask(task);
  const recommendedAction = getRecommendedAction(task, task.progressLogs);
  const resistanceReasons = parseResistanceReasons(task.resistanceReasons);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tasks">
            <Button variant="ghost">← 返回</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/tasks/${task.id}/edit`}>
            <Button variant="secondary">编辑</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">状态</span>
              <p className="text-gray-900 dark:text-white">
                {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">优先级</span>
              <p className="text-gray-900 dark:text-white">
                {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
              </p>
            </div>
            {task.description && (
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">描述</span>
                <p className="text-gray-900 dark:text-white">{task.description}</p>
              </div>
            )}
            {isHighResistance && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="text-indigo-700 dark:text-indigo-200 font-medium">💪 这是一个挑战性任务</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>推荐下一步动作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                {recommendedAction === 'contactStep' && '接触动作'}
                {recommendedAction === 'tinyStep' && '最小动作'}
                {recommendedAction === 'normalStep' && '标准动作'}
              </p>
              <p className="text-blue-900 dark:text-blue-100">
                {task[recommendedAction] || '暂无推荐动作'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>阻力分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '恐惧度', value: task.fearLevel },
                { label: '抗拒度', value: task.resistanceLevel },
                { label: '清晰度', value: task.clarityLevel },
                { label: '预估痛苦度', value: task.painLevel },
                { label: '启动难度', value: task.startDifficulty },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                  <p className="text-gray-900 dark:text-white">{item.value || '-'}/10</p>
                </div>
              ))}
            </div>
            {resistanceReasons.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">阻力原因</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {resistanceReasons.map((reason: string) => (
                    <span
                      key={reason}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {RESISTANCE_REASON_LABELS[reason as keyof typeof RESISTANCE_REASON_LABELS]}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {task.resistanceNote && (
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">备注</span>
                <p className="text-gray-900 dark:text-white">{task.resistanceNote}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>三层动作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">接触动作</span>
              <p className="text-gray-900 dark:text-white">{task.contactStep || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">最小动作</span>
              <p className="text-gray-900 dark:text-white">{task.tinyStep || '-'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">标准动作</span>
              <p className="text-gray-900 dark:text-white">{task.normalStep || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>推进记录</CardTitle>
          </CardHeader>
          <CardContent>
            {task.progressLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">暂无推进记录</p>
            ) : (
              <div className="space-y-3">
                {task.progressLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {TASK_PROGRESS_ACTION_LABELS[log.actionType as keyof typeof TASK_PROGRESS_ACTION_LABELS]}
                      </p>
                      {log.note && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.note}</p>}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

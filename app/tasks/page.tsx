import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getTasks } from '@/features/task/services';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '@/config/constants';
import { isHighResistanceTask } from '@/config/businessRules';
import { parseResistanceReasons } from '@/config/businessRules';

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">任务列表</h1>
        <Link href="/tasks/new">
          <Button>创建任务</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => {
          const isHighResistance = isHighResistanceTask(task);
          const resistanceReasons = parseResistanceReasons(task.resistanceReasons);

          return (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${isHighResistance ? 'border-l-4 border-l-orange-500' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          状态: {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS]}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          优先级: {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
                        </span>
                        {isHighResistance && (
                          <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                            ⚠️ 高阻力
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">还没有任务，开始创建第一个吧！</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

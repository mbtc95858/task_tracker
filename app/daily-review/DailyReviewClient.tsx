'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { saveReviewAction } from '@/features/daily-review/actions';
import { PAIN_COMPARISON_LABELS } from '@/config/constants';

const PAIN_COMPARISON_VALUES = ['LIGHTER_THAN_EXPECTED', 'ABOUT_AS_EXPECTED', 'HEAVIER_THAN_EXPECTED'] as const;

interface DailyReviewClientProps {
  todayReview: any;
  reviewHistory: any[];
  tasks: any[];
}

export default function DailyReviewClient({ todayReview, reviewHistory, tasks }: DailyReviewClientProps) {
  const [state, formAction] = useFormState(saveReviewAction, { error: null });
  const initialData = todayReview || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">每日复盘</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          花几分钟回顾今天，看见就是进步
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{todayReview ? '编辑今日复盘' : '今日复盘'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                今天最抗拒的任务
              </label>
              <Select name="mostAvoidedTaskId" defaultValue={initialData.mostAvoidedTaskId || ''}>
                <option value="">-- 选择 --</option>
                {tasks.map((task: any) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="didStart"
                name="didStart"
                defaultChecked={initialData.didStart}
                className="rounded border-gray-300"
              />
              <label htmlFor="didStart" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                今天最终开始了吗？
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                如果没开始，主要原因是什么？
              </label>
              <Textarea
                name="blockingReason"
                defaultValue={initialData.blockingReason || ''}
                rows={2}
                placeholder="是什么阻碍了你？"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                如果开始了，最有效的启动方式是什么？
              </label>
              <Input
                name="effectiveStarter"
                defaultValue={initialData.effectiveStarter || ''}
                placeholder="是什么让你开始的？"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                实际痛苦度（1-10）
              </label>
              <Input
                type="number"
                name="actualPainLevel"
                min="1"
                max="10"
                defaultValue={initialData.actualPainLevel || ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                比预想如何？
              </label>
              <Select name="painComparison" defaultValue={initialData.painComparison || ''}>
                <option value="">-- 选择 --</option>
                {PAIN_COMPARISON_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {PAIN_COMPARISON_LABELS[value as keyof typeof PAIN_COMPARISON_LABELS]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                备注
              </label>
              <Textarea
                name="note"
                defaultValue={initialData.note || ''}
                rows={3}
                placeholder="今天还有什么想说的？"
              />
            </div>

            {state?.error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <Button type="submit">
              {todayReview ? '更新复盘' : '保存复盘'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {reviewHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>历史复盘</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewHistory.map((review: any) => (
              <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                  {review.didStart && (
                    <span className="text-sm text-green-600 dark:text-green-400">✓ 开始了</span>
                  )}
                </div>
                {review.mostAvoidedTask && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    最抗拒：{review.mostAvoidedTask.title}
                  </p>
                )}
                {review.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.note}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

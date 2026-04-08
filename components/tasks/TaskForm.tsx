'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskStatus, Priority, ResistanceReason } from '@/config/constants';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, RESISTANCE_REASON_LABELS } from '@/config/constants';
import { parseResistanceReasons } from '@/config/businessRules';

interface TaskFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: any;
}

export function TaskForm({ action, initialData }: TaskFormProps) {
  const [state, formAction] = useFormState(action, { error: null });
  const initialResistanceReasons = initialData ? parseResistanceReasons(initialData.resistanceReasons) : [];

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">基本信息</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题 *</label>
            <Input name="title" defaultValue={initialData?.title || ''} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</label>
            <Textarea name="description" defaultValue={initialData?.description || ''} rows={3} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类</label>
            <Input name="category" defaultValue={initialData?.category || ''} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">优先级</label>
              <Select name="priority" defaultValue={initialData?.priority || Priority.MEDIUM}>
                {Object.entries(Priority).map(([key, value]) => (
                  <option key={key} value={value}>
                    {PRIORITY_LABELS[value as keyof typeof PRIORITY_LABELS]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">状态</label>
              <Select name="status" defaultValue={initialData?.status || TaskStatus.INBOX}>
                {Object.entries(TaskStatus).map(([key, value]) => (
                  <option key={key} value={value}>
                    {TASK_STATUS_LABELS[value as keyof typeof TASK_STATUS_LABELS]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">截止日期</label>
              <Input type="date" name="dueDate" defaultValue={initialData?.dueDate?.toISOString().split('T')[0] || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">预估时间（分钟）</label>
              <Input type="number" name="estimatedMinutes" defaultValue={initialData?.estimatedMinutes || ''} min="1" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">阻力分析</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'fearLevel', label: '恐惧度', max: 10 },
              { name: 'resistanceLevel', label: '抗拒度', max: 10 },
              { name: 'clarityLevel', label: '清晰度', max: 10 },
              { name: 'painLevel', label: '预估痛苦度', max: 10 },
              { name: 'startDifficulty', label: '启动难度', max: 10 },
            ].map((item) => (
              <div key={item.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {item.label} (1-{item.max})
                </label>
                <Input
                  type="number"
                  name={item.name}
                  defaultValue={initialData?.[item.name] || ''}
                  min="1"
                  max={item.max}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">阻力原因</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ResistanceReason).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="resistanceReasons"
                    value={value}
                    defaultChecked={initialResistanceReasons.includes(value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {RESISTANCE_REASON_LABELS[value as keyof typeof RESISTANCE_REASON_LABELS]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">阻力备注</label>
            <Textarea name="resistanceNote" defaultValue={initialData?.resistanceNote || ''} rows={2} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">三层动作</h3>
          
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">接触动作</label>
              <Input name="contactStep" defaultValue={initialData?.contactStep || ''} placeholder="最简单的接触方式" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最小动作</label>
              <Input name="tinyStep" defaultValue={initialData?.tinyStep || ''} placeholder="最小可执行的一步" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标准动作</label>
              <Input name="normalStep" defaultValue={initialData?.normalStep || ''} placeholder="正常推进的动作" />
            </div>
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
          {state.error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}

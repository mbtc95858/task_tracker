'use client';

import { useFormState } from 'react-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, RESISTANCE_REASON_LABELS, TASK_CATEGORY_LABELS, TASK_CATEGORY_VALUES } from '@/config/constants';
import { parseResistanceReasons } from '@/config/businessRules';

const TASK_STATUS_VALUES = ['INBOX', 'PLANNED', 'ACTIVE', 'BLOCKED', 'AVOIDED', 'DONE', 'ARCHIVED'] as const;
const PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
const RESISTANCE_REASON_VALUES = [
  'DONT_KNOW_HOW_TO_START',
  'TOO_BIG_OR_VAGUE',
  'FEAR_OF_FAILURE',
  'FEAR_OF_RESULT',
  'TOO_ANNOYING',
  'TOO_BORING',
  'TOO_MENTALLY_DEMANDING',
  'TOO_MANY_DECISIONS',
  'FAILED_BEFORE',
  'SHAME_FROM_DELAY',
  'NOT_SURE_IF_WORTH_IT',
  'SOCIAL_PRESSURE',
  'PERFECTIONISM',
  'FEAR_IT_WONT_END',
  'LOW_ENERGY',
] as const;

const STEPS = [
  { id: 1, label: '基本信息', description: '设置任务的核心属性' },
  { id: 2, label: '阻力分析', description: '识别启动阻力，降低心理门槛' },
  { id: 3, label: '三层动作', description: '定义从接触到完成的推进路径' },
];

interface TaskFormProps {
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: any;
}

export function TaskForm({ action, initialData }: TaskFormProps) {
  const [state, formAction] = useFormState(action, { error: null });
  const [currentStep, setCurrentStep] = useState(1);
  const initialResistanceReasons = initialData ? parseResistanceReasons(initialData.resistanceReasons) : [];

  const totalSteps = STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => handleStepClick(step.id)}
            disabled={step.id > currentStep}
            className={`flex flex-col items-center gap-2 transition-all ${
              step.id < currentStep
                ? 'text-indigo-600 dark:text-indigo-400'
                : step.id === currentStep
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step.id < currentStep
                  ? 'bg-indigo-600 text-white'
                  : step.id === currentStep
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-900/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}
            >
              {step.id < currentStep ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </button>
        ))}
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
        {STEPS[currentStep - 1].description}
      </p>
    </div>
  );

  const Step1 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">基本信息</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题 *</label>
        <Input name="title" defaultValue={initialData?.title || ''} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</label>
        <Textarea name="description" defaultValue={initialData?.description || ''} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">分类</label>
          <Select name="category" defaultValue={initialData?.category || ''}>
            <option value="">无分类</option>
            {TASK_CATEGORY_VALUES.map((value) => (
              <option key={value} value={value}>
                {TASK_CATEGORY_LABELS[value as keyof typeof TASK_CATEGORY_LABELS]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">优先级</label>
          <Select name="priority" defaultValue={initialData?.priority || 'MEDIUM'}>
            {PRIORITY_VALUES.map((value) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value as keyof typeof PRIORITY_LABELS]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">状态</label>
          <Select name="status" defaultValue={initialData?.status || 'INBOX'}>
            {TASK_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {TASK_STATUS_LABELS[value as keyof typeof TASK_STATUS_LABELS]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">截止日期</label>
          <Input type="date" name="dueDate" defaultValue={initialData?.dueDate?.toISOString().split('T')[0] || ''} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">预估时间（分钟）</label>
        <Input type="number" name="estimatedMinutes" defaultValue={initialData?.estimatedMinutes || ''} min="1" />
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">阻力分析</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        不要回避阻力，把它识别出来本身就是一种进步。不用填写所有项，只填你感受到的。
      </p>
      
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

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">阻力原因</label>
        <div className="grid grid-cols-2 gap-2">
          {RESISTANCE_REASON_VALUES.map((value) => (
            <label key={value} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">阻力备注</label>
        <Textarea name="resistanceNote" defaultValue={initialData?.resistanceNote || ''} rows={3} placeholder="如果愿意，可以写下更多关于这个阻力的感受..." />
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">三层动作</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        即使任务很大，只要把它拆成这三层，你总能找到可以开始的那一步。
      </p>
      
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300">接触动作</h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">不用开始做，只要接触一下就好</p>
          <Input name="contactStep" defaultValue={initialData?.contactStep || ''} placeholder="例如：打开文档、看一眼标题" />
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">最小动作</h4>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400 mb-2">最小的、无法再分解的一步</p>
          <Input name="tinyStep" defaultValue={initialData?.tinyStep || ''} placeholder="例如：写第一句话、打第一个电话" />
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-300">标准动作</h4>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">正常状态下会做的推进动作</p>
          <Input name="normalStep" defaultValue={initialData?.normalStep || ''} placeholder="例如：完成第一节、整理好资料" />
        </div>
      </div>
    </div>
  );

  return (
    <form action={formAction} className="space-y-6">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      
      <StepIndicator />

      <div className="min-h-[400px]">
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
          {state.error}
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          variant="secondary"
        >
          上一步
        </Button>
        
        {currentStep < totalSteps ? (
          <Button type="button" onClick={handleNext}>
            下一步
          </Button>
        ) : (
          <Button type="submit">
            保存任务
          </Button>
        )}
      </div>
    </form>
  );
}

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import {
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
} from '@/config/constants';
import { TaskTreeNode, getRecommendedActionForNode } from '@/config/businessRules';
import { updateProjectTaskStatusAction, deleteProjectTaskAction, createProjectTaskAction } from '@/features/project/taskActions';

interface TaskTreeNodeCardProps {
  node: TaskTreeNode;
  level: number;
  projectId: string;
  onToggleExpand?: (nodeId: string) => void;
}

export function TaskTreeNodeCard({ node, level, projectId, onToggleExpand }: TaskTreeNodeCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(node.isExpanded);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [childTitle, setChildTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const recommendedAction = getRecommendedActionForNode(node);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (onToggleExpand) {
      onToggleExpand(node.id);
    }
  };

  const handleStatusChange = async (status: string) => {
    await updateProjectTaskStatusAction(node.id, status, projectId);
    startTransition(() => { router.refresh(); });
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await deleteProjectTaskAction(node.id, projectId);
    startTransition(() => { router.refresh(); });
  };

  const handleAddChild = async (formData: FormData) => {
    formData.set('projectId', projectId);
    formData.set('parentTaskId', node.id);
    formData.set('status', 'INBOX');
    formData.set('priority', 'MEDIUM');
    formData.set('taskType', 'SUBTASK');
    await createProjectTaskAction({ error: null }, formData);
    setChildTitle('');
    setShowAddChild(false);
    setExpanded(true);
    startTransition(() => { router.refresh(); });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'AVOIDED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <Card
        className={`
          border-l-4 transition-all
          ${node.isHighResistance ? 'border-l-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-l-gray-300 dark:border-l-gray-600'}
        `}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => { setShowActions(false); setConfirmDelete(false); }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {node.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpand}
                  className="p-1 h-6 w-6"
                >
                  {expanded ? '▼' : '▶'}
                </Button>
              )}
              <CardTitle className="text-base">{node.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded ${getStatusColor(node.status)}`}
              >
                {TASK_STATUS_LABELS[node.status as keyof typeof TASK_STATUS_LABELS]}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {TASK_TYPE_LABELS[node.taskType as keyof typeof TASK_TYPE_LABELS]}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {node.isHighResistance && (
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-sm">
              <p className="text-indigo-700 dark:text-indigo-200 font-medium">💪 挑战性节点</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-1">
                {node.fearLevel && `恐惧: ${node.fearLevel}/10`}
                {node.resistanceLevel && ` · 阻力: ${node.resistanceLevel}/10`}
                {node.startDifficulty && ` · 启动难度: ${node.startDifficulty}/10`}
              </p>
            </div>
          )}

          {recommendedAction && node[recommendedAction] && (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {recommendedAction === 'contactStep' && '推荐：接触动作'}
                {recommendedAction === 'tinyStep' && '推荐：最小动作'}
                {recommendedAction === 'normalStep' && '推荐：推进动作'}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                {node[recommendedAction]}
              </p>
            </div>
          )}

          {showActions && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Select
                value={node.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs py-1 px-2 w-auto"
              >
                {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddChild(!showAddChild)}
              >
                + 子任务
              </Button>
              <Link href={`/tasks/${node.id}`} className="text-blue-600 hover:underline text-xs">
                详情 →
              </Link>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className={confirmDelete ? 'text-red-600' : 'text-red-400 hover:text-red-500'}
              >
                {confirmDelete ? '确认?' : '删除'}
              </Button>
            </div>
          )}

          {!showActions && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              {node.children.length > 0 && (
                <span>{node.children.length} 个子节点</span>
              )}
              <Link href={`/tasks/${node.id}`} className="text-blue-600 hover:underline">
                查看详情 →
              </Link>
            </div>
          )}

          {showAddChild && (
            <form action={handleAddChild} className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Input
                  name="title"
                  placeholder="子任务标题"
                  value={childTitle}
                  onChange={(e) => setChildTitle(e.target.value)}
                  required
                  className="text-sm"
                />
                <Button type="submit" size="sm">添加</Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddChild(false)}
                >
                  取消
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {expanded && node.children.length > 0 && (
        <div className="ml-8 space-y-4">
          {node.children.map((child) => (
            <TaskTreeNodeCard
              key={child.id}
              node={child}
              level={level + 1}
              projectId={projectId}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

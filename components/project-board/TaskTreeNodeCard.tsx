'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
} from '@/config/constants';
import { TaskTreeNode, getRecommendedActionForNode } from '@/config/businessRules';

interface TaskTreeNodeCardProps {
  node: TaskTreeNode;
  level: number;
  onToggleExpand?: (nodeId: string) => void;
}

export function TaskTreeNodeCard({ node, level, onToggleExpand }: TaskTreeNodeCardProps) {
  const [expanded, setExpanded] = useState(node.isExpanded);
  const recommendedAction = getRecommendedActionForNode(node);

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (onToggleExpand) {
      onToggleExpand(node.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'AVOIDED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
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
          ${node.isHighResistance ? 'border-l-orange-400 bg-orange-50/50 dark:bg-orange-900/10' : 'border-l-gray-300 dark:border-l-gray-600'}
        `}
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
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
              <p className="text-orange-800 dark:text-orange-200 font-medium">⚠️ 高阻力节点</p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
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

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            {node.children.length > 0 && (
              <span>{node.children.length} 个子节点</span>
            )}
            <Link href={`/tasks/${node.id}`} className="text-blue-600 hover:underline">
              查看详情 →
            </Link>
          </div>
        </CardContent>
      </Card>

      {expanded && node.children.length > 0 && (
        <div className="ml-8 space-y-4">
          {node.children.map((child) => (
            <TaskTreeNodeCard
              key={child.id}
              node={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

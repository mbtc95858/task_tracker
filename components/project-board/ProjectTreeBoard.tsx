import { TaskTreeNode } from '@/config/businessRules';
import { TaskTreeNodeCard } from './TaskTreeNodeCard';

interface ProjectTreeBoardProps {
  tree: TaskTreeNode[];
  projectTitle: string;
}

export function ProjectTreeBoard({ tree, projectTitle }: ProjectTreeBoardProps) {
  return (
    <div className="space-y-8">
      <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-8">
        {tree.map((rootNode) => (
          <TaskTreeNodeCard key={rootNode.id} node={rootNode} level={0} />
        ))}
      </div>

      {tree.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">这个项目还没有任务</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            先添加一些顶层任务来开始拆解这个项目
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/Button';
import { TASK_CATEGORY_LABELS } from '@/config/constants';

interface TaskFilterButtonsProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function TaskFilterButtons({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: TaskFilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onCategorySelect(null)}
      >
        全部
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onCategorySelect(category)}
        >
          {TASK_CATEGORY_LABELS[category as keyof typeof TASK_CATEGORY_LABELS]}
        </Button>
      ))}
    </div>
  );
}

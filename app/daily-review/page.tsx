import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DailyReviewClient from './DailyReviewClient';
import { getTodayReview, getReviewHistory } from '@/features/daily-review/services';
import { getTasks } from '@/features/task/services';

export default async function DailyReviewPage() {
  const [todayReview, reviewHistory, tasks] = await Promise.all([
    getTodayReview(),
    getReviewHistory(),
    getTasks(),
  ]);

  return (
    <DailyReviewClient
      todayReview={todayReview}
      reviewHistory={reviewHistory}
      tasks={tasks}
    />
  );
}

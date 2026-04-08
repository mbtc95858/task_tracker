import { prisma } from '@/lib/prisma';
import { PointSourceType } from '@/config/constants';
import { POINT_RULES } from '@/config/pointRules';

export async function getTodayReview() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.dailyReview.findFirst({
    where: { date: today },
    include: { mostAvoidedTask: true },
  });
}

export async function getReviewHistory(limit = 14) {
  return prisma.dailyReview.findMany({
    orderBy: { date: 'desc' },
    take: limit,
    include: { mostAvoidedTask: true },
  });
}

export async function saveReview(data: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingReview = await prisma.dailyReview.findFirst({
    where: { date: today },
  });

  let review;
  if (existingReview) {
    review = await prisma.dailyReview.update({
      where: { id: existingReview.id },
      data,
    });
  } else {
    review = await prisma.dailyReview.create({
      data: {
        ...data,
        date: today,
      },
    });

    const rule = POINT_RULES[PointSourceType.DAILY_REVIEW_COMPLETED];
    await prisma.pointTransaction.create({
      data: {
        sourceType: PointSourceType.DAILY_REVIEW_COMPLETED,
        sourceId: review.id,
        delta: rule.delta,
        reason: rule.reason,
      },
    });
  }

  return review;
}

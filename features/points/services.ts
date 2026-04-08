import { prisma } from '@/lib/prisma';

export async function getPointsSummary() {
  const transactions = await prisma.pointTransaction.findMany();
  const totalPoints = transactions.reduce((sum, t) => sum + t.delta, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTransactions = transactions.filter(
    (t) => new Date(t.createdAt) >= today
  );
  const todayPoints = todayTransactions.reduce((sum, t) => sum + t.delta, 0);

  return {
    totalPoints,
    todayPoints,
    transactionCount: transactions.length,
  };
}

export async function getPointsTransactions(limit = 20) {
  return prisma.pointTransaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

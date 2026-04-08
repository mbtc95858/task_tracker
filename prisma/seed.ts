import { PrismaClient } from '@prisma/client';
import {
  TaskStatus,
  Priority,
  TaskProgressActionType,
  ResistanceReason,
} from '@/config/constants';
import { stringifyResistanceReasons } from '@/config/businessRules';

const prisma = new PrismaClient();

async function main() {
  console.log('开始 seeding 数据...');

  await prisma.pointTransaction.deleteMany();
  await prisma.taskProgressLog.deleteMany();
  await prisma.dailyReview.deleteMany();
  await prisma.task.deleteMany();

  const task1 = await prisma.task.create({
    data: {
      title: '写项目 proposal',
      description: '为新项目写一份完整的 proposal 文档',
      category: '工作',
      priority: Priority.HIGH,
      status: TaskStatus.AVOIDED,
      fearLevel: 8,
      resistanceLevel: 7,
      clarityLevel: 5,
      painLevel: 6,
      startDifficulty: 8,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.FEAR_OF_FAILURE,
        ResistanceReason.TOO_MENTALLY_DEMANDING,
        ResistanceReason.PERFECTIONISM,
      ]),
      resistanceNote: '担心写不好，怕被否定',
      contactStep: '打开文档，只写标题',
      tinyStep: '写 3 个 bullet points 的大纲',
      normalStep: '完成 proposal 的第一部分',
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: '去健身房锻炼',
      description: '每周至少锻炼 3 次',
      category: '健康',
      priority: Priority.MEDIUM,
      status: TaskStatus.INBOX,
      fearLevel: 3,
      resistanceLevel: 5,
      clarityLevel: 8,
      painLevel: 4,
      startDifficulty: 5,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.LOW_ENERGY,
        ResistanceReason.TOO_BORING,
      ]),
      contactStep: '穿上运动鞋',
      tinyStep: '做 5 分钟热身',
      normalStep: '完成 30 分钟锻炼',
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: '阅读《深度工作》',
      description: '读完这本书并做笔记',
      category: '学习',
      priority: Priority.LOW,
      status: TaskStatus.ACTIVE,
      fearLevel: 2,
      resistanceLevel: 3,
      clarityLevel: 9,
      painLevel: 2,
      startDifficulty: 3,
      resistanceReasons: stringifyResistanceReasons([]),
      contactStep: '翻开书读第一页',
      tinyStep: '读 10 页',
      normalStep: '读一章并做笔记',
    },
  });

  await prisma.taskProgressLog.createMany({
    data: [
      {
        taskId: task3.id,
        actionType: TaskProgressActionType.TOUCHED,
        note: '今天先翻了翻书',
      },
      {
        taskId: task3.id,
        actionType: TaskProgressActionType.STARTED_TINY_STEP,
        note: '读了 10 页',
      },
    ],
  });

  await prisma.pointTransaction.createMany({
    data: [
      {
        sourceType: 'TASK_CREATED',
        sourceId: task1.id,
        delta: 1,
        reason: '创建任务',
      },
      {
        sourceType: 'TASK_CREATED',
        sourceId: task2.id,
        delta: 1,
        reason: '创建任务',
      },
      {
        sourceType: 'TASK_CREATED',
        sourceId: task3.id,
        delta: 1,
        reason: '创建任务',
      },
      {
        sourceType: 'RESISTANCE_FILLED',
        sourceId: task1.id,
        delta: 2,
        reason: '填写阻力分析',
      },
      {
        sourceType: 'RESISTANCE_FILLED',
        sourceId: task2.id,
        delta: 2,
        reason: '填写阻力分析',
      },
      {
        sourceType: 'TASK_TOUCHED',
        sourceId: task3.id,
        delta: 3,
        reason: '完成接触动作',
      },
      {
        sourceType: 'TINY_STEP_DONE',
        sourceId: task3.id,
        delta: 5,
        reason: '完成最小动作',
      },
    ],
  });

  console.log('Seeding 完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

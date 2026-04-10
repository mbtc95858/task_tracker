import { PrismaClient } from '@prisma/client';
import {
  TaskStatus,
  Priority,
  TaskProgressActionType,
  ResistanceReason,
  PainComparison,
  ProjectStatus,
  TaskType,
  ProgressMode,
  TaskCategory,
} from '@/config/constants';
import { stringifyResistanceReasons } from '@/config/businessRules';

const prisma = new PrismaClient();

async function main() {
  console.log('开始 seeding 数据...');

  await prisma.pointTransaction.deleteMany();
  await prisma.taskProgressLog.deleteMany();
  await prisma.dailyReview.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const fourDaysAgo = new Date(today);
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
  const fiveDaysAgo = new Date(today);
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const fourDaysFromNow = new Date(today);
  fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  const task1 = await prisma.task.create({
    data: {
      title: '写项目 proposal',
      description: '为新项目写一份完整的 proposal 文档',
      category: TaskCategory.WORK,
      priority: Priority.HIGH,
      status: TaskStatus.AVOIDED,
      createdAt: yesterday,
      dueDate: tomorrow,
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
      category: TaskCategory.HEALTH,
      priority: Priority.MEDIUM,
      status: TaskStatus.INBOX,
      createdAt: today,
      dueDate: today,
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
      category: TaskCategory.STUDY,
      priority: Priority.LOW,
      status: TaskStatus.ACTIVE,
      createdAt: threeDaysAgo,
      dueDate: nextWeek,
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

  const task4 = await prisma.task.create({
    data: {
      title: '整理月度账单',
      description: '整理本月的财务支出并做预算',
      category: TaskCategory.FINANCE,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
      createdAt: yesterday,
      dueDate: threeDaysFromNow,
      fearLevel: 4,
      resistanceLevel: 6,
      clarityLevel: 7,
      startDifficulty: 5,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.TOO_ANNOYING,
      ]),
      contactStep: '打开记账软件',
      tinyStep: '录入最近 3 笔支出',
      normalStep: '完成本月账单整理',
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: '画一幅水彩画',
      description: '练习水彩画，画一幅风景画',
      category: TaskCategory.CREATIVE,
      priority: Priority.LOW,
      status: TaskStatus.INBOX,
      createdAt: twoDaysAgo,
      dueDate: twoWeeksFromNow,
      fearLevel: 5,
      resistanceLevel: 4,
      clarityLevel: 6,
      startDifficulty: 4,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.FEAR_OF_RESULT,
      ]),
      contactStep: '拿出画具',
      tinyStep: '画个简单的草图',
      normalStep: '完成一幅水彩画',
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: '给朋友打电话',
      description: '和好久不见的朋友聊聊天',
      category: TaskCategory.SOCIAL,
      priority: Priority.LOW,
      status: TaskStatus.INBOX,
      createdAt: yesterday,
      dueDate: dayAfter,
      fearLevel: 2,
      resistanceLevel: 3,
      clarityLevel: 9,
      startDifficulty: 2,
      contactStep: '找到朋友的电话号码',
      tinyStep: '发送一条问候消息',
      normalStep: '打 15 分钟电话',
    },
  });

  const task7 = await prisma.task.create({
    data: {
      title: '更新身份证复印件',
      description: '复印新身份证并存档',
      category: TaskCategory.ADMIN,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
      createdAt: today,
      dueDate: fourDaysFromNow,
      fearLevel: 1,
      resistanceLevel: 4,
      clarityLevel: 10,
      startDifficulty: 3,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.TOO_BORING,
      ]),
      contactStep: '找到身份证',
      tinyStep: '走到复印机旁',
      normalStep: '完成复印并存档',
    },
  });

  const task8 = await prisma.task.create({
    data: {
      title: '准备周会报告',
      description: '整理本周工作内容并准备汇报',
      category: TaskCategory.WORK,
      priority: Priority.HIGH,
      status: TaskStatus.ACTIVE,
      createdAt: yesterday,
      dueDate: today,
      fearLevel: 6,
      resistanceLevel: 5,
      clarityLevel: 8,
      startDifficulty: 5,
      contactStep: '打开上周的报告',
      tinyStep: '列出 3 个重点',
      normalStep: '完成完整的报告',
    },
  });

  const task9 = await prisma.task.create({
    data: {
      title: '学习 TypeScript',
      description: '学习 TypeScript 的高级特性',
      category: TaskCategory.STUDY,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
      createdAt: threeDaysAgo,
      dueDate: twoWeeksFromNow,
      fearLevel: 3,
      resistanceLevel: 4,
      clarityLevel: 7,
      startDifficulty: 4,
      contactStep: '打开 TypeScript 文档',
      tinyStep: '读一个小节',
      normalStep: '完成一个小练习',
    },
  });

  const task10 = await prisma.task.create({
    data: {
      title: '冥想练习',
      description: '每天坚持 10 分钟冥想',
      category: TaskCategory.HEALTH,
      priority: Priority.MEDIUM,
      status: TaskStatus.ACTIVE,
      createdAt: twoDaysAgo,
      dueDate: nextWeek,
      fearLevel: 1,
      resistanceLevel: 5,
      clarityLevel: 9,
      startDifficulty: 4,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.LOW_ENERGY,
      ]),
      contactStep: '坐在垫子上',
      tinyStep: '闭眼呼吸 1 分钟',
      normalStep: '完成 10 分钟冥想',
    },
  });

  await prisma.taskProgressLog.createMany({
    data: [
      {
        taskId: task3.id,
        actionType: TaskProgressActionType.TOUCHED,
        note: '今天先翻了翻书',
        createdAt: twoDaysAgo,
      },
      {
        taskId: task3.id,
        actionType: TaskProgressActionType.STARTED_TINY_STEP,
        note: '读了 10 页',
        createdAt: yesterday,
      },
    ],
  });

  const reviewDate = new Date(yesterday);
  reviewDate.setHours(0, 0, 0, 0);

  await prisma.dailyReview.create({
    data: {
      date: reviewDate,
      mostAvoidedTaskId: task1.id,
      didStart: false,
      blockingReason: '还是担心写不好',
      effectiveStarter: '',
      actualPainLevel: null,
      painComparison: null,
      note: '今天还是没开始写 proposal，明天再试试从接触动作开始',
    },
  });

  await prisma.pointTransaction.createMany({
    data: [
      {
        sourceType: 'TASK_CREATED',
        sourceId: task1.id,
        delta: 1,
        reason: '创建任务',
        createdAt: yesterday,
      },
      {
        sourceType: 'TASK_CREATED',
        sourceId: task2.id,
        delta: 1,
        reason: '创建任务',
        createdAt: today,
      },
      {
        sourceType: 'TASK_CREATED',
        sourceId: task3.id,
        delta: 1,
        reason: '创建任务',
        createdAt: threeDaysAgo,
      },
      {
        sourceType: 'RESISTANCE_FILLED',
        sourceId: task1.id,
        delta: 2,
        reason: '填写阻力分析',
        createdAt: yesterday,
      },
      {
        sourceType: 'RESISTANCE_FILLED',
        sourceId: task2.id,
        delta: 2,
        reason: '填写阻力分析',
        createdAt: today,
      },
      {
        sourceType: 'TASK_TOUCHED',
        sourceId: task3.id,
        delta: 3,
        reason: '完成接触动作',
        createdAt: twoDaysAgo,
      },
      {
        sourceType: 'TINY_STEP_DONE',
        sourceId: task3.id,
        delta: 5,
        reason: '完成最小动作',
        createdAt: yesterday,
      },
      {
        sourceType: 'DAILY_REVIEW_COMPLETED',
        sourceId: '',
        delta: 3,
        reason: '完成每日复盘',
        createdAt: reviewDate,
      },
    ],
  });

  const project = await prisma.project.create({
    data: {
      title: '个人网站重构',
      description: '重构我的个人网站，添加博客功能和响应式设计',
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      progressMode: ProgressMode.AUTO,
      orderIndex: 0,
    },
  });

  const phase1 = await prisma.task.create({
    data: {
      title: '需求分析与设计',
      description: '明确网站功能需求，设计页面布局',
      category: TaskCategory.WORK,
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.HIGH,
      status: TaskStatus.DONE,
      createdAt: fiveDaysAgo,
      dueDate: fourDaysAgo,
      orderIndex: 0,
      contactStep: '打开记事本写 3 个核心功能',
      tinyStep: '画一个简单的页面草图',
      normalStep: '完成完整的需求文档',
    },
  });

  const phase2 = await prisma.task.create({
    data: {
      title: '技术选型',
      description: '选择合适的技术栈',
      category: TaskCategory.WORK,
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.HIGH,
      status: TaskStatus.DONE,
      createdAt: fourDaysAgo,
      dueDate: threeDaysAgo,
      orderIndex: 1,
      contactStep: '搜索 3 个可选框架',
      tinyStep: '对比 2 个主要框架的优缺点',
      normalStep: '完成技术选型文档',
    },
  });

  const phase3 = await prisma.task.create({
    data: {
      title: '开发首页',
      description: '开发网站的首页',
      category: TaskCategory.WORK,
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.HIGH,
      status: TaskStatus.ACTIVE,
      createdAt: threeDaysAgo,
      dueDate: tomorrow,
      fearLevel: 6,
      resistanceLevel: 7,
      clarityLevel: 5,
      startDifficulty: 6,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.TOO_BIG_OR_VAGUE,
        ResistanceReason.TOO_MENTALLY_DEMANDING,
      ]),
      orderIndex: 2,
      contactStep: '创建项目文件夹',
      tinyStep: '写一个简单的 HTML 页面',
      normalStep: '完成首页的基本布局',
    },
  });

  const phase4 = await prisma.task.create({
    data: {
      title: '开发博客系统',
      description: '开发博客列表和详情页面',
      category: TaskCategory.WORK,
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
      createdAt: twoDaysAgo,
      dueDate: threeDaysFromNow,
      orderIndex: 3,
      contactStep: '看 2 个博客系统的例子',
      tinyStep: '设计博客数据结构',
      normalStep: '完成博客列表页',
    },
  });

  const milestone1 = await prisma.task.create({
    data: {
      title: 'MVP 上线',
      description: '第一个可用版本上线',
      category: TaskCategory.WORK,
      projectId: project.id,
      taskType: TaskType.MILESTONE,
      priority: Priority.CRITICAL,
      status: TaskStatus.PLANNED,
      createdAt: yesterday,
      dueDate: twoWeeksFromNow,
      orderIndex: 4,
    },
  });

  await prisma.taskProgressLog.createMany({
    data: [
      {
        taskId: phase1.id,
        actionType: TaskProgressActionType.TOUCHED,
        note: '开始思考需求',
        createdAt: fiveDaysAgo,
      },
      {
        taskId: phase1.id,
        actionType: TaskProgressActionType.STARTED_TINY_STEP,
        note: '列了几个功能点',
        createdAt: fiveDaysAgo,
      },
      {
        taskId: phase1.id,
        actionType: TaskProgressActionType.COMPLETED,
        note: '需求分析完成',
        createdAt: fourDaysAgo,
      },
      {
        taskId: phase2.id,
        actionType: TaskProgressActionType.COMPLETED,
        note: '技术选型完成',
        createdAt: threeDaysAgo,
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

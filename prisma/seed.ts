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
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        taskId: task3.id,
        actionType: TaskProgressActionType.STARTED_TINY_STEP,
        note: '读了 10 页',
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  await prisma.dailyReview.create({
    data: {
      date: yesterday,
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
      {
        sourceType: 'DAILY_REVIEW_COMPLETED',
        sourceId: '',
        delta: 3,
        reason: '完成每日复盘',
        createdAt: yesterday,
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
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.HIGH,
      status: TaskStatus.DONE,
      orderIndex: 0,
      contactStep: '打开记事本写 3 个核心功能',
      tinyStep: '画一个简单的页面草图',
      normalStep: '完成完整的需求文档',
    },
  });

  const phase1Sub1 = await prisma.task.create({
    data: {
      title: '列出核心功能',
      projectId: project.id,
      parentTaskId: phase1.id,
      taskType: TaskType.SUBTASK,
      priority: Priority.MEDIUM,
      status: TaskStatus.DONE,
      orderIndex: 0,
    },
  });

  const phase1Sub2 = await prisma.task.create({
    data: {
      title: '设计页面布局',
      projectId: project.id,
      parentTaskId: phase1.id,
      taskType: TaskType.SUBTASK,
      priority: Priority.MEDIUM,
      status: TaskStatus.DONE,
      orderIndex: 1,
    },
  });

  const phase2 = await prisma.task.create({
    data: {
      title: '技术选型',
      description: '选择合适的技术栈',
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.HIGH,
      status: TaskStatus.DONE,
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
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.HIGH,
      status: TaskStatus.ACTIVE,
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

  const phase3Sub1 = await prisma.task.create({
    data: {
      title: '设置开发环境',
      projectId: project.id,
      parentTaskId: phase3.id,
      taskType: TaskType.SUBTASK,
      priority: Priority.HIGH,
      status: TaskStatus.AVOIDED,
      fearLevel: 8,
      resistanceLevel: 7,
      startDifficulty: 8,
      resistanceReasons: stringifyResistanceReasons([
        ResistanceReason.FEAR_OF_FAILURE,
        ResistanceReason.DONT_KNOW_HOW_TO_START,
      ]),
      resistanceNote: '担心配置不对，浪费时间',
      orderIndex: 0,
      contactStep: '打开终端',
      tinyStep: '运行 npm init',
      normalStep: '完成完整的开发环境配置',
    },
  });

  const phase3Sub2 = await prisma.task.create({
    data: {
      title: '开发导航栏',
      projectId: project.id,
      parentTaskId: phase3.id,
      taskType: TaskType.SUBTASK,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
      orderIndex: 1,
      contactStep: '画导航栏的草图',
      tinyStep: '写 HTML 结构',
      normalStep: '完成导航栏的样式和交互',
    },
  });

  const phase3Sub3 = await prisma.task.create({
    data: {
      title: '开发 Hero 区域',
      projectId: project.id,
      parentTaskId: phase3.id,
      taskType: TaskType.SUBTASK,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
      orderIndex: 2,
    },
  });

  const phase4 = await prisma.task.create({
    data: {
      title: '开发博客系统',
      description: '开发博客列表和详情页面',
      projectId: project.id,
      taskType: TaskType.PROJECT_PHASE,
      priority: Priority.MEDIUM,
      status: TaskStatus.PLANNED,
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
      projectId: project.id,
      taskType: TaskType.MILESTONE,
      priority: Priority.CRITICAL,
      status: TaskStatus.PLANNED,
      orderIndex: 4,
    },
  });

  await prisma.taskProgressLog.createMany({
    data: [
      {
        taskId: phase1.id,
        actionType: TaskProgressActionType.TOUCHED,
        note: '开始思考需求',
        createdAt: new Date(Date.now() - 86400000 * 5),
      },
      {
        taskId: phase1.id,
        actionType: TaskProgressActionType.STARTED_TINY_STEP,
        note: '列了几个功能点',
        createdAt: new Date(Date.now() - 86400000 * 4),
      },
      {
        taskId: phase1.id,
        actionType: TaskProgressActionType.COMPLETED,
        note: '需求分析完成',
        createdAt: new Date(Date.now() - 86400000 * 3),
      },
      {
        taskId: phase2.id,
        actionType: TaskProgressActionType.COMPLETED,
        note: '技术选型完成',
        createdAt: new Date(Date.now() - 86400000 * 2),
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

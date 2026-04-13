import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始生成种子数据...');

  const today = new Date();
  const getDate = (daysFromNow: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + daysFromNow);
    return date;
  };

  // 创建项目
  const project1 = await prisma.project.create({
    data: {
      title: '重构前端架构',
      description: '重构现有前端代码，提升性能和可维护性',
      status: 'ACTIVE',
      priority: 'HIGH',
      dueDate: getDate(7),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: '设计系统优化',
      description: '完善设计系统和组件库',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      dueDate: getDate(14),
    },
  });

  // 创建任务
  const tasks = [
    {
      title: '分析现有代码结构',
      description: '仔细分析当前代码的架构和依赖关系',
      status: 'INBOX',
      priority: 'HIGH',
      dueDate: getDate(-3),
      projectId: project1.id,
      fearLevel: 2,
      resistanceLevel: 3,
      clarityLevel: 8,
      contactStep: '打开项目文件夹',
      tinyStep: '查看 3 个核心文件',
      normalStep: '绘制当前架构草图',
    },
    {
      title: '编写技术方案',
      description: '详细的技术设计文档和实施计划',
      status: 'PLANNED',
      priority: 'HIGH',
      dueDate: getDate(-1),
      projectId: project1.id,
      fearLevel: 6,
      resistanceLevel: 7,
      clarityLevel: 5,
      contactStep: '创建新文档',
      tinyStep: '列出 5 个核心问题',
      normalStep: '完成技术方案初稿',
    },
    {
      title: '创建新组件库',
      description: '从零开始构建可复用的组件库',
      status: 'AVOIDED',
      priority: 'CRITICAL',
      dueDate: today,
      projectId: project2.id,
      fearLevel: 8,
      resistanceLevel: 9,
      clarityLevel: 4,
      contactStep: '打开 Figma 设计稿',
      tinyStep: '画 3 个按钮的草稿',
      normalStep: '创建 Button 组件',
    },
    {
      title: '用户测试会议',
      description: '与用户一起测试新功能',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      dueDate: getDate(1),
      fearLevel: 3,
      resistanceLevel: 2,
      clarityLevel: 9,
      contactStep: '发送会议邀请',
      tinyStep: '准备测试清单',
      normalStep: '主持测试会议',
    },
    {
      title: '代码审查',
      description: '审查团队成员的 Pull Request',
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: getDate(-2),
      fearLevel: 1,
      resistanceLevel: 1,
      clarityLevel: 10,
      contactStep: '打开 GitHub',
      tinyStep: '浏览 1 个 PR',
      normalStep: '完成代码审查并留言',
    },
    {
      title: '学习新技术',
      description: '学习新的框架和工具',
      status: 'INBOX',
      priority: 'LOW',
      dueDate: getDate(3),
      fearLevel: 5,
      resistanceLevel: 6,
      clarityLevel: 6,
      contactStep: '打开教程网站',
      tinyStep: '看 10 分钟视频',
      normalStep: '完成第一个练习',
    },
    {
      title: '修复登录 bug',
      description: '用户报告的登录问题需要修复',
      status: 'BLOCKED',
      priority: 'HIGH',
      dueDate: getDate(2),
      projectId: project1.id,
      fearLevel: 4,
      resistanceLevel: 5,
      clarityLevel: 7,
      contactStep: '查看错误日志',
      tinyStep: '复现问题',
      normalStep: '定位 bug 并修复',
    },
    {
      title: '写周报',
      description: '本周工作总结和下周计划',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      dueDate: today,
      fearLevel: 2,
      resistanceLevel: 3,
      clarityLevel: 9,
      contactStep: '打开笔记软件',
      tinyStep: '列出 3 个重要事项',
      normalStep: '完成周报初稿',
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: taskData,
    });
  }

  // 创建进度日志
  const allTasks = await prisma.task.findMany();
  
  const progressLogs = [
    { taskId: allTasks[0].id, actionType: 'TOUCHED', note: '开始分析代码结构' },
    { taskId: allTasks[4].id, actionType: 'COMPLETED', note: '代码审查完成' },
    { taskId: allTasks[4].id, actionType: 'MADE_PROGRESS', note: '查看了3个PR' },
    { taskId: allTasks[7].id, actionType: 'STARTED_TINY_STEP', note: '列出了本周重要事项' },
    { taskId: allTasks[7].id, actionType: 'TOUCHED', note: '打开了笔记软件' },
  ];

  for (const log of progressLogs) {
    await prisma.taskProgressLog.create({
      data: log,
    });
  }

  console.log('种子数据生成完成！');
  console.log(`创建了 ${tasks.length} 个任务`);
  console.log(`创建了 2 个项目`);
  console.log(`创建了 ${progressLogs.length} 条进度日志`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

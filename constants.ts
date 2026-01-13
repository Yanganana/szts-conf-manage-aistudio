import { Status, Priority, User, Team, Project, Tag, Task } from './types';

export const MOCK_TEAMS: Team[] = [
  { id: 'team-1', name: '平台研发组', description: '负责核心平台架构与基础设施', leadId: 'u1' },
  { id: 'team-2', name: '设计体验组', description: 'UI/UX 设计与设计系统维护', leadId: 'u3' },
  { id: 'team-3', name: '增长黑客组', description: '负责市场营销与用户获取', leadId: 'u5' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: '陈艾丽', avatar: 'https://picsum.photos/seed/u1/200', role: '技术负责人', teamId: 'team-1' },
  { id: 'u2', name: '王鲍勃', avatar: 'https://picsum.photos/seed/u2/200', role: '前端开发', teamId: 'team-1' },
  { id: 'u3', name: '金查理', avatar: 'https://picsum.photos/seed/u3/200', role: '设计师', teamId: 'team-2' },
  { id: 'u4', name: '李大卫', avatar: 'https://picsum.photos/seed/u4/200', role: '后端开发', teamId: 'team-1' },
  { id: 'u5', name: '张伊芙', avatar: 'https://picsum.photos/seed/u5/200', role: '产品经理', teamId: 'team-3' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p-1', name: '凤凰重构计划', description: '下一代仪表盘重写项目', status: 'active' },
  { id: 'p-2', name: '移动端 V2', description: 'iOS 和 Android 端重构', status: 'planning' },
  { id: 'p-3', name: '数据流水线', description: '实时分析基础设施建设', status: 'active' },
];

export const MOCK_TAGS: Tag[] = [
  { id: 't-1', name: '缺陷', color: 'bg-red-100 text-red-800' },
  { id: 't-2', name: '功能', color: 'bg-blue-100 text-blue-800' },
  { id: 't-3', name: '紧急', color: 'bg-orange-100 text-orange-800' },
  { id: 't-4', name: '重构', color: 'bg-purple-100 text-purple-800' },
];

export const MOCK_TASKS: Task[] = [
  // Project 1 Tasks
  {
    id: 'task-1', title: '搭建 React 仓库', description: '初始化 Vite 和 TypeScript 配置',
    status: Status.DONE, priority: Priority.HIGH, projectId: 'p-1', assigneeId: 'u2', reporterId: 'u1', tagIds: ['t-2'], dueDate: '2023-11-01'
  },
  {
    id: 'task-2', title: '实现认证流程', description: '集成 Google OAuth2 登录',
    status: Status.IN_PROGRESS, priority: Priority.CRITICAL, projectId: 'p-1', assigneeId: 'u4', reporterId: 'u1', tagIds: ['t-2', 't-3'], dueDate: '2023-11-05'
  },
  {
    id: 'task-3', title: '设计系统 Token 定义', description: '定义全局颜色和字体规范',
    status: Status.REVIEW, priority: Priority.MEDIUM, projectId: 'p-1', assigneeId: 'u3', reporterId: 'u5', tagIds: ['t-2'], dueDate: '2023-11-03'
  },
  // Subtasks for Task 2
  {
    id: 'task-2-1', title: '后端 JWT 逻辑', description: '实现 Token 签发与验证',
    status: Status.IN_PROGRESS, priority: Priority.HIGH, projectId: 'p-1', assigneeId: 'u4', reporterId: 'u4', tagIds: ['t-2'], parentId: 'task-2', dueDate: '2023-11-04'
  },
  {
    id: 'task-2-2', title: '前端登录页面', description: '开发登录表单组件',
    status: Status.TODO, priority: Priority.MEDIUM, projectId: 'p-1', assigneeId: 'u2', reporterId: 'u4', tagIds: ['t-2'], parentId: 'task-2', dueDate: '2023-11-06'
  },
  
  // Project 2 Tasks
  {
    id: 'task-4', title: '用户访谈分析', description: '汇总 Beta 用户的反馈意见',
    status: Status.TODO, priority: Priority.LOW, projectId: 'p-2', assigneeId: 'u5', reporterId: 'u5', tagIds: ['t-4'], dueDate: '2023-12-01'
  },
  {
    id: 'task-5', title: '修复启动崩溃', description: '主 Activity 中的空指针异常',
    status: Status.TODO, priority: Priority.CRITICAL, projectId: 'p-2', assigneeId: 'u2', reporterId: 'u5', tagIds: ['t-1', 't-3'], dueDate: '2023-10-30'
  },
  
  // Project 3 Tasks
  {
    id: 'task-6', title: 'Kafka 集群部署', description: '部署 3 个节点的集群',
    status: Status.DONE, priority: Priority.HIGH, projectId: 'p-3', assigneeId: 'u4', reporterId: 'u1', tagIds: ['t-2'], dueDate: '2023-10-15'
  },
];
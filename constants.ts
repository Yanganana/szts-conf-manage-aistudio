import { Status, Priority, User, Team, Project, Tag, Task } from './types';

export const MOCK_TEAMS: Team[] = [
  { id: 'team-1', name: 'Alpha Squad', description: 'Core Platform Development', leadId: 'u1' },
  { id: 'team-2', name: 'Design Ops', description: 'UI/UX and Design Systems', leadId: 'u3' },
  { id: 'team-3', name: 'Growth Hackers', description: 'Marketing and User Acquisition', leadId: 'u5' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', avatar: 'https://picsum.photos/seed/u1/200', role: 'Tech Lead', teamId: 'team-1' },
  { id: 'u2', name: 'Bob Smith', avatar: 'https://picsum.photos/seed/u2/200', role: 'Frontend Dev', teamId: 'team-1' },
  { id: 'u3', name: 'Charlie Kim', avatar: 'https://picsum.photos/seed/u3/200', role: 'Designer', teamId: 'team-2' },
  { id: 'u4', name: 'David Lee', avatar: 'https://picsum.photos/seed/u4/200', role: 'Backend Dev', teamId: 'team-1' },
  { id: 'u5', name: 'Eve Patron', avatar: 'https://picsum.photos/seed/u5/200', role: 'Product Manager', teamId: 'team-3' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p-1', name: 'Project Phoenix', description: 'Next Gen Dashboard Rewrite', status: 'active' },
  { id: 'p-2', name: 'Mobile App V2', description: 'iOS and Android Refactor', status: 'planning' },
  { id: 'p-3', name: 'Data Pipeline', description: 'Real-time Analytics Infrastructure', status: 'active' },
];

export const MOCK_TAGS: Tag[] = [
  { id: 't-1', name: 'Bug', color: 'bg-red-100 text-red-800' },
  { id: 't-2', name: 'Feature', color: 'bg-blue-100 text-blue-800' },
  { id: 't-3', name: 'Urgent', color: 'bg-orange-100 text-orange-800' },
  { id: 't-4', name: 'Refactor', color: 'bg-purple-100 text-purple-800' },
];

export const MOCK_TASKS: Task[] = [
  // Project 1 Tasks
  {
    id: 'task-1', title: 'Setup React Repository', description: 'Initialize Vite and TypeScript',
    status: Status.DONE, priority: Priority.HIGH, projectId: 'p-1', assigneeId: 'u2', reporterId: 'u1', tagIds: ['t-2'], dueDate: '2023-11-01'
  },
  {
    id: 'task-2', title: 'Implement Auth Flow', description: 'OAuth2 integration with Google',
    status: Status.IN_PROGRESS, priority: Priority.CRITICAL, projectId: 'p-1', assigneeId: 'u4', reporterId: 'u1', tagIds: ['t-2', 't-3'], dueDate: '2023-11-05'
  },
  {
    id: 'task-3', title: 'Design System Tokens', description: 'Define colors and typography',
    status: Status.REVIEW, priority: Priority.MEDIUM, projectId: 'p-1', assigneeId: 'u3', reporterId: 'u5', tagIds: ['t-2'], dueDate: '2023-11-03'
  },
  // Subtasks for Task 2
  {
    id: 'task-2-1', title: 'Backend JWT logic', description: 'Implement token signing',
    status: Status.IN_PROGRESS, priority: Priority.HIGH, projectId: 'p-1', assigneeId: 'u4', reporterId: 'u4', tagIds: ['t-2'], parentId: 'task-2', dueDate: '2023-11-04'
  },
  {
    id: 'task-2-2', title: 'Frontend Login Page', description: 'Create UI components',
    status: Status.TODO, priority: Priority.MEDIUM, projectId: 'p-1', assigneeId: 'u2', reporterId: 'u4', tagIds: ['t-2'], parentId: 'task-2', dueDate: '2023-11-06'
  },
  
  // Project 2 Tasks
  {
    id: 'task-4', title: 'User Interview Analysis', description: 'Summarize feedback from beta users',
    status: Status.TODO, priority: Priority.LOW, projectId: 'p-2', assigneeId: 'u5', reporterId: 'u5', tagIds: ['t-4'], dueDate: '2023-12-01'
  },
  {
    id: 'task-5', title: 'Fix Crash on Launch', description: 'Null pointer exception in main activity',
    status: Status.TODO, priority: Priority.CRITICAL, projectId: 'p-2', assigneeId: 'u2', reporterId: 'u5', tagIds: ['t-1', 't-3'], dueDate: '2023-10-30'
  },
  
  // Project 3 Tasks
  {
    id: 'task-6', title: 'Kafka Cluster Setup', description: 'Deploy 3 nodes',
    status: Status.DONE, priority: Priority.HIGH, projectId: 'p-3', assigneeId: 'u4', reporterId: 'u1', tagIds: ['t-2'], dueDate: '2023-10-15'
  },
];
export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'planning';
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  projectId: string;
  assigneeId?: string;
  reporterId: string;
  tagIds: string[];
  parentId?: string; // For sub-tasks
  dueDate: string;
}

export type WorkbenchContextType = 'project' | 'team' | 'task' | 'tag';

export interface WorkbenchContext {
  type: WorkbenchContextType;
  id: string;
  name: string; // For display purposes
  description?: string;
}
export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
}

export interface RecentProject {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
  completedCount: number;
  progress: number;
}

export type ActivityType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_MOVED"
  | "COMMENT_CREATED"
  | "MEMBER_JOINED";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  userName: string;
  userAvatar: string | null;
  createdAt: string;
  projectName: string | null;
  taskTitle: string | null;
}

export interface DashboardView {
  stats: DashboardStats;
  recentProjects: RecentProject[];
  activity: ActivityItem[];
}

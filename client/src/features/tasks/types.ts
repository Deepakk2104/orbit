export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  createdAt: string;
}

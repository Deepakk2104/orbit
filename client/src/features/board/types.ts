export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface BoardTask {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  assignee: { id: string; name: string; avatar: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  position: number;
  boardId: string;
  tasks: BoardTask[];
}

export interface Board {
  id: string;
  projectId: string;
  createdAt: string;
  columns: BoardColumn[];
}

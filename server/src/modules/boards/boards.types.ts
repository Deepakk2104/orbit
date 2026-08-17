import type { Priority } from "@prisma/client";

export interface BoardTask {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  assignee: { id: string; name: string; avatar: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoardColumnView {
  id: string;
  name: string;
  position: number;
  boardId: string;
  tasks: BoardTask[];
}

export interface BoardView {
  id: string;
  projectId: string;
  createdAt: Date;
  columns: BoardColumnView[];
}

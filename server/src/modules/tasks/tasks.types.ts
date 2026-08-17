import type { Priority } from "@prisma/client";

export interface TaskView {
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

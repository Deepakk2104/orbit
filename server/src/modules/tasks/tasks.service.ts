import { prisma } from "../../lib/prisma.js";
import type { CreateTaskInput } from "./validators/create.validator.js";
import type { UpdateTaskInput } from "./validators/update.validator.js";
import type { MoveTaskInput } from "./validators/move.validator.js";
import type { TaskView } from "./tasks.types.js";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  priority: true,
  dueDate: true,
  position: true,
  columnId: true,
  assigneeId: true,
  assignee: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  position: number;
  columnId: string;
  assigneeId: string | null;
  assignee: { id: string; name: string; avatar: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
};

const toTaskView = (task: TaskRecord): TaskView => ({
  ...task,
  dueDate: task.dueDate ? task.dueDate.toISOString() : null,
});

const getProject = async (orgId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw new Error("Project not found or access denied");
  }

  return project;
};

const verifyAssignee = async (orgId: string, assigneeId: string | null) => {
  if (!assigneeId) {
    return;
  }

  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: assigneeId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!member) {
    throw new Error("Assignee is not a member of this organization");
  }
};

export const createTask = async (
  orgId: string,
  projectId: string,
  columnId: string,
  createdById: string,
  data: CreateTaskInput
): Promise<TaskView> => {
  await getProject(orgId, projectId);

  const column = await prisma.boardColumn.findFirst({
    where: {
      id: columnId,
      board: {
        projectId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!column) {
    throw new Error("Column not found or access denied");
  }

  await verifyAssignee(orgId, data.assigneeId ?? null);

  const { _count } = await prisma.task.aggregate({
    where: {
      columnId,
    },
    _count: {
      _all: true,
    },
  });

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? "MEDIUM",
      dueDate: data.dueDate ?? null,
      position: _count._all,
      columnId,
      assigneeId: data.assigneeId ?? null,
      createdById,
    },
    select: taskSelect,
  });

  return toTaskView(task);
};

export const updateTask = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: UpdateTaskInput
): Promise<TaskView> => {
  await getProject(orgId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      column: {
        board: {
          projectId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  await verifyAssignee(orgId, data.assigneeId ?? null);

  const updated = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
    },
    select: taskSelect,
  });

  return toTaskView(updated);
};

export const deleteTask = async (
  orgId: string,
  projectId: string,
  taskId: string
) => {
  await getProject(orgId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      column: {
        board: {
          projectId,
        },
      },
    },
    select: {
      id: true,
      columnId: true,
      position: true,
    },
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  await prisma.$transaction([
    prisma.task.delete({
      where: {
        id: taskId,
      },
    }),
    prisma.task.updateMany({
      where: {
        columnId: task.columnId,
        position: {
          gt: task.position,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    }),
  ]);
};

export const moveTask = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: MoveTaskInput
) => {
  await getProject(orgId, projectId);

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      column: {
        board: {
          projectId,
        },
      },
    },
    select: {
      id: true,
      columnId: true,
      position: true,
    },
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  const targetColumn = await prisma.boardColumn.findFirst({
    where: {
      id: data.columnId,
      board: {
        projectId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!targetColumn) {
    throw new Error("Column not found or access denied");
  }

  const currentColumnId = task.columnId;
  const currentPosition = task.position;
  const newPosition = data.position;

  if (
    currentColumnId === targetColumn.id &&
    currentPosition === newPosition
  ) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (currentColumnId === targetColumn.id) {
      if (newPosition > currentPosition) {
        await tx.task.updateMany({
          where: {
            columnId: currentColumnId,
            position: {
              gt: currentPosition,
              lte: newPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else {
        const sentinel = 1_000_000;

        await tx.task.update({
          where: {
            id: taskId,
          },
          data: {
            position: sentinel,
          },
        });

        await tx.task.updateMany({
          where: {
            columnId: currentColumnId,
            position: {
              gte: newPosition,
              lt: currentPosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });

        await tx.task.update({
          where: {
            id: taskId,
          },
          data: {
            position: newPosition,
          },
        });
      }
    } else {
      const sentinel = 1_000_000;

      await tx.task.update({
        where: {
          id: taskId,
        },
        data: {
          position: sentinel,
        },
      });

      await tx.task.updateMany({
        where: {
          columnId: currentColumnId,
          position: {
            gt: currentPosition,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      await tx.task.updateMany({
        where: {
          columnId: targetColumn.id,
          position: {
            gte: newPosition,
          },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });

      await tx.task.update({
        where: {
          id: taskId,
        },
        data: {
          columnId: targetColumn.id,
          position: newPosition,
        },
      });
    }
  });
};
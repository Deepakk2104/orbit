import { prisma } from "../../lib/prisma.js";
import type { BoardView } from "./boards.types.js";
import { notFoundError } from "../../lib/errors.js";

export const DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"];

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

export const getBoard = async (
  orgId: string,
  projectId: string
): Promise<BoardView> => {
  const board = await prisma.board.findUnique({
    where: {
      projectId,
    },
    select: {
      id: true,
      projectId: true,
      createdAt: true,
      columns: {
        select: {
          id: true,
          name: true,
          position: true,
          boardId: true,
          tasks: {
            select: taskSelect,
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!board) {
    throw notFoundError("Board not found");
  }

  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      })),
    })),
  };
};

export const createBoard = async (
  orgId: string,
  projectId: string
): Promise<BoardView> => {
  await prisma.$transaction(async (tx) => {
    const created = await tx.board.create({
      data: {
        projectId,
      },
      select: {
        id: true,
        projectId: true,
        createdAt: true,
      },
    });

    await tx.boardColumn.createMany({
      data: DEFAULT_COLUMNS.map((name, index) => ({
        name,
        position: index,
        boardId: created.id,
      })),
    });

    return created;
  });

  return getBoard(orgId, projectId);
};

import { prisma } from "../../lib/prisma.js";
import type { CreateColumnInput } from "./validators/create.validator.js";
import type { UpdateColumnInput } from "./validators/update.validator.js";
import { notFoundError } from "../../lib/errors.js";

const getBoardForProject = async (projectId: string) => {
  const board = await prisma.board.findUnique({
    where: {
      projectId,
    },
    select: {
      id: true,
    },
  });

  if (!board) {
    throw notFoundError("Board not found for this project");
  }

  return board;
};

export const createColumn = async (
  projectId: string,
  data: CreateColumnInput
): Promise<unknown> => {
  const board = await getBoardForProject(projectId);

  const { _count } = await prisma.boardColumn.aggregate({
    where: {
      boardId: board.id,
    },
    _count: {
      _all: true,
    },
  });

  return prisma.boardColumn.create({
    data: {
      name: data.name,
      position: _count._all,
      boardId: board.id,
    },
    select: {
      id: true,
      name: true,
      position: true,
      boardId: true,
      createdAt: true,
    },
  });
};

export const updateColumn = async (
  projectId: string,
  columnId: string,
  data: UpdateColumnInput
) => {
  await getBoardForProject(projectId);

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
    throw notFoundError("Column not found or access denied");
  }

  return prisma.boardColumn.update({
    where: {
      id: columnId,
    },
    data: {
      name: data.name,
    },
    select: {
      id: true,
      name: true,
      position: true,
      boardId: true,
      createdAt: true,
    },
  });
};

export const deleteColumn = async (projectId: string, columnId: string) => {
  await getBoardForProject(projectId);

  const column = await prisma.boardColumn.findFirst({
    where: {
      id: columnId,
      board: {
        projectId,
      },
    },
    select: {
      id: true,
      position: true,
      boardId: true,
    },
  });

  if (!column) {
    throw notFoundError("Column not found or access denied");
  }

  await prisma.$transaction([
    prisma.boardColumn.delete({
      where: {
        id: columnId,
      },
    }),
    prisma.boardColumn.updateMany({
      where: {
        boardId: column.boardId,
        position: {
          gt: column.position,
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

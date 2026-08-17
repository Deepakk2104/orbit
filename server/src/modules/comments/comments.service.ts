import { prisma } from "../../lib/prisma.js";
import type { CreateCommentInput } from "./validators/create.validator.js";
import type { CommentView } from "./comments.types.js";

const commentSelect = {
  id: true,
  content: true,
  taskId: true,
  user: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  createdAt: true,
} as const;

type CommentRecord = {
  id: string;
  content: string;
  taskId: string;
  user: { id: string; name: string; avatar: string | null };
  createdAt: Date;
};

const toCommentView = (comment: CommentRecord): CommentView => ({
  ...comment,
  createdAt: comment.createdAt.toISOString(),
});

const getTask = async (orgId: string, projectId: string, taskId: string) => {
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

  return task;
};

export const listComments = async (
  orgId: string,
  projectId: string,
  taskId: string
): Promise<CommentView[]> => {
  await getTask(orgId, projectId, taskId);

  const comments = await prisma.comment.findMany({
    where: {
      taskId,
    },
    select: commentSelect,
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments.map(toCommentView);
};

export const createComment = async (
  orgId: string,
  projectId: string,
  taskId: string,
  userId: string,
  data: CreateCommentInput
): Promise<CommentView> => {
  await getTask(orgId, projectId, taskId);

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      taskId,
      userId,
    },
    select: commentSelect,
  });

  return toCommentView(comment);
};

export const deleteComment = async (
  orgId: string,
  projectId: string,
  taskId: string,
  commentId: string,
  userId: string
) => {
  await getTask(orgId, projectId, taskId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!comment) {
    throw new Error("Comment not found or access denied");
  }

  if (comment.userId !== userId) {
    throw new Error("You can only delete your own comments");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

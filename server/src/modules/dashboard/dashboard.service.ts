import { prisma } from "../../lib/prisma.js";
import { notFoundError } from "../../lib/errors.js";
import type {
  ActivityItem,
  DashboardView,
  RecentProject,
} from "./dashboard.types.js";

const DONE_COLUMN_NAMES = ["Done"];
const CACHE_TTL = 60 * 1000;

let cacheDoneColumnIds: string[] | null = null;
let cacheTimestamp = 0;

export const getDashboard = async (orgId: string): Promise<DashboardView> => {
  const now = Date.now();
  let doneColumnIds: string[];

  if (cacheDoneColumnIds && now - cacheTimestamp < CACHE_TTL) {
    doneColumnIds = cacheDoneColumnIds;
  } else {
    const columns = await prisma.boardColumn.findMany({
      where: {
        board: {
          project: {
            organizationId: orgId,
          },
        },
        name: { in: DONE_COLUMN_NAMES },
      },
      select: {
        id: true,
      },
    });

    cacheDoneColumnIds = columns.map((column) => column.id);
    cacheTimestamp = now;
    doneColumnIds = cacheDoneColumnIds;
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    select: {
      id: true,
    },
  });

  if (!organization) {
    throw notFoundError("Organization not found");
  }

  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      board: {
        select: {
          columns: {
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  tasks: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const recentProjects: RecentProject[] = projects.map((project) => {
    const columns = project.board?.columns ?? [];

    const taskCount = columns.reduce(
      (sum, column) => sum + column._count.tasks,
      0
    );

    const completedCount = columns
      .filter((column) => doneColumnIds.includes(column.id))
      .reduce((sum, column) => sum + column._count.tasks, 0);

    const progress =
      taskCount === 0 ? 0 : Math.round((completedCount / taskCount) * 100);

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      taskCount,
      completedCount,
      progress,
    };
  });

  const [taskCountResult, commentActivity, memberActivity, taskActivity] =
    await Promise.all([
      prisma.task.count({
        where: {
          column: {
            board: {
              project: {
                organizationId: orgId,
              },
            },
          },
        },
      }),
      prisma.comment.findMany({
        where: {
          task: {
            column: {
              board: {
                project: {
                  organizationId: orgId,
                },
              },
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
          task: {
            select: {
              title: true,
              column: {
                select: {
                  board: {
                    select: {
                      project: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
      prisma.organizationMember.findMany({
        where: {
          organizationId: orgId,
        },
        select: {
          id: true,
          joinedAt: true,
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          joinedAt: "desc",
        },
        take: 5,
      }),
      prisma.task.findMany({
        where: {
          column: {
            board: {
              project: {
                organizationId: orgId,
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          createdBy: {
            select: {
              name: true,
              avatar: true,
            },
          },
          column: {
            select: {
              board: {
                select: {
                  project: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

  const activity: ActivityItem[] = [
    ...commentActivity.map((comment) => ({
      id: comment.id,
      type: "COMMENT_CREATED" as const,
      message: `commented on "${comment.task.title}"`,
      userName: comment.user.name,
      userAvatar: comment.user.avatar,
      createdAt: comment.createdAt.toISOString(),
      projectName: comment.task.column.board.project.name,
      taskTitle: comment.task.title,
    })),
    ...memberActivity.map((member) => ({
      id: member.id,
      type: "MEMBER_JOINED" as const,
      message: "joined the organization",
      userName: member.user.name,
      userAvatar: member.user.avatar,
      createdAt: member.joinedAt.toISOString(),
      projectName: null,
      taskTitle: null,
    })),
    ...taskActivity.map((task) => ({
      id: task.id,
      type: "TASK_CREATED" as const,
      message: `created task "${task.title}"`,
      userName: task.createdBy.name,
      userAvatar: task.createdBy.avatar,
      createdAt: task.createdAt.toISOString(),
      projectName: task.column.board.project.name,
      taskTitle: task.title,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const completedTasks = await prisma.task.count({
    where: {
      columnId: { in: doneColumnIds },
    },
  });

  return {
    stats: {
      totalProjects: await prisma.project.count({
        where: {
          organizationId: orgId,
        },
      }),
      totalTasks: taskCountResult,
      activeTasks: taskCountResult - completedTasks,
      completedTasks,
    },
    recentProjects,
    activity,
  };
};

"use client";

import {
  Activity,
  CheckCircle2,
  ListTodo,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ActivityItem, ActivityType } from "../types";
import { timeAgo } from "@/lib/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  TASK_CREATED: ListTodo,
  TASK_UPDATED: ListTodo,
  TASK_MOVED: CheckCircle2,
  COMMENT_CREATED: MessageSquare,
  MEMBER_JOINED: UserPlus,
};

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <Activity className="size-6" />
          </div>

          <div>
            <p className="font-medium">No activity yet</p>

            <p className="text-muted-foreground text-sm">
              Activity from tasks, comments, and members will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-4">
          {activities.map((item) => {
            const Icon = ACTIVITY_ICONS[item.type] ?? ListTodo;

            return (
              <li key={item.id} className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Avatar className="size-5">
                        {item.userAvatar && (
                          <AvatarImage
                            src={item.userAvatar}
                            alt={item.userName}
                          />
                        )}

                        <AvatarFallback className="text-[10px]">
                          {item.userName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <p className="truncate text-sm">
                        <span className="font-medium">{item.userName}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.message}
                        </span>
                      </p>
                    </div>

                    <span className="text-muted-foreground shrink-0 text-xs">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>

                  {item.projectName && (
                    <p className="text-muted-foreground pl-6.5 mt-1 text-xs">
                      in {item.projectName}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

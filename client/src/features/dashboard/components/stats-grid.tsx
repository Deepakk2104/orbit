"use client";

import { FolderKanban, ListTodo, CircleDot, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="gap-0">
      <CardContent className="flex items-center gap-4 py-5">
        <div className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            {label}
          </p>

          <p className="font-heading text-2xl font-semibold tabular-nums">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({
  stats,
}: {
  stats: {
    totalProjects: number;
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Projects"
        value={stats.totalProjects}
        icon={FolderKanban}
      />

      <StatCard label="Tasks" value={stats.totalTasks} icon={ListTodo} />

      <StatCard label="Active" value={stats.activeTasks} icon={CircleDot} />

      <StatCard
        label="Completed"
        value={stats.completedTasks}
        icon={CheckCircle2}
      />
    </div>
  );
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KanbanSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createBoard, getBoard } from "../api/boards.api";
import { KanbanBoard } from "./kanban-board";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BoardSection({
  orgId,
  projectId,
}: {
  orgId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();

  const {
    data: board,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["board", orgId, projectId],
    queryFn: () => getBoard(orgId, projectId),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: () => createBoard(orgId, projectId),
    onSuccess: () => {
      toast.success("Board created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["board", orgId, projectId],
      });
    },
    onError: () => {
      toast.error("Unable to create board.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  if (isError || !board) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Board</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
            <KanbanSquare className="text-muted-foreground size-8" />

            <div>
              <p className="font-medium">No board yet</p>
              <p className="text-muted-foreground text-sm">
                Create a board to start organizing tasks with default columns.
              </p>
            </div>

            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Create board
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <KanbanBoard orgId={orgId} projectId={projectId} />;
}

"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteTask, updateTask } from "@/features/tasks/api/tasks.api";
import { CommentSection } from "@/features/tasks/components/comment-section";
import { listMembers } from "@/features/organizations/api/organizations.api";
import { toDateInputValue } from "../utils/date";
import type { BoardTask, TaskPriority } from "../types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskDialog({
  orgId,
  projectId,
  task,
  onClose,
}: {
  orgId: string;
  projectId: string;
  task: BoardTask;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(toDateInputValue(task.dueDate));
  const [assigneeId, setAssigneeId] = useState(task.assigneeId ?? "");
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["board", orgId, projectId],
    });
  };

  const { data: members } = useQuery({
    queryKey: ["organization-members", orgId],
    queryFn: () => listMembers(orgId),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateTask(orgId, projectId, task.id, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        dueDate: dueDate || null,
        assigneeId: assigneeId || null,
      }),
    onSuccess: () => {
      toast.success("Task updated successfully.");
      invalidate();
      onClose();
    },
    onError: () => {
      toast.error("Unable to update task.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(orgId, projectId, task.id),
    onSuccess: () => {
      toast.success("Task deleted successfully.");
      invalidate();
      onClose();
    },
    onError: () => {
      toast.error("Unable to delete task.");
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Task title is required");

      return;
    }

    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteMutation.mutate();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>

          <DialogDescription>Update the task details below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={updateMutation.isPending}
            />

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={updateMutation.isPending}
              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 dark:bg-input/30 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-2 text-base outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>

              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>

              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={updateMutation.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>

            <Select
              value={assigneeId}
              onValueChange={(value) => setAssigneeId(value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {assigneeId
                    ? members?.find((member) => member.id === assigneeId)?.user
                        .name
                    : "Unassigned"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>

                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t pt-4">
          <CommentSection
            orgId={orgId}
            projectId={projectId}
            taskId={task.id}
          />
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="mr-auto"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Delete
          </Button>

          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

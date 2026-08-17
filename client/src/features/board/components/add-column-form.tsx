"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createColumn } from "../api/columns.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddColumnForm({
  orgId,
  projectId,
}: {
  orgId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const mutation = useMutation({
    mutationFn: () => createColumn(orgId, projectId, { name }),
    onSuccess: () => {
      setName("");
      setOpen(false);

      toast.success("Column created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["board", orgId, projectId],
      });
    },
    onError: () => {
      toast.error("Unable to create column.");
    },
  });

  if (!open) {
    return (
      <Button
        variant="ghost"
        className="w-72 shrink-0 items-start justify-start rounded-xl border border-dashed text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />

        Add column
      </Button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (name.trim()) {
          mutation.mutate();
        }
      }}
      className="w-72 shrink-0 space-y-2 rounded-xl border bg-muted/30 p-3"
    >
      <Input
        autoFocus
        placeholder="Column name..."
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={mutation.isPending}
      />

      <div className="flex items-center gap-1.5">
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || !name.trim()}
        >
          {mutation.isPending && (
            <Loader2 className="mr-1 size-3.5 animate-spin" />
          )}

          Add column
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setName("");
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </form>
  );
}
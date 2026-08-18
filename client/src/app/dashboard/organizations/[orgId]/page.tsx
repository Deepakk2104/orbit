"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Loader2, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  deleteOrganization,
  getOrganization,
  updateOrganization,
} from "@/features/organizations/api/organizations.api";
import { InviteMemberForm } from "@/features/organizations/components/invite-member-form";
import { MembersList } from "@/features/organizations/components/members-list";
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from "@/features/organizations/schemas/create-organization.schema";

import { useOrganizationStore } from "@/store/organization.store";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

export default function OrganizationDetailPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;

  const router = useRouter();

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );
  const setCurrentOrganization = useOrganizationStore(
    (state) => state.setCurrentOrganization
  );
  const clearOrganization = useOrganizationStore(
    (state) => state.clearOrganization
  );

  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);

  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => getOrganization(orgId),
  });

  useEffect(() => {
    if (organization && currentOrganization?.id !== organization.id) {
      setCurrentOrganization({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        role: organization.role,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      });
    }
  }, [organization, currentOrganization?.id, setCurrentOrganization]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    values: {
      name: organization?.name ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateOrganizationFormData) =>
      updateOrganization(orgId, data),
    onSuccess: () => {
      toast.success("Organization updated successfully.");
      setEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["organization", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
    onError: () => {
      toast.error("Unable to update organization.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganization(orgId),
    onSuccess: () => {
      toast.success("Organization deleted successfully.");

      clearOrganization();

      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      router.push("/dashboard/organizations");
    },
    onError: () => {
      toast.error("Unable to delete organization.");
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${organization?.name}"? This will permanently remove the organization and all of its data.`
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const isOwner = organization?.role === "OWNER";

  if (isLoading || !organization) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {organization.name}
            </h1>

            <p className="text-muted-foreground text-sm">
              Manage members, settings, and projects.
            </p>
          </div>

          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium uppercase">
            {organization.role}
          </span>
        </div>

        <Link
          href={`/dashboard/organizations/${orgId}/projects`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <FolderKanban className="mr-2 size-3.5" />
          Projects
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Organization</CardTitle>

              {isOwner && !editing && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="mr-2 size-3.5" />
                  Edit
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {editing && isOwner ? (
                <form
                  onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization name</Label>

                    <Input
                      id="name"
                      {...register("name")}
                      disabled={updateMutation.isPending}
                    />

                    {errors.name && (
                      <p className="text-destructive text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )}
                      Save
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name</dt>

                    <dd className="font-medium">{organization.name}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Slug</dt>

                    <dd className="font-medium">{organization.slug}</dd>
                  </div>
                </dl>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
            </CardHeader>

            <CardContent>
              <MembersList orgId={orgId} />
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-8">
          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invite members</CardTitle>
              </CardHeader>

              <CardContent>
                <InviteMemberForm orgId={orgId} />
              </CardContent>
            </Card>
          )}

          {isOwner && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive text-base">
                  Danger zone
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Deleting this organization removes all projects, boards, and
                  tasks. This action cannot be undone.
                </p>

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 size-4" />
                  )}
                  Delete organization
                </Button>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

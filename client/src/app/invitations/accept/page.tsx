"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Building2, Loader2 } from "lucide-react";

import { acceptInvitation } from "@/features/organizations/api/organizations.api";
import { ProtectedRoute } from "@/features/auth/components/protected-route";

import { useOrganizationStore } from "@/store/organization.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const setCurrentOrganization = useOrganizationStore(
    (state) => state.setCurrentOrganization
  );

  const [organizationName, setOrganizationName] = useState<string | null>(null);

  const acceptMutation = useMutation({
    mutationFn: (inviteToken: string) => acceptInvitation(inviteToken),
    onSuccess: (result) => {
      setOrganizationName(result.organization.name);
      setCurrentOrganization({
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
        role: result.role,
      });
    },
  });

  const startedRef = useRef(false);

  useEffect(() => {
    if (token && !startedRef.current) {
      startedRef.current = true;
      acceptMutation.mutate(token);
    }
  }, [token, acceptMutation]);

  if (!token) {
    return (
      <ProtectedRoute>
        <InvitationCard
          title="Invitation"
          body={
            <p className="text-destructive font-medium">
              Missing invitation token.
            </p>
          }
          actionLabel="Back to dashboard"
          onAction={() => router.push("/dashboard")}
        />
      </ProtectedRoute>
    );
  }

  if (acceptMutation.isPending) {
    return (
      <ProtectedRoute>
        <InvitationCard
          title="Invitation"
          body={
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="text-muted-foreground size-6 animate-spin" />

              <p className="text-muted-foreground text-sm">
                Accepting your invitation...
              </p>
            </div>
          }
        />
      </ProtectedRoute>
    );
  }

  if (acceptMutation.isSuccess) {
    return (
      <ProtectedRoute>
        <InvitationCard
          title="Invitation"
          body={
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
                <Building2 className="text-primary size-6" />
              </div>

              <div>
                <p className="font-medium">
                  You are now a member of{" "}
                  <span className="text-primary">{organizationName}</span>
                </p>

                <p className="text-muted-foreground mt-1 text-sm">
                  You can start collaborating right away.
                </p>
              </div>
            </div>
          }
          actionLabel="Go to my organizations"
          onAction={() => router.push("/dashboard/organizations")}
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <InvitationCard
        title="Invitation"
        body={
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-destructive font-medium">
              Unable to accept this invitation.
            </p>

            <p className="text-muted-foreground text-sm">
              Please contact the person who invited you.
            </p>
          </div>
        }
        actionLabel="Back to dashboard"
        onAction={() => router.push("/dashboard")}
      />
    </ProtectedRoute>
  );
}

function InvitationCard({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent className="text-center">{body}</CardContent>

        {actionLabel && onAction && (
          <CardContent className="pt-0 text-center">
            <Button onClick={onAction}>{actionLabel}</Button>
          </CardContent>
        )}
      </Card>
    </main>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}

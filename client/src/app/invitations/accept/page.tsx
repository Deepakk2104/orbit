"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const result = await acceptInvitation(token);

        if (cancelled) {
          return;
        }

        setOrganizationName(result.organization.name);
        setCurrentOrganization({
          id: result.organization.id,
          name: result.organization.name,
          slug: result.organization.slug,
          role: result.role,
          createdAt: "",
          updatedAt: "",
        });

        setStatus("success");
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          typeof error === "object" && error !== null && "response" in error
            ? (
                error as {
                  response?: {
                    data?: {
                      message?: string;
                    };
                  };
                }
              ).response?.data?.message
            : undefined;

        setErrorMessage(message ?? "Unable to accept this invitation.");
        setStatus("error");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [token, setCurrentOrganization]);

  return (
    <ProtectedRoute>
      <main className="bg-background flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">Invitation</CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            {status === "loading" ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />

                <p className="text-muted-foreground text-sm">
                  Accepting your invitation...
                </p>
              </div>
            ) : status === "success" ? (
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

                <Button onClick={() => router.push("/dashboard/organizations")}>
                  Go to my organizations
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="text-destructive font-medium">{errorMessage}</p>

                <p className="text-muted-foreground text-sm">
                  Please contact the person who invited you.
                </p>

                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Back to dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
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

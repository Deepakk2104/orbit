"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { resetPassword as resetPasswordApi } from "@/features/auth/api/auth.api";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/schemas/reset-password.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (
    data: ResetPasswordFormData
  ) => {
    try {
      const response = await resetPasswordApi({
        token,
        password: data.password,
      });

      toast.success(response.message);

      router.push("/login");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
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

      toast.error(
        message ?? "Unable to reset your password."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create a new password
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            Choose a strong password for your Orbit account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>

            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              disabled={isSubmitting}
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !token}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            {isSubmitting
              ? "Updating password..."
              : "Update password"}
          </Button>
        </form>
      </div>
    </main>
  );
}
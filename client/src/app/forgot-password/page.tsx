"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { forgotPassword } from "@/features/auth/api/auth.api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/schemas/forgot-password.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (
    data: ForgotPasswordFormData
  ) => {
    try {
      const response = await forgotPassword(data.email);

      toast.success(response.message);
    } catch {
      toast.error(
        "Unable to process your request. Please try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Forgot your password?
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            Enter your email and we will send you a secure password
            reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              disabled={isSubmitting}
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            {isSubmitting
              ? "Sending link..."
              : "Send reset link"}
          </Button>
        </form>
      </div>
    </main>
  );
}
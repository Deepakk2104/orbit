import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="bg-muted/40 relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%)]" />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              Orbit
            </Link>

            <div className="max-w-lg">
              <p className="text-primary mb-4 text-sm font-medium">
                WELCOME BACK
              </p>

              <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
                Your teams
                <br />
                work awaits.
              </h1>

              <p className="text-muted-foreground mt-6 max-w-md text-base leading-7">
                Pick up where you left off and keep your projects moving forward
                with Orbit.
              </p>
            </div>

            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Orbit
            </p>
          </div>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="text-xl font-semibold tracking-tight">
                Orbit
              </Link>
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="text-muted-foreground text-sm">
                Sign in to continue to your Orbit workspace.
              </p>
            </div>

            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}

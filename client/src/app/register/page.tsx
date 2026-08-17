import Link from "next/link";

import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
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
                THE WORKSPACE FOR MODERN TEAMS
              </p>

              <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
                Build better.
                <br />
                Ship together.
              </h1>

              <p className="text-muted-foreground mt-6 max-w-md text-base leading-7">
                Organize projects, manage work, and keep your team moving with
                Orbit.
              </p>
            </div>

            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Orbit
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="text-xl font-semibold tracking-tight">
                Orbit
              </Link>
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h2>

              <p className="text-muted-foreground text-sm">
                Start organizing your teams work with Orbit.
              </p>
            </div>

            <RegisterForm />
          </div>
        </section>
      </div>
    </main>
  );
}

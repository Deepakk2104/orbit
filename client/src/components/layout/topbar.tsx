"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useTheme } from "next-themes";
import { Search, Moon, Sun, Menu } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useOrganizationStore } from "@/store/organization.store";
import { logout } from "@/features/auth/api/auth.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TopbarProps {
  onOpenMobileNav?: () => void;
}

function TopbarContent({ onOpenMobileNav }: TopbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { resolvedTheme, setTheme } = useTheme();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearOrganization = useOrganizationStore(
    (state) => state.clearOrganization
  );

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = query.trim();

    router.push(
      trimmed
        ? `/dashboard/tasks?q=${encodeURIComponent(trimmed)}`
        : "/dashboard/tasks"
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Even if the server call fails, clear the local session.
    }

    clearAuth();
    clearOrganization();

    router.replace("/login");
  };

  return (
    <header className="bg-background/80 supports-backdrop-filter:backdrop-blur-xs sticky top-0 z-30 border-b">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onOpenMobileNav}
          className="lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>

        <form onSubmit={handleSearch} className="relative w-full max-w-md">
          <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="h-9 pl-9"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Account menu"
                />
              }
            >
              <Avatar className="size-8 cursor-pointer">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}

                <AvatarFallback>
                  {user?.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <p className="font-medium">{user?.name}</p>

                  <p className="text-muted-foreground text-xs font-normal">
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function Topbar(props: TopbarProps) {
  return (
    <Suspense>
      <TopbarContent {...props} />
    </Suspense>
  );
}

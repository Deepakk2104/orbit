"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Settings,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { useOrganizationStore } from "@/store/organization.store";
import { useAuthStore } from "@/store/auth.store";
import { logout } from "@/features/auth/api/auth.api";
import { OrganizationSwitcher } from "@/features/organizations/components/organization-switcher";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );
  const clearOrganization = useOrganizationStore(
    (state) => state.clearOrganization
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseOrgPath = currentOrganization?.id
    ? `/dashboard/organizations/${currentOrganization.id}`
    : null;

  const navItems: SidebarNavItem[] = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: baseOrgPath
        ? `${baseOrgPath}/projects`
        : "/dashboard/organizations",
      icon: FolderKanban,
    },
    {
      label: "Tasks",
      href: "/dashboard/tasks",
      icon: ListTodo,
    },
    {
      label: "Members",
      href: baseOrgPath ?? "/dashboard/organizations",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/dashboard/organizations",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);

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
    <div className="flex h-full flex-col gap-6 p-4" onClick={onNavigate}>
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 px-2 pt-1"
        aria-label="Orbit dashboard"
      >
        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>

        <span className="font-heading text-lg font-semibold tracking-tight">
          Orbit
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : item.href.includes("/organizations") &&
                  (pathname === "/dashboard/organizations" ||
                    pathname === "/dashboard/organizations/projects" ||
                    pathname === "/dashboard/organizations/members")
                ? item.label ===
                  (pathname === "/dashboard/organizations/projects"
                    ? "Projects"
                    : pathname === "/dashboard/organizations/members"
                      ? "Members"
                      : "Settings")
                : pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-sidebar-foreground flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                !isActive &&
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1">
        <Link
          href="/dashboard/profile"
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/dashboard/profile") &&
              "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          <User className="size-4" />
          Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {isLoggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Logout
        </button>
      </div>

      <div className="border-sidebar-border space-y-3 border-t pt-3">
        <OrganizationSwitcher className="w-full px-3 py-2" />

        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="size-8 cursor-pointer">
            {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}

            <AvatarFallback>
              {user?.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-sidebar-foreground truncate text-sm font-medium">
              {user?.name ?? "Signed out"}
            </p>

            <p className="text-sidebar-foreground/60 truncate text-xs">
              {user?.email ?? "Sign in to continue"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

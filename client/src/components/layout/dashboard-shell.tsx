"use client";

import { useState } from "react";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <aside className="border-border bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:block">
        <Sidebar />
      </aside>

      <div className="lg:pl-64">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>

      <Dialog open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DialogContent
          className={cn(
            "left-0 top-0 h-full max-h-none w-72 max-w-[85%] -translate-x-0 -translate-y-0 rounded-none p-0",
            "gap-0"
          )}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Navigation</DialogTitle>

          <DialogDescription className="sr-only">
            Application navigation menu
          </DialogDescription>

          <Sidebar onNavigate={() => setMobileNavOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

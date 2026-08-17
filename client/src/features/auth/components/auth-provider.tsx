"use client";

import { useEffect, useState } from "react";
import { refreshSession } from "../api/auth.api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      await refreshSession();

      setIsHydrated(true);
    };

    restoreSession();
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading Orbit...</div>
      </div>
    );
  }

  return children;
}

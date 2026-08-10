"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getCurrentUser } from "../api/auth.api";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    accessToken,
    setAuth,
    clearAuth,
  } = useAuthStore();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (!accessToken) {
        setIsHydrated(true);
        return;
      }

      try {
        const user = await getCurrentUser(accessToken);

        setAuth(user, accessToken);
      } catch {
        clearAuth();
      } finally {
        setIsHydrated(true);
      }
    };

    restoreSession();
  }, [accessToken, setAuth, clearAuth]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading Orbit...
        </div>
      </div>
    );
  }

  return children;
}
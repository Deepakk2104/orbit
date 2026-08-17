"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: "OWNER" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}

interface OrganizationState {
  currentOrganization: Organization | null;
  setCurrentOrganization: (organization: Organization | null) => void;
  clearOrganization: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      currentOrganization: null,

      setCurrentOrganization: (organization) =>
        set({ currentOrganization: organization }),

      clearOrganization: () => set({ currentOrganization: null }),
    }),
    {
      name: "orbit-organization",
    }
  )
);

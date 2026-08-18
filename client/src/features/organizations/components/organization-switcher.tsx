"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { listOrganizations } from "../api/organizations.api";

import { useOrganizationStore } from "@/store/organization.store";

import { cn } from "@/lib/utils";

interface OrganizationSwitcherProps {
  className?: string;
}

export function OrganizationSwitcher({ className }: OrganizationSwitcherProps) {
  const router = useRouter();

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );
  const setCurrentOrganization = useOrganizationStore(
    (state) => state.setCurrentOrganization
  );

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => listOrganizations(),
  });

  useEffect(() => {
    if (!currentOrganization && organizations && organizations.length > 0) {
      setCurrentOrganization(organizations[0]);
    }
  }, [currentOrganization, organizations, setCurrentOrganization]);

  const handleChange = (orgId: string) => {
    const organization = organizations?.find((item) => item.id === orgId);

    if (organization) {
      setCurrentOrganization(organization);

      router.push(`/dashboard/organizations/${organization.id}`);
    }
  };

  return (
    <div
      style={{
        appearance: "none",
        backgroundImage:
          'url(\'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5-1.43-1.43L13 10.83l-5.5 2.5z"/></svg>\'',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1.2em",
      }}
      aria-label="Switch organization"
    >
      <select
        value={currentOrganization?.id ?? ""}
        onChange={(event) => handleChange(event.target.value)}
        className={cn(
          "dark:bg-muted text-muted-foreground focus-dark:bg-muted focus:text-text-100 focus-visible:ring-primary w-full cursor-pointer appearance-none rounded-md bg-white px-3 py-2 text-sm leading-tight transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2",
          className
        )}
        aria-label="Switch organization"
      >
        {!currentOrganization && (
          <option value="" disabled>
            Select organization
          </option>
        )}

        {organizations?.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>
    </div>
  );
}

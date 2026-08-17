"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { listOrganizations } from "../api/organizations.api";

import { useOrganizationStore } from "@/store/organization.store";

export function OrganizationSwitcher() {
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

  const handleChange = (orgId: string) => {
    const organization = organizations?.find((item) => item.id === orgId);

    if (organization) {
      setCurrentOrganization(organization);

      router.push(`/dashboard/organizations/${organization.id}`);
    }
  };

  return (
    <select
      value={currentOrganization?.id ?? ""}
      onChange={(event) => handleChange(event.target.value)}
      className="bg-background focus:border-primary h-9 rounded-md border px-3 text-sm outline-none transition-colors"
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
  );
}

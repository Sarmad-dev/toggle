"use client";
import React from "react";
import { useGetOrganization } from "@/hooks/organization/use-get-organization";
import Image from "next/image";
import { MultiSelect } from "@/components/ui/multi-select";
import { useUsers } from "@/hooks/use-users";

const OrganizationPage = () => {
  const { users } = useUsers();
  const { organization } = useGetOrganization();
  const org = organization?.data;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        {org?.logo && (
          <Image
            src={org.logo}
            alt={org.name}
            className="h-16 w-16 rounded-full object-cover"
            width={64}
            height={64}
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{org?.name}</h1>
          {org?.description && (
            <p className="mt-1 text-sm text-gray-500">{org?.description}</p>
          )}
        </div>
      </div>
      <div className="flex space-x-6">
        <div>
          <strong>Projects:</strong> {org?.projects.length}
        </div>
        <div>
          <strong>Members:</strong> {org?.members.length}
        </div>
        <div>
          <strong>Owner:</strong> {org?.owner.name}
        </div>
      </div>
      <section>
        <h2 className="text-lg font-semibold">Add New Member</h2>
        <MultiSelect
          options={
            users?.map((user) => ({
              label: user.name as string,
              value: user.id,
              email: user.email,
              imageUrl: user.image as string,
            })) || []
          }
          width="w-full"
          selected={[]}
          onChange={() => {}}
        />
      </section>
    </div>
  );
};

export default OrganizationPage;

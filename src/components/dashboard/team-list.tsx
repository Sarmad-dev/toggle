"use client";

import { useEffect, useState } from "react";
import { getManagerTeams, getTeams } from "@/lib/actions/teams";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import TeamListTable from "./team-list-table";

type Team = {
  id: string;
  name: string;
  description: string | null;
  members: {
    user: {
      username: string;
      email: string;
    };
    role: string;
  }[];
  projects: {
    name: string;
  }[];
};

export function TeamList() {
  const { user } = useUser();

  const { data: managerTeams, isLoading: managerTeamsLoading } = useQuery({
    queryKey: ["manager-teams"],
    queryFn: async () => await getManagerTeams(user.id),
    enabled: !!user,
  });

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => await getTeams(user.id),
    enabled: !!user,
  });

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold mb-3">Manager Teams</h2>
        <div className="rounded-md border">
          <TeamListTable teams={managerTeams?.data!} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Members Teams</h2>
        <div className="rounded-md border">
          <TeamListTable teams={teams?.data!} />
        </div>
      </div>
    </div>
  );
}

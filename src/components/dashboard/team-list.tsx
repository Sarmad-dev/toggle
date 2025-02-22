"use client";

import { getManagerTeams, getTeams } from "@/lib/actions/teams";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import TeamListTable from "./team-list-table";
import { TeamList as TeamListType } from "@/types/global";
import { Loader2 } from "lucide-react";

export function TeamList() {
  const { user } = useUser();

  const { data: managerTeams, isLoading: managerTeamsLoading } = useQuery({
    queryKey: ["manager-teams"],
    queryFn: async () => await getManagerTeams(user?.id as string),
    enabled: !!user,
  });

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => await getTeams(user?.id as string),
    enabled: !!user,
  });

  if (managerTeamsLoading || teamsLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-bold mb-3">Manager Teams</h2>
        <div className="rounded-md border">
          <TeamListTable teams={managerTeams?.data as TeamListType[]} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Members Teams</h2>
        <div className="rounded-md border">
          <TeamListTable teams={teams?.data as TeamListType[]} />
        </div>
      </div>
    </div>
  );
}

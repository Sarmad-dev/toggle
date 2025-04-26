"use client";

import { getManagerTeams, getTeams } from "@/lib/actions/teams";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import TeamListTable from "./team-list-table";
import { TeamList as TeamListType } from "@/types/global";
import Image from "next/image";
import TeamLoader from "../loaders/team-loader";

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
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <TeamLoader />
      </div>
    );
  }

  // Check if there are no teams
  const hasManagerTeams = managerTeams?.data && managerTeams.data.length > 0;
  const hasTeams = teams?.data && teams.data.length > 0;

  if (!hasManagerTeams && !hasTeams) {
    return (
      <div className="flex flex-col justify-center items-center h-[450px] w-full">
        <div className="relative w-[430px] h-[450px]">
          <Image
            src="/assets/no-teams.svg"
            alt="No teams"
            fill
            priority
            className="object-contain"
          />
        </div>
        <p className="text-muted-foreground mt-4">Create your first team to get started</p>
      </div>
    );
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

import { TeamList } from "@/components/dashboard/team-list";
import { CreateTeam } from "@/components/dashboard/create-team";

export default function TeamsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
        <CreateTeam />
      </div>
      <TeamList />
    </div>
  );
} 
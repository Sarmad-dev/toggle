"use client";

import { useEffect, useState } from "react";
import { getTeams } from "@/lib/actions/teams";
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
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function fetchTeams() {
      // TODO: Replace with actual user ID
      const result = await getTeams("user_id");
      if (result?.success) {
        setTeams(result?.data as Team[]);
      }
    }
    fetchTeams();
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{team.name}</TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {team.members.map((member, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </TableCell>
              <TableCell>{team.projects.length} projects</TableCell>
              <TableCell>{team.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 
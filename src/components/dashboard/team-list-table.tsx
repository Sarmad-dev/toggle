import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "lucide-react";
import { TeamList } from "@/types/global";

interface TeamListTableProps {
  teams: TeamList[];
}

const TeamListTable = ({ teams }: TeamListTableProps) => {
  return (
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
        {teams?.map((team) => (
          <TableRow key={team.id}>
            <TableCell className="font-medium">{team.name}</TableCell>
            <TableCell>
              <div className="flex -space-x-2">
                {team.members.map((member, i) => (
                  <Avatar
                    key={i}
                    className="h-8 w-8 border-2 border-background"
                  >
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
  );
};

export default TeamListTable;

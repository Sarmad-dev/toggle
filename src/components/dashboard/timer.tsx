"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/stores/use-timer-store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/actions/projects";
import { useUser } from "@/hooks/use-user";

export function Timer() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const {
    isRunning,
    description,
    duration,
    selectedProjectId,
    start,
    stop,
    setDescription,
    setSelectedProject,
    tick,
  } = useTimerStore();

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(user?.id),
    enabled: !!user,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const selectedProject = projects?.data?.find(
    (project) => project.id === selectedProjectId
  );

  return (
    <div className="space-y-4 rounded-lg border p-4 mb-4">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Input
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1"
            />
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Search projects..." />
              <CommandList>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup heading="Projects">
                  {projects?.data?.map((project) => (
                    <CommandItem
                      key={project.id}
                      onSelect={() => {
                        setSelectedProject(project.id);
                        setOpen(false);
                      }}
                    >
                      <span
                        className="mr-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: project.color || "#000" }}
                      />
                      {project.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          onClick={() => (isRunning ? stop(user?.id) : start())}
          variant={isRunning ? "destructive" : "default"}
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full shadow-lg transition-all duration-200",
            isRunning && "bg-destructive hover:bg-destructive/90",
            !isRunning && "bg-primary hover:bg-primary/90"
          )}
          disabled={(!selectedProjectId && !isRunning) || !user}
        >
          {isRunning ? (
            <Square className="h-5 w-5 text-white" strokeWidth={2.5} />
          ) : (
            <Play className="h-5 w-5 text-white ml-0.5" strokeWidth={2.5} />
          )}
        </Button>
      </div>
      {selectedProject && (
        <div className="text-sm text-muted-foreground">
          Project: {selectedProject.name}
        </div>
      )}
      <div className="text-2xl font-mono text-center">{formatTime(duration)}</div>
    </div>
  );
} 
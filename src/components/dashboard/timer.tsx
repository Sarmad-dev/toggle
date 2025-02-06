"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Timer() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 rounded-lg border p-4 mb-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="What are you working on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant="outline"
          size="icon"
          className={cn(
            "h-10 w-10",
            isRunning && "bg-destructive hover:bg-destructive/90"
          )}
        >
          {isRunning ? (
            <StopCircle className="h-4 w-4" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="text-2xl font-mono text-center">{formatTime(time)}</div>
    </div>
  );
} 
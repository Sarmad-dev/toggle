"use client";

import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { Button } from "./button";
import { MultiSelectOption } from "@/types/global";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useUser } from "@/hooks/use-user";

interface MultiSelectProps {
  placeholder?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
  width?: string;
  isLoading?: boolean;
}

export function MultiSelect({
  placeholder,
  options = [],
  selected = [],
  onChange = () => {},
  className = "",
  width,
  isLoading,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMembers, setSelectedMembers] = React.useState<
    MultiSelectOption[] | null
  >(null);

  const { user } = useUser();

  const handleUnselect = (value: string) => {
    onChange(selected?.filter((v) => v !== value));
    setSelectedMembers(
      (prevMembers) =>
        prevMembers?.filter(
          (member) => member.value !== value
        ) as MultiSelectOption[]
    );
  };

  const handleSelect = (data: MultiSelectOption) => {
    const { value, label, email, imageUrl } = data;
    if (selected?.includes(value)) {
      onChange(selected.filter((v) => v !== value));
      setSelectedMembers(
        (prevMembers) =>
          prevMembers?.filter(
            (member) => member.value !== value
          ) as MultiSelectOption[]
      );
    } else {
      onChange([...(selected ?? []), value]);
      setSelectedMembers((prevMembers) => [
        ...(prevMembers ?? []),
        { value: value, label, email, imageUrl },
      ]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Toggle member selection"
          className={cn("w-full justify-between h-[50px]", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {(selectedMembers?.length === 0 || selectedMembers === null) &&
              "Select members..."}
            {selectedMembers?.map((member) => {
              return (
                <Badge
                  variant="secondary"
                  key={member.value}
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(member.value);
                  }}
                >
                  {member.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${width} p-0`}
        align="start"
        side="bottom"
        aria-label="Member selection options"
      >
        <Command className={className} {...props}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={(value) => setSearchQuery(value)}
            aria-label="Search users"
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="w-full flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "No options found"
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {options
                .filter((u) => u.value !== user?.id)
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="w-full px-2 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={option.imageUrl} />
                          <AvatarFallback className="text-lg">
                            {option.label.charAt(0).toUpperCase()}
                            {option.label.charAt(1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {option.email && (
                            <span className="text-xs text-muted-foreground">
                              {option.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedMembers?.find(
                            (member) => member.value === option.value
                          )
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

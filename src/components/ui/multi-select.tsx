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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "./button";

export interface Option {
  label: string; // username
  value: string; // id
  email?: string; // optional email for searching
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options = [],
  selected = [],
  onChange = () => {},
  className = "",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchQuery);

  // Debounce search input to improve performance
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) ? options : [];
  }, [options]);

  const safeSelected = React.useMemo(() => {
    return Array.isArray(selected) ? selected : [];
  }, [selected]);

  const filteredOptions = React.useMemo(() => {
    if (!Array.isArray(safeOptions)) return [];
    const search = debouncedSearch.toLowerCase();
    return safeOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(search) ||
        option.email?.toLowerCase().includes(search)
    );
  }, [safeOptions, debouncedSearch]);

  const handleUnselect = (value: string) => {
    onChange(safeSelected.filter((v) => v !== value));
  };

  const handleSelect = (value: string) => {
    if (safeSelected.includes(value)) {
      onChange(safeSelected.filter((v) => v !== value));
    } else {
      onChange([...safeSelected, value]);
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
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {safeSelected.length === 0 && "Select members..."}
            {safeSelected.map((value) => {
              const selectedOption = safeOptions.find(
                (opt) => opt.value === value
              );
              return (
                <Badge
                  variant="secondary"
                  key={value}
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(value);
                  }}
                >
                  {selectedOption ? selectedOption.label : "Unknown"}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        side="bottom"
        aria-label="Member selection options"
      >
        <Command className={className} {...props}>
          <CommandInput
            placeholder="Search users..."
            value={searchQuery}
            onValueChange={(value) => setSearchQuery(value)}
            aria-label="Search users"
          />
          <CommandList>
            <CommandEmpty>No user found</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No options found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        safeSelected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      {option.email && (
                        <span className="text-xs text-muted-foreground">
                          {option.email}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

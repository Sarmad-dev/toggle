import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ControllerRenderProps } from "react-hook-form";

type Props = {
  field: ControllerRenderProps<
    {
      name: string;
      billable: boolean;
      members: string[];
      isUseAI: boolean;
      color?: string | undefined;
      description?: string | undefined;
      billableAmount?: number | undefined;
      dueDate?: Date | undefined;
    },
    "dueDate"
  >;
};

const CustomCalendar = ({ field }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full h-[50px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}>
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a due date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default CustomCalendar;

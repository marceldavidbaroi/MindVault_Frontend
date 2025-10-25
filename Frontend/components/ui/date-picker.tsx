"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  placeholder?: string;
  inputClassName?: string;
}

// ✅ Format date as "Month Day, Year"
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onSelect,
  placeholder,
  inputClassName,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full text-left", inputClassName)}
        >
          {selected ? formatDate(selected) : placeholder || "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onSelect(date!);
            setOpen(false);
          }}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
};

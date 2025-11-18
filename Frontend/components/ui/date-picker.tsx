"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Input } from "./input";
import { Label } from "./label";
import "react-day-picker/dist/style.css";

interface Calendar28Props {
  value?: string; // YYYY-MM-DD string
  onChange?: (date: string) => void;
}

export function Calendar28({ value, onChange }: Calendar28Props) {
  const [open, setOpen] = React.useState(false);

  // Always use a local Date object
  const initialDate = value ? new Date(value) : new Date();
  const [date, setDate] = React.useState<Date>(initialDate);
  const [month, setMonth] = React.useState<Date>(initialDate);

  const [displayValue, setDisplayValue] = React.useState(
    format(initialDate, "MMMM dd, yyyy")
  );

  const handleSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setMonth(selectedDate);

    // Format as local YYYY-MM-DD using date-fns
    const formatted = format(selectedDate, "yyyy-MM-dd");
    setDisplayValue(format(selectedDate, "MMMM dd, yyyy"));

    onChange?.(formatted);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date
      </Label>
      <div className="relative flex gap-2">
        {/* Input is readonly, opens calendar on click */}
        <Input
          id="date"
          value={displayValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10 text-foreground border border-border rounded-md cursor-pointer"
          readOnly
          onClick={() => setOpen(true)}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-foreground"
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="sr-only">Select date</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-popover text-popover-foreground rounded-xl shadow-lg p-4 w-80"
            align="end"
            sideOffset={10}
          >
            <DayPicker
              mode="single"
              required
              selected={date}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
              className="bg-popover text-popover-foreground rounded-lg"
              styles={{
                caption: { color: "var(--foreground)" },
                head_cell: { color: "var(--foreground)" },
                day: { color: "var(--foreground)" },
                day_selected: {
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                },
                day_today: { borderColor: "var(--accent)", borderWidth: "1px" },
                day_outside: { color: "var(--muted-foreground)" },
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

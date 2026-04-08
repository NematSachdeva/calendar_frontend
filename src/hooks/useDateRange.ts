import { useState, useCallback } from "react";
import { isBefore } from "date-fns";
import type { DateRange } from "@/types/calendar";

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);

    setRange((prev) => {
      // If no start date, set this as start
      if (!prev.start) {
        return { start: date, end: null };
      }

      // If start exists but no end, set this as end
      if (prev.start && !prev.end) {
        if (isBefore(date, prev.start)) {
          return { start: date, end: prev.start };
        }
        return { start: prev.start, end: date };
      }

      // If both exist, reset and start new range
      return { start: date, end: null };
    });
  }, []);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setSelectedDate(null);
  }, []);

  return { range, selectedDate, selectDate, clearRange };
}

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
  isBefore,
} from "date-fns";

export function getCalendarDays(month: Date): Date[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function isCurrentMonth(date: Date, month: Date): boolean {
  return isSameMonth(date, month);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isDateInRange(
  date: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean {
  if (!rangeStart || !rangeEnd) return false;
  return isWithinInterval(date, { start: rangeStart, end: rangeEnd });
}

export function isRangeStart(
  date: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const start = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  return isSameDay(date, start);
}

export function isRangeEnd(
  date: Date,
  rangeStart: Date | null,
  rangeEnd: Date | null
): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const end = isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
  return isSameDay(date, end);
}

export function getEffectiveRange(
  rangeStart: Date | null,
  rangeEnd: Date | null
): { start: Date | null; end: Date | null } {
  if (!rangeStart || !rangeEnd) {
    return { start: rangeStart, end: null };
  }

  return {
    start: isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd,
    end: isAfter(rangeStart, rangeEnd) ? rangeStart : rangeEnd,
  };
}

export function calculateDaysBetween(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.round((end.getTime() - start.getTime()) / msPerDay)) + 1;
}

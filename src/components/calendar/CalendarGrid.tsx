import { useMemo } from "react";
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
  format,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import DayCell from "./DayCell";
import MonthNavigator from "./MonthNavigator";
import { WEEKDAYS } from "@/lib/constants";
import type { CalendarNote } from "@/types/calendar";

interface CalendarGridProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDayClick: (date: Date) => void;
  notesMap: Record<string, CalendarNote[]>;
  direction: number;
}

const CalendarGrid = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  rangeStart,
  rangeEnd,
  onDayClick,
  notesMap,
  direction,
}: CalendarGridProps) => {
  const today = new Date();

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const effectiveStart =
    rangeStart && rangeEnd
      ? isBefore(rangeStart, rangeEnd)
        ? rangeStart
        : rangeEnd
      : rangeStart;
  const effectiveEnd =
    rangeStart && rangeEnd
      ? isAfter(rangeStart, rangeEnd)
        ? rangeStart
        : rangeEnd
      : null;

  const monthKey = format(currentMonth, "yyyy-MM");

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-3 md:p-5">
      <MonthNavigator
        currentMonth={currentMonth}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
      />

      <div className="grid grid-cols-7 gap-px mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest py-2"
          >
            {wd}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={monthKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-px bg-border/30 rounded-lg overflow-hidden"
        >
          {days.map((day) => {
            const isOverflow = !isSameMonth(day, currentMonth);
            const isStart = effectiveStart ? isSameDay(day, effectiveStart) : false;
            const isEnd = effectiveEnd ? isSameDay(day, effectiveEnd) : false;
            const isInRange =
              effectiveStart && effectiveEnd
                ? isWithinInterval(day, { start: effectiveStart, end: effectiveEnd }) &&
                  !isStart &&
                  !isEnd
                : false;
            const dateStr = format(day, "yyyy-MM-dd");
            const dayNotes = notesMap[dateStr] || [];

            return (
              <DayCell
                key={dateStr}
                day={day.getDate()}
                isToday={isSameDay(day, today)}
                isOverflow={isOverflow}
                isRangeStart={isStart}
                isRangeEnd={isEnd}
                isInRange={isInRange}
                onClick={() => onDayClick(day)}
                notes={dayNotes}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>

      {effectiveStart && effectiveEnd && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm font-body text-muted-foreground"
        >
          Selected: <span className="font-semibold text-foreground">{format(effectiveStart, "MMM d")}</span>
          {" → "}
          <span className="font-semibold text-foreground">{format(effectiveEnd, "MMM d")}</span>
          {" "}
          <span className="text-primary font-semibold">
            ({Math.abs(
              Math.round(
                (effectiveEnd.getTime() - effectiveStart.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            ) + 1} days)
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarGrid;

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
  onDayMouseDown?: (date: Date) => void;
  onDayMouseEnter?: (date: Date) => void;
  onDayTouchStart?: (date: Date) => void;
  onDayTouchMove?: (date: Date) => void;
  notesMap: Record<string, CalendarNote[]>;
  direction: number;
  isDragging?: boolean;
}

const CalendarGrid = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  rangeStart,
  rangeEnd,
  onDayClick,
  onDayMouseDown,
  onDayMouseEnter,
  onDayTouchStart,
  onDayTouchMove,
  notesMap,
  direction,
  isDragging = false,
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
  const daysBetween = effectiveStart && effectiveEnd
    ? Math.abs(Math.round((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24))) + 1
    : 0;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className="bg-card rounded-2xl shadow-lg p-4 md:p-8 border border-border/50 transition-shadow duration-300"
    >
      <MonthNavigator
        currentMonth={currentMonth}
        onPrev={onPrevMonth}
        onNext={onNextMonth}
      />

      <div className="grid grid-cols-7 gap-2 mb-6">
        {WEEKDAYS.map((wd) => (
          <motion.div
            key={wd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest py-2"
          >
            {wd}
          </motion.div>
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
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-2"
        >
          {days.map((day, idx) => {
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
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (idx % 7) * 0.02 }}
                onMouseDown={() => onDayMouseDown?.(day)}
                onMouseEnter={() => onDayMouseEnter?.(day)}
                onTouchStart={() => onDayTouchStart?.(day)}
                onTouchMove={() => onDayTouchMove?.(day)}
              >
                <DayCell
                  day={day.getDate()}
                  isToday={isSameDay(day, today)}
                  isOverflow={isOverflow}
                  isRangeStart={isStart}
                  isRangeEnd={isEnd}
                  isInRange={isInRange}
                  onClick={() => !isDragging && onDayClick(day)}
                  notes={dayNotes}
                  isDragging={isDragging}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {effectiveStart && effectiveEnd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 pt-6 border-t border-border/50"
          >
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Selected:</span>
              <span className="font-semibold text-foreground">{format(effectiveStart, "MMM d")}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-semibold text-foreground">{format(effectiveEnd, "MMM d")}</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                {daysBetween} days
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarGrid;

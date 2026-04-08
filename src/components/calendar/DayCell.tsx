import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "@/lib/constants";
import type { CalendarNote } from "@/types/calendar";

interface DayCellProps {
  day: number;
  isToday: boolean;
  isOverflow: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  onClick: () => void;
  notes: CalendarNote[];
}

const StickyNote = ({ note, index }: { note: CalendarNote; index: number }) => {
  const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
  const rotation = index % 2 === 0 ? "-rotate-1" : "rotate-1";

  return (
    <div
      className={cn(
        "px-1 py-0.5 rounded text-[9px] leading-tight truncate shadow-sm font-body font-medium",
        rotation,
        colors.bg,
        colors.text,
        colors.darkBg
      )}
      title={note.text}
    >
      {note.text}
    </div>
  );
};

const DayCell = ({
  day,
  isToday,
  isOverflow,
  isRangeStart,
  isRangeEnd,
  isInRange,
  onClick,
  notes,
}: DayCellProps) => {
  const [hovered, setHovered] = useState(false);
  const visibleNotes = notes.slice(0, 2);
  const overflowCount = notes.length - 2;

  return (
    <motion.button
      whileHover={!isOverflow ? { scale: 1.04 } : undefined}
      whileTap={!isOverflow ? { scale: 0.97 } : undefined}
      onClick={!isOverflow ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex flex-col items-stretch p-1 min-h-[4.5rem] sm:min-h-[5.5rem] rounded-lg text-sm font-body font-medium transition-colors duration-200 cursor-pointer select-none border border-transparent",
        isOverflow && "text-calendar-overflow cursor-default opacity-40",
        !isOverflow && !isRangeStart && !isRangeEnd && !isInRange && "hover:bg-accent hover:border-border",
        isToday && !isRangeStart && !isRangeEnd && "ring-2 ring-calendar-today ring-inset font-semibold",
        isRangeStart && "bg-calendar-range-start text-primary-foreground font-semibold shadow-soft rounded-l-lg rounded-r-none",
        isRangeEnd && "bg-calendar-range-end text-primary-foreground font-semibold shadow-soft rounded-r-lg rounded-l-none",
        isInRange && !isRangeStart && !isRangeEnd && "bg-calendar-range text-accent-foreground rounded-none"
      )}
    >
      <span className={cn(
        "self-end w-6 h-6 flex items-center justify-center rounded-full text-xs",
        isToday && !isRangeStart && !isRangeEnd && "bg-calendar-today text-primary-foreground font-bold"
      )}>
        {day}
      </span>

      {!isOverflow && visibleNotes.length > 0 && (
        <div className="flex flex-col gap-0.5 mt-0.5 overflow-hidden">
          {visibleNotes.map((note) => (
            <StickyNote key={note.id} note={note} index={visibleNotes.indexOf(note)} />
          ))}
          {overflowCount > 0 && (
            <span className="text-[8px] text-muted-foreground font-body text-center">
              +{overflowCount} more
            </span>
          )}
        </div>
      )}

      <AnimatePresence>
        {hovered && notes.length > 0 && !isOverflow && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 bg-popover border border-border rounded-lg shadow-elevated p-2 min-w-[140px] max-w-[200px] pointer-events-none"
          >
            <div className="flex flex-col gap-1">
              {notes.map((note) => {
                const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
                return (
                  <div
                    key={note.id}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-body",
                      colors.bg,
                      colors.text,
                      colors.darkBg
                    )}
                  >
                    {note.text}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default DayCell;

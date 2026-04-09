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
  isDragging?: boolean;
}

const StickyNote = ({ note, index }: { note: CalendarNote; index: number }) => {
  const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
  const rotation = index % 2 === 0 ? "-rotate-1" : "rotate-1";

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "px-1.5 py-0.5 rounded text-[8px] leading-tight font-body font-medium shadow-sm",
        "max-w-full truncate whitespace-nowrap overflow-hidden",
        rotation,
        colors.bg,
        colors.text,
        colors.darkBg
      )}
      title={note.text}
    >
      {note.text}
    </motion.div>
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
  isDragging = false,
}: DayCellProps) => {
  const [hovered, setHovered] = useState(false);
  const visibleNotes = notes.slice(0, 2);
  const overflowCount = notes.length - 2;

  return (
    <motion.button
      whileHover={!isOverflow ? { 
        scale: 1.02,
        y: -2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
      } : undefined}
      whileTap={!isOverflow ? { scale: 0.98, y: 0 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={!isOverflow ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-24 sm:h-28 p-2 rounded-lg text-sm font-body font-medium transition-colors duration-200 cursor-pointer select-none border border-transparent overflow-hidden flex flex-col shadow-soft",
        isOverflow && "text-calendar-overflow cursor-default opacity-40",
        !isOverflow && !isRangeStart && !isRangeEnd && !isInRange && "hover:bg-accent hover:border-border",
        isToday && !isRangeStart && !isRangeEnd && "ring-2 ring-calendar-today ring-inset font-semibold",
        isRangeStart && "bg-calendar-range-start text-primary-foreground font-semibold shadow-soft rounded-l-lg rounded-r-none",
        isRangeEnd && "bg-calendar-range-end text-primary-foreground font-semibold shadow-soft rounded-r-lg rounded-l-none",
        isInRange && !isRangeStart && !isRangeEnd && "bg-calendar-range text-accent-foreground rounded-none",
        isDragging && "opacity-70 shadow-elevated"
      )}
    >
      <div className="flex justify-end mb-auto">
        <span className={cn(
          "w-6 h-6 flex items-center justify-center rounded-full text-xs flex-shrink-0",
          isToday && !isRangeStart && !isRangeEnd && "bg-calendar-today text-primary-foreground font-bold"
        )}>
          {day}
        </span>
      </div>

      {!isOverflow && visibleNotes.length > 0 && (
        <div className="flex flex-col gap-0.5 overflow-hidden">
          {visibleNotes.map((note) => (
            <StickyNote key={note.id} note={note} index={visibleNotes.indexOf(note)} />
          ))}
          {overflowCount > 0 && (
            <span className="text-[7px] text-muted-foreground font-body text-center px-0.5 flex-shrink-0">
              +{overflowCount}
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
                      "px-2 py-1 rounded text-xs font-body truncate",
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

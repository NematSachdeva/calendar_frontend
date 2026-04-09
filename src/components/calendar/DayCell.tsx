import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "@/lib/constants";
import type { CalendarNote } from "@/types/calendar";

interface DayCellProps {
  day: number;
  dateKey: string;
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
  const isRange = note.startDate !== note.endDate;

  return (
    <motion.div
      whileHover={{ y: -1, scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "px-2 py-0.5 rounded-sm text-[9px] leading-tight font-body font-semibold shadow-sm border-l-2",
        "max-w-full truncate whitespace-nowrap overflow-hidden transition-all duration-200 flex items-center gap-1",
        rotation,
        colors.bg,
        colors.text,
        "border-black/5"
      )}
      title={note.text + (isRange ? ` (${note.startDate} → ${note.endDate})` : "")}
    >
      {isRange && <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />}
      {note.text}
    </motion.div>
  );
};

const DayCell = ({
  day,
  dateKey,
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
  
  // Show sticky notes for starts
  const startNotes = notes.filter(n => n.startDate === dateKey);
  // Show dots for ends (only if not also a start on this same day, which shouldn't happen usually but good to check)
  const endNotes = notes.filter(n => n.endDate === dateKey && n.startDate !== dateKey);

  const visibleNotes = startNotes.slice(0, 3);
  const overflowCount = startNotes.length - 3;

  return (
    <motion.button
      whileHover={!isOverflow ? { 
        y: -1,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
      } : undefined}
      whileTap={!isOverflow ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={!isOverflow ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative w-full h-28 p-2 rounded-xl text-sm font-body font-medium transition-all duration-200 cursor-pointer select-none border border-transparent overflow-hidden flex flex-col items-stretch",
        isOverflow && "text-calendar-overflow cursor-default opacity-30",
        !isOverflow && !isRangeStart && !isRangeEnd && !isInRange && "hover:bg-accent/40 hover:border-border/50 bg-card/10",
        isToday && !isRangeStart && !isRangeEnd && "ring-2 ring-calendar-today/30 ring-inset font-semibold bg-calendar-today/5",
        isRangeStart && "bg-calendar-range-start/90 text-primary-foreground font-semibold shadow-md z-10",
        isRangeEnd && "bg-calendar-range-end/90 text-primary-foreground font-semibold shadow-md z-10",
        isInRange && !isRangeStart && !isRangeEnd && "bg-calendar-range/50 text-accent-foreground backdrop-blur-[1px]",
        isDragging && "opacity-70 shadow-lg scale-[0.99]"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-1">
          {endNotes.map(n => {
            const colors = NOTE_COLORS[n.color] || NOTE_COLORS.yellow;
            return (
              <div 
                key={n.id} 
                className={cn("w-2 h-2 rounded-full shadow-sm", colors.bg, "border border-black/10")} 
                title={`End of: ${n.text}`}
              />
            );
          })}
        </div>
        <span className={cn(
          "w-6 h-6 flex items-center justify-center rounded-full text-[11px] transition-colors duration-200",
          isToday && !isRangeStart && !isRangeEnd && "bg-calendar-today text-white font-bold shadow-sm"
        )}>
          {day}
        </span>
      </div>

      {/* Sticky notes list */}
      {!isOverflow && visibleNotes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {visibleNotes.map((note) => (
            <StickyNote key={note.id} note={note} index={visibleNotes.indexOf(note)} />
          ))}
          {overflowCount > 0 && (
            <span className="text-[8px] text-muted-foreground font-bold text-center py-0.5">
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
            className="absolute z-[60] bottom-full left-1/2 -translate-x-1/2 mb-2 bg-popover/95 backdrop-blur-md border border-border rounded-xl shadow-elevated p-3 min-w-[180px] max-w-[240px] pointer-events-none"
          >
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-1">Day Summary</p>
              
              {startNotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-primary/70 uppercase">Starting today</p>
                  {startNotes.map((note) => {
                    const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
                    return (
                      <div
                        key={note.id}
                        className={cn(
                          "px-2 py-1.5 rounded-md text-[11px] font-body whitespace-pre-wrap leading-tight shadow-sm border-l-2",
                          colors.bg,
                          colors.text,
                          "border-black/5"
                        )}
                      >
                        {note.text}
                        {note.startDate !== note.endDate && (
                          <div className="mt-1 text-[9px] opacity-70 italic">
                            Ends: {note.endDate}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {endNotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-secondary/70 uppercase">Ending today</p>
                  {endNotes.map((note) => {
                    const colors = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;
                    return (
                      <div
                        key={note.id}
                        className={cn(
                          "px-2 py-1.5 rounded-md text-[11px] font-body whitespace-pre-wrap leading-tight shadow-sm border-l-2 opacity-80",
                          colors.bg,
                          colors.text,
                          "border-black/5"
                        )}
                      >
                        {note.text}
                        <div className="mt-1 text-[9px] opacity-70 italic">
                          Started: {note.startDate}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default DayCell;

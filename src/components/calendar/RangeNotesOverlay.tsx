import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "@/lib/constants";
import type { CalendarNote } from "@/types/calendar";

interface RangeNotesOverlayProps {
  currentMonth: Date;
  rangeNotes: CalendarNote[];
  cellHeight: number;
  cellGap: number;
}

const RangeNotesOverlay = ({
  currentMonth,
  rangeNotes,
  cellHeight,
  cellGap,
}: RangeNotesOverlayProps) => {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const dayIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    days.forEach((day, idx) => {
      map.set(format(day, "yyyy-MM-dd"), idx);
    });
    return map;
  }, [days]);

  const { segments, rowOverflows } = useMemo(() => {
    const segments: Array<{
      noteId: string;
      startIdx: number;
      endIdx: number;
      rowIdx: number;
      color: string;
      text: string;
      rowIndexOffset: number;
    }> = [];

    const rowNoteCount: Record<number, number> = {};
    const rowOverflows: Record<number, number> = {};

    rangeNotes.forEach((note) => {
      const startIdx = dayIndexMap.get(note.startDate);
      const endIdx = dayIndexMap.get(note.endDate);

      if (startIdx === undefined && endIdx === undefined) return;

      const actualStartIdx = startIdx ?? 0;
      const actualEndIdx = endIdx ?? days.length - 1;

      const startRow = Math.floor(actualStartIdx / 7);
      const endRow = Math.floor(actualEndIdx / 7);

      for (let row = startRow; row <= endRow; row++) {
        const rowStart = row === startRow ? actualStartIdx : row * 7;
        const rowEnd = row === endRow ? actualEndIdx : (row + 1) * 7 - 1;

        if (!rowNoteCount[row]) rowNoteCount[row] = 0;
        
        if (rowNoteCount[row] < 2) {
          segments.push({
            noteId: `${note.id}-${row}`,
            startIdx: rowStart,
            endIdx: rowEnd,
            rowIdx: row,
            color: note.color,
            text: note.text,
            rowIndexOffset: rowNoteCount[row],
          });
        } else {
          rowOverflows[row] = (rowOverflows[row] || 0) + 1;
        }
        
        rowNoteCount[row]++;
      }
    });

    return { segments, rowOverflows };
  }, [rangeNotes, dayIndexMap, days]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {segments.map((segment) => {
          const colors = NOTE_COLORS[segment.color as any] || NOTE_COLORS.yellow;
          const startCol = segment.startIdx % 7;
          const endCol = segment.endIdx % 7;
          const colSpan = endCol - startCol + 1;

          const left = `calc(${(startCol / 7) * 100}% + ${startCol * cellGap + 4}px)`;
          const width = `calc(${(colSpan / 7) * 100}% - ${8}px + ${(colSpan - 1) * cellGap}px)`;
          
          // Thinner bars: h-2.5 (10px)
          // Spacing: 36px from top, 4px between bars
          const top = segment.rowIdx * (cellHeight + cellGap) + 38 + (segment.rowIndexOffset * 14);

          return (
            <motion.div
              key={segment.noteId}
              initial={{ opacity: 0, scaleX: 0, y: 2 }}
              animate={{ opacity: 0.9, scaleX: 1, y: 0 }}
              exit={{ opacity: 0, scaleX: 0 }}
              whileHover={{ 
                opacity: 1, 
                scaleY: 1.1, 
                filter: "brightness(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
              transition={{ duration: 0.3, ease: "circOut" }}
              className={cn(
                "absolute h-[10px] flex items-center rounded-full px-2 text-[0px] shadow-sm border border-black/5 origin-left cursor-help pointer-events-auto transition-all duration-200",
                colors.bg,
                colors.text
              )}
              style={{
                left,
                width,
                top: `${top}px`,
              }}
              title={segment.text}
            />
          );
        })}
      </AnimatePresence>

      {Object.entries(rowOverflows).map(([rowStr, count]) => {
        const row = parseInt(rowStr);
        const top = row * (cellHeight + cellGap) + 38 + (2 * 14);
        
        return (
          <div
            key={`overflow-${row}`}
            className="absolute right-4 text-[9px] font-bold text-muted-foreground bg-accent/50 px-1.5 py-0.5 rounded-full"
            style={{ top: `${top}px` }}
          >
            +{count} more
          </div>
        );
      })}
    </div>
  );
};

export default RangeNotesOverlay;


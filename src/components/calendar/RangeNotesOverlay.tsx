import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
  format,
  differenceInDays,
} from "date-fns";
import { motion } from "framer-motion";
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

  const rangeSegments = useMemo(() => {
    const segments: Array<{
      noteId: string;
      startIdx: number;
      endIdx: number;
      rowIdx: number;
      color: string;
      text: string;
      rowIndexOffset: number;
    }> = [];

    // Simple vertical stacking within a row
    const rowNoteCount: Record<number, number> = {};

    rangeNotes.forEach((note) => {
      const startIdx = dayIndexMap.get(note.startDate);
      const endIdx = dayIndexMap.get(note.endDate);

      // Skip notes where start/end are not in current view
      if (startIdx === undefined && endIdx === undefined) return;

      const actualStartIdx = startIdx ?? 0;
      const actualEndIdx = endIdx ?? days.length - 1;

      const startRow = Math.floor(actualStartIdx / 7);
      const endRow = Math.floor(actualEndIdx / 7);

      for (let row = startRow; row <= endRow; row++) {
        const rowStart = row === startRow ? actualStartIdx : row * 7;
        const rowEnd = row === endRow ? actualEndIdx : (row + 1) * 7 - 1;

        if (!rowNoteCount[row]) rowNoteCount[row] = 0;
        const rowIndexOffset = rowNoteCount[row];
        
        segments.push({
          noteId: `${note.id}-${row}`,
          startIdx: rowStart,
          endIdx: rowEnd,
          rowIdx: row,
          color: note.color,
          text: note.text,
          rowIndexOffset,
        });
        
        rowNoteCount[row]++;
      }
    });

    return segments;
  }, [rangeNotes, dayIndexMap, days]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {rangeSegments.map((segment) => {
        const colors = NOTE_COLORS[segment.color as any] || NOTE_COLORS.yellow;
        const startCol = segment.startIdx % 7;
        const endCol = segment.endIdx % 7;
        const colSpan = endCol - startCol + 1;

        const left = `calc(${(startCol / 7) * 100}% + ${startCol * cellGap}px)`;
        const width = `calc(${(colSpan / 7) * 100}% + ${(colSpan - 1) * cellGap}px)`;
        // Fixed positioning within the cell: after the date number (which is at the top)
        // Date number is roughly 24px high. Let's put notes starting below it.
        const top = segment.rowIdx * (cellHeight + cellGap) + 32 + (segment.rowIndexOffset * 22);

        return (
          <motion.div
            key={segment.noteId}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "absolute h-5 flex items-center rounded px-2 text-[10px] font-body font-bold truncate shadow-sm border border-black/5 origin-left",
              colors.bg,
              colors.text
            )}
            style={{
              left,
              width,
              top: `${top}px`,
            }}
            title={segment.text}
          >
            {segment.text}
          </motion.div>
        );
      })}
    </div>
  );
};

export default RangeNotesOverlay;

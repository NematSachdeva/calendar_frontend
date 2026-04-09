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
    }> = [];

    rangeNotes.forEach((note) => {
      const startIdx = dayIndexMap.get(note.dateKey);
      if (startIdx === undefined) return;

      const endDateStr = note.dateKey;
      const endIdx = dayIndexMap.get(endDateStr);
      if (endIdx === undefined) return;

      const startRow = Math.floor(startIdx / 7);
      const endRow = Math.floor(endIdx / 7);

      if (startRow === endRow) {
        segments.push({
          noteId: note.id,
          startIdx,
          endIdx,
          rowIdx: startRow,
          color: note.color,
          text: note.text,
        });
      } else {
        for (let row = startRow; row <= endRow; row++) {
          const rowStart = row === startRow ? startIdx : row * 7;
          const rowEnd = row === endRow ? endIdx : (row + 1) * 7 - 1;
          segments.push({
            noteId: `${note.id}-${row}`,
            startIdx: rowStart,
            endIdx: rowEnd,
            rowIdx: row,
            color: note.color,
            text: note.text,
          });
        }
      }
    });

    return segments;
  }, [rangeNotes, dayIndexMap]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {rangeSegments.map((segment) => {
        const colors = NOTE_COLORS[segment.color as any] || NOTE_COLORS.yellow;
        const startCol = segment.startIdx % 7;
        const endCol = segment.endIdx % 7;
        const colSpan = endCol - startCol + 1;

        const left = `calc(${(startCol / 7) * 100}% + ${startCol * cellGap}px)`;
        const width = `calc(${(colSpan / 7) * 100}% + ${(colSpan - 1) * cellGap}px)`;
        const top = `calc(${segment.rowIdx * (cellHeight + cellGap)}px + ${cellHeight * 0.5}px)`;

        return (
          <motion.div
            key={segment.noteId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute h-6 rounded-md px-2 py-1 text-xs font-body font-medium truncate shadow-sm",
              colors.bg,
              colors.text,
              colors.darkBg
            )}
            style={{
              left,
              width,
              top,
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

import { useState, useCallback, useEffect, useRef } from "react";
import { addMonths, subMonths, isBefore, format } from "date-fns";
import { motion } from "framer-motion";
import HeroImage from "./HeroImage";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "@/components/notes/NotesPanel";
import DarkModeToggle from "@/components/shared/DarkModeToggle";
import { useCalendarNotes } from "@/hooks/useCalendarNotes";

const CalendarContainer = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const { notes, addNote, deleteNote, getNotesMap } = useCalendarNotes();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentMonth((m) => subMonths(m, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentMonth((m) => addMonths(m, 1));
  }, []);

  const handleDayClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
      } else {
        if (isBefore(date, rangeStart)) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
        } else {
          setRangeEnd(date);
        }
      }
    },
    [rangeStart, rangeEnd]
  );

  const handleDayMouseDown = useCallback((date: Date) => {
    setIsDragging(true);
    setDragStart(date);
    setRangeStart(date);
    setRangeEnd(null);
    setSelectedDate(date);
  }, []);

  const handleDayMouseEnter = useCallback(
    (date: Date) => {
      if (isDragging && dragStart) {
        if (isBefore(date, dragStart)) {
          setRangeStart(date);
          setRangeEnd(dragStart);
        } else {
          setRangeStart(dragStart);
          setRangeEnd(date);
        }
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleTouchStart = useCallback((date: Date) => {
    setIsDragging(true);
    setDragStart(date);
    setRangeStart(date);
    setRangeEnd(null);
    setSelectedDate(date);
  }, []);

  const handleTouchMove = useCallback(
    (date: Date) => {
      if (isDragging && dragStart) {
        if (isBefore(date, dragStart)) {
          setRangeStart(date);
          setRangeEnd(dragStart);
        } else {
          setRangeStart(dragStart);
          setRangeEnd(date);
        }
      }
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseUp, handleTouchEnd]);

  const monthKey = format(currentMonth, "yyyy-MM");
  const notesMap = getNotesMap(monthKey);
  const monthNotes = notes.filter((n) => n.startDate.startsWith(monthKey) || n.endDate.startsWith(monthKey));

  return (
    <div
      ref={dragRef}
      className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 select-none relative overflow-x-hidden"
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="relative z-20">
        <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        <HeroImage currentMonth={currentMonth} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-12 relative z-30 pb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <NotesPanel
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              notes={monthNotes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 order-1 lg:order-2"
            onMouseUp={handleMouseUp}
          >
            <CalendarGrid
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onDayClick={handleDayClick}
              onDayMouseDown={handleDayMouseDown}
              onDayMouseEnter={handleDayMouseEnter}
              onDayTouchStart={handleTouchStart}
              onDayTouchMove={handleTouchMove}
              notesMap={notesMap}
              allNotes={notes}
              direction={direction}
              isDragging={isDragging}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarContainer;

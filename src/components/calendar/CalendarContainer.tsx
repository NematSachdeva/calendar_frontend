import { useState, useCallback, useEffect } from "react";
import { addMonths, subMonths, isBefore, format } from "date-fns";
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

  const monthKey = format(currentMonth, "yyyy-MM");
  const notesMap = getNotesMap(monthKey);
  const monthNotes = notes.filter((n) => n.dateKey.startsWith(monthKey));

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        <HeroImage currentMonth={currentMonth} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-4 relative z-10 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 xl:w-80 order-2 lg:order-1">
            <NotesPanel
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              notes={monthNotes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
            />
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <CalendarGrid
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onDayClick={handleDayClick}
              notesMap={notesMap}
              direction={direction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarContainer;

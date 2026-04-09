import { useState, useEffect, useCallback } from "react";
import type { CalendarNote, NoteColor } from "@/types/calendar";

const STORAGE_KEY = "calendar-notes-v1";

function loadNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: CalendarNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useCalendarNotes() {
  const [notes, setNotes] = useState<CalendarNote[]>(loadNotes);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const addNote = useCallback(
    (text: string, startDate: string, endDate: string, color: NoteColor = "yellow") => {
      const note: CalendarNote = {
        id: crypto.randomUUID(),
        text,
        startDate,
        endDate,
        color,
        createdAt: Date.now(),
      };
      setNotes((prev) => [note, ...prev]);
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const getNotesForDate = useCallback(
    (dateKey: string): CalendarNote[] => {
      return notes.filter((note) => note.startDate === dateKey && note.endDate === dateKey);
    },
    [notes]
  );

  const getNotesMap = useCallback(
    (monthPrefix: string): Record<string, CalendarNote[]> => {
      const map: Record<string, CalendarNote[]> = {};
      notes.forEach((note) => {
        // Include note on its start date
        if (!map[note.startDate]) {
          map[note.startDate] = [];
        }
        map[note.startDate].push(note);

        // Also include on end date if it's a range note
        if (note.startDate !== note.endDate) {
          if (!map[note.endDate]) {
            map[note.endDate] = [];
          }
          // Check if it's already there (e.g. if start and end are in the same month)
          if (!map[note.endDate].includes(note)) {
            map[note.endDate].push(note);
          }
        }
      });
      return map;
    },
    [notes]
  );

  return { notes, addNote, deleteNote, getNotesForDate, getNotesMap };
}

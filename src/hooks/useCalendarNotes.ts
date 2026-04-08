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
    (text: string, dateKey: string, color: NoteColor = "yellow") => {
      const note: CalendarNote = {
        id: crypto.randomUUID(),
        text,
        dateKey,
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
      return notes.filter((note) => note.dateKey === dateKey);
    },
    [notes]
  );

  const getNotesMap = useCallback(
    (monthPrefix: string): Record<string, CalendarNote[]> => {
      const map: Record<string, CalendarNote[]> = {};
      notes.forEach((note) => {
        if (note.dateKey.startsWith(monthPrefix)) {
          if (!map[note.dateKey]) {
            map[note.dateKey] = [];
          }
          map[note.dateKey].push(note);
        }
      });
      return map;
    },
    [notes]
  );

  return { notes, addNote, deleteNote, getNotesForDate, getNotesMap };
}

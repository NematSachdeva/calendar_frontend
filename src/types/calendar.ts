export type NoteColor = "yellow" | "blue" | "green" | "pink";

export interface CalendarNote {
  id: string;
  text: string;
  startDate: string;
  endDate: string;
  color: NoteColor;
  createdAt: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

import type { NoteColor } from "@/types/calendar";

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const NOTE_COLORS: Record<
  NoteColor,
  { bg: string; text: string; darkBg: string }
> = {
  yellow: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    darkBg: "dark:bg-amber-900/40 dark:text-amber-200",
  },
  blue: {
    bg: "bg-sky-100",
    text: "text-sky-900",
    darkBg: "dark:bg-sky-900/40 dark:text-sky-200",
  },
  green: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    darkBg: "dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-900",
    darkBg: "dark:bg-pink-900/40 dark:text-pink-200",
  },
};

export const NOTE_DISPLAY_COLORS: Record<
  NoteColor,
  { bg: string; text: string }
> = {
  yellow: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-900 dark:text-amber-100",
  },
  blue: {
    bg: "bg-sky-50 dark:bg-sky-900/30",
    text: "text-sky-900 dark:text-sky-100",
  },
  green: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-900 dark:text-emerald-100",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/30",
    text: "text-pink-900 dark:text-pink-100",
  },
};

export const COLOR_PICKER_OPTIONS: Array<{
  value: NoteColor;
  label: string;
  bg: string;
  ring: string;
}> = [
  {
    value: "yellow",
    label: "Yellow",
    bg: "bg-amber-200 dark:bg-amber-700",
    ring: "ring-amber-400",
  },
  {
    value: "blue",
    label: "Blue",
    bg: "bg-sky-200 dark:bg-sky-700",
    ring: "ring-sky-400",
  },
  {
    value: "green",
    label: "Green",
    bg: "bg-emerald-200 dark:bg-emerald-700",
    ring: "ring-emerald-400",
  },
  {
    value: "pink",
    label: "Pink",
    bg: "bg-pink-200 dark:bg-pink-700",
    ring: "ring-pink-400",
  },
];

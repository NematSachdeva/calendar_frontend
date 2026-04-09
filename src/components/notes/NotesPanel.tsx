import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { COLOR_PICKER_OPTIONS, NOTE_DISPLAY_COLORS } from "@/lib/constants";
import type { CalendarNote, NoteColor } from "@/types/calendar";

interface NotesPanelProps {
  currentMonth: Date;
  selectedDate: Date | null;
  notes: CalendarNote[];
  onAddNote: (text: string, dateKey: string, color: NoteColor) => void;
  onDeleteNote: (id: string) => void;
}

const NotesPanel = ({
  currentMonth,
  selectedDate,
  notes,
  onAddNote,
  onDeleteNote,
}: NotesPanelProps) => {
  const [draft, setDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState<NoteColor>("yellow");

  const dateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const displayNotes = dateKey
    ? notes.filter((n) => n.dateKey === dateKey)
    : notes;

  const handleAdd = () => {
    if (!draft.trim() || !dateKey) return;
    onAddNote(draft.trim(), dateKey, selectedColor);
    setDraft("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-xl shadow-card p-4 md:p-6 flex flex-col h-full border border-border/30"
    >
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-display font-semibold text-foreground">Notes</h3>
      </div>

      {selectedDate ? (
        <p className="text-xs font-body text-muted-foreground mb-3">
          {format(selectedDate, "EEEE, MMM d, yyyy")}
        </p>
      ) : (
        <p className="text-xs font-body text-muted-foreground mb-3">
          Select a date to add notes
        </p>
      )}

      {selectedDate && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs text-muted-foreground font-body mr-1">Color:</span>
            {COLOR_PICKER_OPTIONS.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedColor(c.value)}
                className={cn(
                  "w-5 h-5 rounded-full transition-all duration-150",
                  c.bg,
                  selectedColor === c.value && `ring-2 ${c.ring} ring-offset-2 ring-offset-card scale-110`
                )}
                title={c.label}
              />
            ))}
          </div>

          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a note for this date…"
            className="resize-none text-sm font-body min-h-[72px] bg-background border-border"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
            }}
          />
          <Button
            onClick={handleAdd}
            disabled={!draft.trim()}
            size="sm"
            className="self-end gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add note
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {displayNotes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6 font-body">
              {selectedDate
                ? "No notes for this date yet."
                : `No notes for ${format(currentMonth, "MMMM")} yet.`}
            </p>
          )}
          {displayNotes.map((note) => {
            const colors = NOTE_DISPLAY_COLORS[note.color] || NOTE_DISPLAY_COLORS.yellow;
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group rounded-lg p-3 shadow-soft border border-border",
                  colors.bg
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className={cn("text-sm font-body whitespace-pre-wrap", colors.text)}>
                      {note.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1.5 font-body">
                      {format(new Date(note.dateKey), "MMM d")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteNote(note.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NotesPanel;

import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, StickyNote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { COLOR_PICKER_OPTIONS, NOTE_DISPLAY_COLORS } from "@/lib/constants";
import type { CalendarNote, NoteColor } from "@/types/calendar";

interface NotesPanelProps {
  currentMonth: Date;
  selectedDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  notes: CalendarNote[];
  onAddNote: (text: string, startDate: string, endDate: string, color: NoteColor) => void;
  onUpdateNote: (id: string, text: string, color: NoteColor, startDate?: string, endDate?: string) => void;
  onDeleteNote: (id: string) => void;
  editingNoteId?: string | null;
  onStartEdit?: (id: string) => void;
  onCancelEdit?: () => void;
}

const NotesPanel = ({
  currentMonth,
  selectedDate,
  rangeStart,
  rangeEnd,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  editingNoteId,
  onStartEdit,
  onCancelEdit,
}: NotesPanelProps) => {
  const [draft, setDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState<NoteColor>("yellow");

  // Sync draft and color when editingNoteId changes
  const editingNote = notes.find(n => n.id === editingNoteId);
  const isEditing = !!editingNote;

  useEffect(() => {
    if (editingNote) {
      setDraft(editingNote.text);
      setSelectedColor(editingNote.color);
    } else {
      setDraft("");
      setSelectedColor("yellow");
    }
  }, [editingNoteId, editingNote]);

  const startStr = rangeStart ? format(rangeStart, "yyyy-MM-dd") : null;
  const endStr = rangeEnd ? format(rangeEnd, "yyyy-MM-dd") : startStr;

  const displayNotes = startStr && endStr
    ? notes.filter((n) => n.startDate === startStr && n.endDate === endStr)
    : notes;

  const handleAdd = () => {
    if (!draft.trim() || !startStr || !endStr) return;
    onAddNote(draft.trim(), startStr, endStr, selectedColor);
    setDraft("");
  };

  const handleSave = () => {
    if (!draft.trim() || !editingNoteId) return;
    onUpdateNote(editingNoteId, draft.trim(), selectedColor, startStr ?? undefined, endStr ?? undefined);
    onCancelEdit?.();
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
        <h3 className="text-lg font-display font-semibold text-foreground">
          {isEditing ? "Edit Note" : "Notes"}
        </h3>
      </div>

      <div className="mb-3">
        {isEditing ? (
          <p className="text-xs font-body text-primary font-medium">
            Editing note from {format(new Date(editingNote.startDate), "MMM d")}
            {editingNote.startDate !== editingNote.endDate && ` → ${format(new Date(editingNote.endDate), "MMM d")}`}
          </p>
        ) : rangeStart && rangeEnd && !isSameDay(rangeStart, rangeEnd) ? (
          <p className="text-xs font-body text-muted-foreground flex items-center gap-1.5">
            {format(rangeStart, "MMM d")} <span className="text-[10px] opacity-70">→</span> {format(rangeEnd, "MMM d, yyyy")}
          </p>
        ) : selectedDate ? (
          <p className="text-xs font-body text-muted-foreground">
            {format(selectedDate, "EEEE, MMM d, yyyy")}
          </p>
        ) : (
          <p className="text-xs font-body text-muted-foreground">
            Select a date or range to add notes
          </p>
        )}
      </div>

      {(selectedDate || (rangeStart && rangeEnd) || isEditing) && (
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
            placeholder="Add a note…"
            className="resize-none text-sm font-body min-h-[72px] bg-background border-border"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                isEditing ? handleSave() : handleAdd();
              }
            }}
          />
          <div className="flex justify-between items-center gap-2">
            <div>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (editingNoteId) {
                      onDeleteNote(editingNoteId);
                      onCancelEdit?.();
                    }
                  }}
                  className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelEdit}
                  className="text-xs"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={isEditing ? handleSave : handleAdd}
                disabled={!draft.trim()}
                size="sm"
                className="gap-1.5"
              >
                {isEditing ? (
                  <>Save changes</>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add note
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence>
          {displayNotes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6 font-body">
              {startStr
                ? "No notes for this selection yet."
                : `No notes for ${format(currentMonth, "MMMM")} yet.`}
            </p>
          )}
          {displayNotes.map((note) => {
            const colors = NOTE_DISPLAY_COLORS[note.color] || NOTE_DISPLAY_COLORS.yellow;
            const isRange = note.startDate !== note.endDate;
            
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ y: -2, boxShadow: "0 8px 16px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.2 }}
                onClick={() => onStartEdit?.(note.id)}
                className={cn(
                  "group rounded-lg p-3 shadow-soft border transition-all duration-200 cursor-pointer",
                  colors.bg,
                  editingNoteId === note.id ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : "border-border"
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-body whitespace-pre-wrap", colors.text)}>
                        {note.text}
                      </p>
                      {editingNoteId === note.id && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-[10px] text-primary font-bold uppercase tracking-wider">
                          Editing
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 font-body flex items-center gap-1">
                      {isRange 
                        ? (
                          <>
                            {format(new Date(note.startDate), "MMM d")} 
                            <span className="text-[9px] opacity-60">→</span>
                            {format(new Date(note.endDate), "MMM d")}
                          </>
                        )
                        : format(new Date(note.startDate), "MMM d")
                      }
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
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

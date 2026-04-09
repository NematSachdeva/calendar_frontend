# Interactive Calendar Planner

A modern, fluid, and intuitive calendar application designed for seamless event planning and note-taking. Inspired by the aesthetics of classic wall calendars, this project focuses on a clean user experience with powerful range-selection capabilities.

## 🚀 Demo

**Live Demo:** https://calendar-frontend-two-woad.vercel.app *(Placeholder)*

---

## ✨ Features

- **Interactive Calendar UI**: A premium, responsive grid inspired by traditional wall calendars.
- **Drag-to-Select Range**: Intuitive mouse and touch support for selecting date ranges with fluid visual feedback.
- **Dynamic Sticky Notes**: Support for both single-day tasks and multi-day range notes using a classic sticky-note aesthetic.
- **Full CRUD Support**: Create, read, update, and delete notes with a seamless inline editing interface.
- **Smart Range Markers**: Simplified visualization that marks the beginning and end of ranges, keeping the UI decluttered.
- **Local Persistence**: All notes are automatically saved to `localStorage`, ensuring data persists across sessions.
- **Premium Aesthetics**: Elegant typography, soft shadows, and smooth Framer Motion animations.
- **Light & Dark Mode**: Fully themed support for any environment.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/) (Vite + TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utility Library**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💡 How It Works

### Date Range Selection
The core interaction revolves around clicks and drags. Users can click a single day to select it or click and drag across the grid to define a range. The selection is highlighted in real-time with a soft backdrop.

### Notes System
Notes can be added for any selected date or range. 
- **Single-Day Notes**: Appear as small sticky notes at the bottom of the date cell.
- **Range Notes**: Are pinned to the starting cell of the range and include a small "range" indicator. The end of the range is marked with a subtle dot to maintain grid clarity.

### Editing & Management
Clicking any sticky note directly opens the **Edit Mode** in the sidebar. Users can update note content, change category colors, or even adjust the date range by re-selecting on the calendar while editing.

### Persistence
The custom `useCalendarNotes` hook handles state management and synchronizes data with `localStorage`. No backend is required, making the app fully functional as a standalone tool.

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── calendar/      # Core calendar grid, cells, and navigation
│   ├── notes/         # Notes panel and editing form
│   └── shared/        # Reusable UI components (buttons, inputs)
├── hooks/             # Custom hooks for state and persistence
├── lib/               # Utility functions and constants
├── styles/            # Global styling and Tailwind configurations
└── types/             # TypeScript definitions
```

---

## ⚙️ Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NematSachdeva/calendar_frontend.git
   cd calendar_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧠 Design Decisions

- **Clarity over Complexity**: We intentionally removed horizontal "range bars" that spanned multiple rows. While common in Gantt charts, they often cluttered the monthly grid. Instead, we shifted to a "start-pinned" model with end markers, ensuring the calendar remains readable even with many overlapping tasks.
- **Component Separation**: State logic (selection, persistence) is decoupled from the UI components via custom hooks, making the codebase easier to maintain and test.
- **Interactive Tooltips**: To compensate for minimal grid visuals, we implemented rich "Day Summary" tooltips that provide all necessary details on hover.

---

## 🚀 Future Improvements

- [ ] **Drag-and-Drop**: Ability to move notes between days directly in the grid.
- [ ] **Multi-Calendar Sync**: Integration with Google Calendar or Outlook APIs.
- [ ] **Categories & Tags**: Customizable labels and filtering for different types of notes.
- [ ] **Export to PDF**: Generate a printable version of the monthly planner.

---

## 👤 Author

**Nemat Sachdeva**
- GitHub: [@NematSachdeva](https://github.com/NematSachdeva)
- LinkedIn: [Nemat Sachdeva](https://linkedin.com/in/nematsachdeva)

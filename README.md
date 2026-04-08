# Calendar App

A modern, production-ready calendar application built with React, TypeScript, and Tailwind CSS.

## Features

- Interactive monthly calendar with date range selection
- Add, edit, and delete notes for specific dates
- Color-coded notes (yellow, blue, green, pink)
- Dark mode support
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Local storage persistence

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **date-fns** - Date utilities
- **React Router** - Routing
- **Radix UI** - Accessible components

## Project Structure

```
src/
├── components/
│   ├── calendar/          # Calendar-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and constants
├── types/                 # TypeScript type definitions
├── pages/                 # Page components
├── assets/                # Static assets
├── App.tsx                # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

1. **Navigate months** - Use the arrow buttons to move between months
2. **Select dates** - Click on a date to select it or create a date range
3. **Add notes** - Select a date and type a note in the notes panel
4. **Choose color** - Select a color for your note before adding
5. **Delete notes** - Hover over a note and click the trash icon
6. **Toggle theme** - Click the sun/moon icon in the top-right corner

## Development

### Code Quality

- ESLint for code linting
- TypeScript for type safety
- Tailwind CSS for consistent styling

### Testing

```bash
npm run test
npm run test:watch
```

## License

MIT

# Technical Architecture

## Tech Stack
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: TBD (Context API, Zustand, or Redux Toolkit)
- **Navigation**: React Navigation
- **Storage**: AsyncStorage (MVP) → SQLite (later)
- **File Handling**: expo-file-system, expo-document-picker
- **Date/Time**: date-fns or dayjs
- **CSV/XLSX**: 
  - CSV: Built-in parsing or csv-parse
  - XLSX: xlsx library

## Project Structure
```
Trotter/
├── app/                    # Expo Router or React Navigation screens
│   ├── events/
│   ├── registration/
│   ├── finishers/
│   └── results/
├── components/             # Reusable UI components
│   ├── EventCard.tsx
│   ├── ParticipantList.tsx
│   ├── TimerDisplay.tsx
│   └── ...
├── services/              # Business logic
│   ├── eventService.ts
│   ├── participantService.ts
│   ├── timerService.ts
│   └── resultsService.ts
├── storage/               # Data persistence
│   ├── storage.ts
│   └── migrations/
├── utils/                 # Helpers
│   ├── csvParser.ts
│   ├── xlsxParser.ts
│   ├── timeFormatter.ts
│   └── ageGroupCalculator.ts
├── types/                 # TypeScript types
│   └── models.ts
└── scripts/              # Local Node.js scripts
    ├── import-participants.js
    └── export-results.js
```

## Key Design Decisions

### 1. State Management
**Recommendation**: Start with **Context API + useReducer** for simplicity
- If it gets complex, migrate to **Zustand** (lightweight, no boilerplate)
- Avoid Redux unless we really need it

### 2. Navigation
**Recommendation**: **React Navigation** (Stack + Tab)
- Events List → Event Detail (tabs: Registration, Finishers, Results)

### 3. Storage
**MVP**: AsyncStorage (simple key-value)
**Later**: SQLite for better querying and relationships

### 4. Timer Implementation
- Use `setInterval` or `requestAnimationFrame` for smooth clock updates
- Store absolute timestamps, calculate relative times on display
- Handle app backgrounding (pause timer or continue in background)

### 5. File Import
- Use `expo-document-picker` to select CSV/XLSX files
- Parse in memory, validate, then save to storage
- Show progress/errors during import

## Development Workflow
1. **Local development**: `npx expo start`
2. **iOS Simulator**: `npx expo run:ios` (uses local Xcode)
3. **Testing**: Manual testing on simulator/device
4. **Scripts**: Node.js scripts in `/scripts` for data operations

## Future Architecture (Post-MVP)
- **Backend**: Node.js/Express or Firebase
- **Database**: PostgreSQL or Firebase Firestore
- **Real-time**: WebSockets or Firebase Realtime Database
- **Auth**: Simple email/password or OAuth
- **Sync**: Optimistic updates with conflict resolution

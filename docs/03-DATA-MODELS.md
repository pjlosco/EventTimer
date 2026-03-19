# Data Models

## Event
```typescript
interface Event {
  id: string; // UUID
  name: string;
  date: Date;
  type: EventType; // '5k' | '10k' | 'marathon' | 'custom'
  location?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  participants: Participant[];
  timer: TimerState;
  results: Result[];
}
```

## Participant
```typescript
interface Participant {
  id: string; // UUID
  eventId: string; // FK to Event
  bibNumber: number; // Unique within event
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F' | 'Other'; // TBD based on questions
  email?: string;
  phone?: string;
  team?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Finishers & Timing (Two Separate Lists)

Bib order and timestamps are **separate until results**. Matched by **position** (1st bib ↔ 1st timestamp).

```typescript
// List 1: Bib numbers in finish order (simple number entry)
orderedBibs: number[]; // [101, 42, 7, 203, ...]

// List 2: Timestamps in finish order (tap-to-stamp)
interface FinishTimestamp {
  id: string; // UUID
  timestamp: Date; // Real device time when stamped (official)
  order: number; // 1, 2, 3, ... (position = finish order)
}
finishTimestamps: FinishTimestamp[];
```

## Timer State
```typescript
interface TimerState {
  eventId: string; // FK to Event
  startTime: Date | null; // Real time when race started (critical)
  isRunning: boolean;
  orderedBibs: number[];
  finishTimestamps: FinishTimestamp[];
}
```

## Result (Derived at Tabulation)

Results are **derived** when tabulating: `bib = orderedBibs[i]`, `time = finishTimestamps[i].timestamp - startTime`.

```typescript
interface Result {
  participantId: string; // FK to Participant (lookup by bib)
  bibNumber: number;
  finishOrder: number; // 1, 2, 3, ...
  finishTime: string; // "HH:MM:SS" (flexible; races can run hours)
  finishTimeMs: number; // Milliseconds from start
  ageGroup: string; // From user-defined brackets
  genderPlace: number;
  ageGroupPlace: number;
}
```

## Age Group Calculation

- **Suggestions only**; user customizes per event. See [06-AGE-BRACKETS.md](./06-AGE-BRACKETS.md).
- Default presets: e.g. Youth (8&U, 9–10, 11–12, …), Adult 5-year (18–24, 25–29, …), Adult 10-year (18–29, 30–39, …).
- Store custom brackets per event.

---

## Storage Strategy
- **Local**: React Native AsyncStorage or SQLite (via expo-sqlite)
- **File format**: JSON for simplicity initially
- **Future**: Migrate to SQLite for better querying, then cloud sync

---

## Import/Export Formats

### CSV Import (Participants)
```csv
bib,firstName,lastName,gender,age
101,John,Doe,M,25
102,Jane,Smith,F,30
```

### XLSX Import
Same columns, Excel format

### Export Format (Future)
- CSV results
- JSON full event data
- PDF results report

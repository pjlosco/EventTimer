# Feature Breakdown

## 1. Events List (NEW - Not in Old App)
**Purpose**: Manage multiple races/events

### Features
- **Card-based list** of all events
- **Create new event** if none exist (or empty state)
- **Default event type**: 5k running event
- **Event details**: Name, date/time, type, location, description (revisit when supporting different race types)
- **Tap event** → Navigate to event details/timing area

### Future Considerations
- Event types beyond 5k (marathon, 10k, etc.)
- Event templates
- Event archiving

---

## 2. Registration (Participants)
**Purpose**: Manage race participants

### Features
- **Participant list** with all registered entrants
- **Add participants** incrementally through app
- **Import participants** from CSV or XLSX files
- **Participant fields** (from old app + questions):
  - Bib Number (unique identifier)
  - First Name
  - Last Name
  - Age
  - Gender
  - *(Additional fields TBD)*

### Import Format
- **CSV**: `bib,firstName,lastName,gender,age` (comma-separated)
- **XLSX**: Same columns, Excel format
- **Validation**: Check for duplicate bibs, required fields

### Future Considerations
- Bulk edit
- Search/filter participants
- Participant categories/divisions

---

## 3. Finishers & Timing (CRITICAL - Core Feature)
**Purpose**: Track finish order and timestamps accurately

### Core Model: Two Separate Lists
- **List 1 — Bib order**: Simple number entry. Log bibs in finish order as they're called/seen.
- **List 2 — Timestamps**: Stamp real time when each finisher crosses. Order = finish order.
- Lists stay **separate until results**. We match by **position**: 1st bib ↔ 1st timestamp, etc.

### View Modes
- **Focused views**: Bib-only **or** timestamp-only. Use when one person handles one job.
- **Split view**: Top half = bib list, bottom half = logging button. For power users doing both.

### Timer
- **In same view** when logging times.
- **Use device real time** for stamps = official race start. Critical.
- Start/stop race timer; show live clock (HH:MM:SS).

### Manual Adjustments (all supported)
- **Drag-and-drop** to reorder.
- **Swipe** to delete.
- **Tap** entry to edit timestamp.
- **Plus button** to add a missing value at any line (bib or timestamp).

### Features Needed
- [ ] Start/stop race timer (real time)
- [ ] Visual clock display (HH:MM:SS)
- [ ] Bib list: simple number entry, ordered
- [ ] Timestamp list: tap-to-stamp logging
- [ ] Focused view: bib-only
- [ ] Focused view: timestamp-only
- [ ] Split view: bib list + stamp button
- [ ] Reorder: drag-and-drop
- [ ] Remove: swipe to delete
- [ ] Edit: tap to fix timestamp
- [ ] Plus button: insert missing at any line
- [ ] Undo last entry (nice-to-have)

### Key Challenges
- **Chaotic finish lines**: Multiple people crossing at once.
- **Order changes**: Finishers swapping after the line.
- **Manual intervention**: Easy fixes via reorder, edit, delete, add.

---

## 4. Results
**Purpose**: Display race results with rankings and brackets

### Core Logic
1. Match **bib number** (participant ID) to **finish order**
2. Match **finish order** to **timestamp** (from timer)
3. Calculate finish time = timestamp - race start time

### Display Features
- **Overall results**: Top finishers, full rankings
- **Bracket results**: Filter by:
  - Gender (Male/Female)
  - Age groups (suggestions + **user-customizable** — see [06-AGE-BRACKETS.md](./06-AGE-BRACKETS.md))
- **Participant lookup**: Search by bib or name
- **Time format**: HH:MM:SS (flexible; some races run hours)

### Future Considerations
- Export results (CSV, PDF)
- Share results (email, social)
- Print-friendly view
- Awards/medals tracking

---

## Future Features (Post-MVP)
- Server-side sync
- Multi-user collaboration (multiple timers for same event)
- Integration with chip timing systems
- Real-time results display (web dashboard)
- Participant check-in
- Photo finish support
- Split times (for longer races)

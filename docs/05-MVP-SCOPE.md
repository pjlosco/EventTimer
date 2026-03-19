# MVP Scope Definition

## Goal
Ship a working race timing app that can successfully time a 5k race with basic features.

---

## Must-Have Features (MVP)

### 1. Events
- [x] Create a new event (name, date, type: 5k)
- [x] List all events (card-based UI)
- [x] Select event to enter timing area
- [x] At least one event must exist (empty state → create)

### 2. Registration (Participants)
- [x] Add participant manually (bib, name, age, gender)
- [x] List all participants
- [x] Import from CSV file
- [x] Validate: unique bib numbers, required fields
- [x] Edit/delete participants
- [x] Auto-assign bib numbers

### 3. Finishers & Timing
- [ ] Two separate lists: bib order + timestamps (matched by position at results)
- [ ] Start/stop race timer (real time) in same view
- [ ] Visual clock display (HH:MM:SS)
- [ ] Bib list: simple number entry, ordered
- [ ] Timestamp list: tap-to-stamp logging
- [ ] View modes: focused (bib-only **or** timestamp-only) + split view
- [ ] Reorder: drag-and-drop
- [ ] Remove: swipe to delete
- [ ] Edit: tap to fix timestamp
- [ ] Plus button: insert missing at any line

### 4. Results
- [x] Tabulate: match bibs ↔ timestamps by position; finish time = timestamp − start
- [x] Match bibs to participants
- [x] Display overall results (rank, bib, name, time); time format HH:MM:SS
- [x] Filter by gender (Male/Female)
- [x] Age group filtering (suggested brackets - auto-calculated from age)

---

## Nice-to-Have (Post-MVP)
- [ ] Import from XLSX (CSV is MVP)
- [ ] Export results to CSV
- [ ] Multiple event types
- [ ] Advanced age group brackets
- [ ] Search participants
- [ ] Undo last finisher entry
- [ ] Sound/vibration on finisher log
- [ ] Timer continues in background

---

## Out of Scope (Future)
- [ ] Cloud sync
- [ ] Multi-user collaboration
- [ ] Chip timing integration
- [ ] Web dashboard
- [ ] Email sharing
- [ ] Participant check-in
- [ ] Photo finish

---

## Success Criteria
MVP is complete when:
1. ✅ Can create an event
2. ✅ Can add/import participants
3. ✅ Can start timer and log finishers accurately
4. ✅ Can view results with proper rankings
5. ✅ Can handle a real 5k race (50-200 participants)
6. ✅ App is stable and doesn't crash
7. ✅ Data persists between app restarts

---

## Milestone Breakdown
- **Milestone 1**: Project setup + Events list ✅
- **Milestone 2**: Registration (participants + CSV import) ✅
- **Milestone 3**: Timer + Finisher logging (two lists, view modes, manual adjustments) ✅
- **Milestone 4**: Results tabulation + display (brackets, age groups) ✅
- **Milestone 2**: Registration (participants + CSV import)
- **Milestone 3**: Timer + Finisher logging (two lists, view modes, manual adjustments)
- **Milestone 4**: Results tabulation + display (brackets, age groups)
- **Milestone 5**: Polish, testing, bug fixes

---

## Optional Cleanup (Post-MVP)
- [ ] **Delete `android-legacy/`** once Trotter is stable and you no longer need the old EventTimer Android code for reference. See [android-legacy/README.md](../android-legacy/README.md).

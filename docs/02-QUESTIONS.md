# Questions for Clarification

## Answered (Decisions Log)

### Event Details
- **Event fields**: Name, date/time, type, location, description. All good. Revisit when supporting different race types.

### Finishers & Timing
- **Split view**: Top half = bib list, bottom half = logging button. ✓
- **Two separate lists**: (1) Bib numbers in finish order, (2) Timestamps in order. Kept **separate until tabulating results**; matched by position then.
- **Bib entry**: Simple number entry into a list. Time **stamping** is the challenging part.
- **View modes**: **Focused views** (bib-only OR timestamp-only) **or** **split view** for power users doing both at once.
- **Timer**: In the same view when logging times. **Use real time** for timestamps = official race start. Critical.
- **Manual adjustments**: Support all — drag-and-drop reorder, swipe to delete, tap to edit. **Plus button** to add a missing value at any line.

### Results & Brackets
- **Age brackets**: Suggestions only; **user customizes**. See [06-AGE-BRACKETS.md](./06-AGE-BRACKETS.md).
- **Time format**: Flexible. Some races run hours. Use **HH:MM:SS** as default.

---

## Still Open (Revisit as we build)

### Participant Data
- Additional fields beyond bib, name, age, gender? (Email, phone, team, etc.)
- Gender: M/F only or more inclusive options?
- Age validation min/max? Auto age-group from age?

### Finishers & Timing (Details)
- Exact bib vs timestamp flow in split view (who does what when)?
- Rapid entries / multiple finishers at once?
- Visual feedback on log (highlight, sound, vibration)?

### Technical
- Offline-first confirmation.
- Auto-save vs manual save.
- Export event data before cloud sync?

### MVP
- MVP feature set refinement; will evolve as we build.

# Finishers & Timing Screen - Improvement Notes

## Timer Controls

### Stop/Configure Button
- **Current**: Large "Stop Timer" button
- **Change to**: Smaller "configure" style button (gear icon or similar)
- **Purpose**: Allow multiple actions, not just stop

### Timer Configuration Options
When clicking the configure button, show options:
1. **View/Edit Start Time**
   - Display current official start time
   - Allow manual entry of start time (HH:MM:SS format)
   - Show what the current device time was when timer started
   - Time display should cap at **99:99:99** (for viewing races later)
   
2. **Close Race**
   - At some point, allow "closing the race"
   - When closing, automatically set official start time to match the **last logged timestamp**
   - This finalizes the race timing

3. **Stop Timer** (keep as option, but not primary)

### Time Display
- Timer display should cap at **99:99:99** maximum
- This prevents overflow when viewing races at a later date
- Still calculate correctly internally, just cap the display

---

## Bib Entry Improvements

### Keyboard Submission
- **Current**: Must tap "Add" button
- **Change to**: 
  - Allow keyboard "Submit/Enter" button to submit bib entry
  - After submission, **automatically close/dismiss keyboard**
  - This prevents accidental taps on other UI elements while keyboard is open

---

## List Ordering

### Reverse Order (Latest First)
- **Current**: Lists show in ascending order (1, 2, 3...)
- **Change to**: **Descending order** - latest entries at top
- **Bib Order List**: Newest bib added appears at top
- **Timestamp List**: Most recent timestamp appears at top

### Benefits
- As new entries are added, they appear at the top
- Keyboard remains visible while confirming data is added
- Easier to see most recent activity
- Natural flow for rapid data entry during chaotic finish lines

---

## Implementation Priority

1. **High Priority**:
   - Reverse list order (descending)
   - Keyboard submit + auto-close
   - Smaller configure button

2. **Medium Priority**:
   - Configure menu with start time editing
   - Time display cap (99:99:99)

3. **Lower Priority**:
   - Close race functionality
   - Set start time to last logged timestamp

---

## Technical Notes

- Use `Keyboard.dismiss()` from `react-native` to close keyboard
- For reverse order: `data.reverse()` or sort by timestamp/order descending
- Configure button: Use icon button (gear/settings icon) in top-right or near timer
- Modal or bottom sheet for configure options
- Time input: Use TextInput with HH:MM:SS format validation

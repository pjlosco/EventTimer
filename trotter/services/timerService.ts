import type { TimerState, FinishTimestamp } from '../types/models';
import { getTimersJson, setTimersJson } from '../storage/storage';

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function loadTimerState(eventId: string): Promise<TimerState | null> {
  try {
    const raw = await getTimersJson();
    if (!raw) return null;
    const all = JSON.parse(raw) as TimerState[];
    const found = Array.isArray(all) ? all.find((t) => t.eventId === eventId) : null;
    return found || null;
  } catch (error) {
    console.error('Error loading timer state:', error);
    return null;
  }
}

export async function loadAllTimerStates(): Promise<TimerState[]> {
  try {
    const raw = await getTimersJson();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TimerState[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading all timer states:', error);
    return [];
  }
}

async function saveTimerState(state: TimerState): Promise<void> {
  try {
    const all = await loadAllTimerStates();
    const index = all.findIndex((t) => t.eventId === state.eventId);
    if (index >= 0) {
      all[index] = state;
    } else {
      all.push(state);
    }
    await setTimersJson(JSON.stringify(all));
  } catch (error) {
    console.error('Error saving timer state:', error);
    throw error;
  }
}

export async function getOrCreateTimerState(eventId: string): Promise<TimerState> {
  const existing = await loadTimerState(eventId);
  if (existing) {
    return existing;
  }
  const newState: TimerState = {
    eventId,
    startTime: null,
    isRunning: false,
    orderedBibs: [],
    finishTimestamps: [],
  };
  await saveTimerState(newState);
  return newState;
}

export async function startTimer(eventId: string): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.startTime = new Date().toISOString();
  state.isRunning = true;
  await saveTimerState(state);
  return state;
}

export async function stopTimer(eventId: string): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.isRunning = false;
  await saveTimerState(state);
  return state;
}

export async function updateStartTime(
  eventId: string,
  newStartTime: string
): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.startTime = newStartTime;
  await saveTimerState(state);
  return state;
}

export async function addBibToOrder(eventId: string, bibNumber: number): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  if (!state.orderedBibs.includes(bibNumber)) {
    state.orderedBibs.push(bibNumber);
    await saveTimerState(state);
  }
  return state;
}

export async function removeBibFromOrder(eventId: string, bibNumber: number): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.orderedBibs = state.orderedBibs.filter((b) => b !== bibNumber);
  await saveTimerState(state);
  return state;
}

export async function reorderBibs(eventId: string, newOrder: number[]): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.orderedBibs = newOrder;
  await saveTimerState(state);
  return state;
}

export async function addTimestamp(eventId: string): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  const newOrder = state.finishTimestamps.length + 1;
  const timestamp: FinishTimestamp = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    order: newOrder,
  };
  state.finishTimestamps.push(timestamp);
  await saveTimerState(state);
  return state;
}

export async function removeTimestamp(eventId: string, timestampId: string): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.finishTimestamps = state.finishTimestamps.filter((t) => t.id !== timestampId);
  // Reorder remaining timestamps
  state.finishTimestamps.forEach((t, index) => {
    t.order = index + 1;
  });
  await saveTimerState(state);
  return state;
}

export async function updateTimestamp(
  eventId: string,
  timestampId: string,
  newTimestamp: string
): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  const timestamp = state.finishTimestamps.find((t) => t.id === timestampId);
  if (timestamp) {
    timestamp.timestamp = newTimestamp;
    await saveTimerState(state);
  }
  return state;
}

export async function insertBibAtPosition(
  eventId: string,
  bibNumber: number,
  position: number
): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  state.orderedBibs.splice(position - 1, 0, bibNumber);
  await saveTimerState(state);
  return state;
}

export async function insertTimestampAtPosition(
  eventId: string,
  position: number
): Promise<TimerState> {
  const state = await getOrCreateTimerState(eventId);
  const timestamp: FinishTimestamp = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    order: position,
  };
  // Insert and reorder
  state.finishTimestamps.splice(position - 1, 0, timestamp);
  state.finishTimestamps.forEach((t, index) => {
    t.order = index + 1;
  });
  await saveTimerState(state);
  return state;
}

// Calculate elapsed time from start
export function getElapsedTime(startTime: string | null): number {
  if (!startTime) return 0;
  const start = new Date(startTime).getTime();
  const now = new Date().getTime();
  return now - start;
}

// Format time as HH:MM:SS
export function formatTime(milliseconds: number): string {
  // Handle negative values (shouldn't happen, but protect against it)
  const absMs = Math.abs(milliseconds);
  const totalSeconds = Math.floor(absMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const sign = milliseconds < 0 ? '-' : '';
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Calculate finish time for a timestamp
export function getFinishTime(startTime: string | null, timestamp: string): string {
  if (!startTime) return '00:00:00';
  const start = new Date(startTime).getTime();
  const finish = new Date(timestamp).getTime();
  return formatTime(finish - start);
}

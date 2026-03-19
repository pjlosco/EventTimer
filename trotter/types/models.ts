/**
 * Trotter data models. See docs/03-DATA-MODELS.md.
 */

export type EventType = '5k' | '10k' | 'marathon' | 'custom';

export interface Event {
  id: string;
  name: string;
  date: string; // ISO date string for JSON serialization
  type: EventType;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCreateInput {
  name: string;
  date: Date;
  type?: EventType;
  location?: string;
  description?: string;
}

export type Gender = 'M' | 'F' | 'Other';

export interface Participant {
  id: string;
  eventId: string;
  bibNumber: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  email?: string;
  phone?: string;
  team?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantCreateInput {
  eventId: string;
  bibNumber: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  email?: string;
  phone?: string;
  team?: string;
}

export interface FinishTimestamp {
  id: string;
  timestamp: string; // ISO string for JSON serialization
  order: number; // 1, 2, 3, ... (position = finish order)
}

export interface TimerState {
  eventId: string;
  startTime: string | null; // ISO string or null
  isRunning: boolean;
  orderedBibs: number[]; // [101, 42, 7, 203, ...]
  finishTimestamps: FinishTimestamp[];
}

export interface Result {
  participantId: string | null; // null if participant not found
  bibNumber: number;
  finishOrder: number; // 1, 2, 3, ...
  finishTime: string; // "HH:MM:SS"
  finishTimeMs: number; // Milliseconds from start
  participantName?: string; // "First Last" if participant found
  age?: number;
  gender?: Gender;
  ageGroup?: string; // Calculated from age
  genderPlace?: number; // Position within gender
  ageGroupPlace?: number; // Position within age group
}

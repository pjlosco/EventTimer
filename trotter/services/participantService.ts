import type { Participant, ParticipantCreateInput } from '../types/models';
import { getParticipantsJson, setParticipantsJson } from '../storage/storage';

// Simple UUID v4-like generator (same as in eventService)
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function loadParticipants(eventId: string): Promise<Participant[]> {
  try {
    const raw = await getParticipantsJson();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Participant[];
    const all = Array.isArray(parsed) ? parsed : [];
    // Filter by eventId
    return all.filter((p) => p.eventId === eventId);
  } catch (error) {
    console.error('Error loading participants:', error);
    return [];
  }
}

export async function loadAllParticipants(): Promise<Participant[]> {
  try {
    const raw = await getParticipantsJson();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Participant[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading all participants:', error);
    return [];
  }
}

async function saveAllParticipants(participants: Participant[]): Promise<void> {
  try {
    await setParticipantsJson(JSON.stringify(participants));
  } catch (error) {
    console.error('Error saving participants:', error);
    throw error;
  }
}

export async function createParticipant(
  input: ParticipantCreateInput
): Promise<Participant> {
  try {
    // Check for duplicate bib number within the same event
    const existing = await loadParticipants(input.eventId);
    const duplicate = existing.find((p) => p.bibNumber === input.bibNumber);
    if (duplicate) {
      throw new Error(`Bib number ${input.bibNumber} is already taken`);
    }

    const now = new Date().toISOString();
    const participant: Participant = {
      id: generateId(),
      eventId: input.eventId,
      bibNumber: input.bibNumber,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      age: input.age,
      gender: input.gender,
      email: input.email?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      team: input.team?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const all = await loadAllParticipants();
    all.push(participant);
    await saveAllParticipants(all);
    return participant;
  } catch (error) {
    console.error('Error creating participant:', error);
    throw error;
  }
}

export async function updateParticipant(
  id: string,
  updates: Partial<ParticipantCreateInput>
): Promise<Participant> {
  try {
    const all = await loadAllParticipants();
    const index = all.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Participant not found');
    }

    const existing = all[index];

    // If bib number is being updated, check for duplicates
    if (updates.bibNumber !== undefined && updates.bibNumber !== existing.bibNumber) {
      const eventParticipants = all.filter((p) => p.eventId === existing.eventId);
      const duplicate = eventParticipants.find(
        (p) => p.bibNumber === updates.bibNumber && p.id !== id
      );
      if (duplicate) {
        throw new Error(`Bib number ${updates.bibNumber} is already taken`);
      }
    }

    const updated: Participant = {
      ...existing,
      ...updates,
      bibNumber: updates.bibNumber ?? existing.bibNumber,
      firstName: updates.firstName?.trim() ?? existing.firstName,
      lastName: updates.lastName?.trim() ?? existing.lastName,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    await saveAllParticipants(all);
    return updated;
  } catch (error) {
    console.error('Error updating participant:', error);
    throw error;
  }
}

export async function deleteParticipant(id: string): Promise<void> {
  try {
    const all = await loadAllParticipants();
    const filtered = all.filter((p) => p.id !== id);
    if (filtered.length === all.length) {
      throw new Error('Participant not found');
    }
    await saveAllParticipants(filtered);
  } catch (error) {
    console.error('Error deleting participant:', error);
    throw error;
  }
}

export function getParticipantByBib(
  participants: Participant[],
  bibNumber: number
): Participant | undefined {
  return participants.find((p) => p.bibNumber === bibNumber);
}

export async function getNextAvailableBibNumber(eventId: string): Promise<number> {
  const participants = await loadParticipants(eventId);
  if (participants.length === 0) {
    return 1;
  }
  // Get all bib numbers and sort them
  const bibNumbers = participants.map((p) => p.bibNumber).sort((a, b) => a - b);
  // Find the first gap, or return the next number after the highest
  for (let i = 0; i < bibNumbers.length; i++) {
    const expected = i + 1;
    if (bibNumbers[i] !== expected) {
      return expected;
    }
  }
  // No gaps found, return next number
  return bibNumbers[bibNumbers.length - 1] + 1;
}

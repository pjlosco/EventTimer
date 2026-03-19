import { format, parseISO } from 'date-fns';
import type { Event, EventCreateInput } from '../types/models';
import { getEventsJson, setEventsJson } from '../storage/storage';

// Simple UUID v4-like generator for React Native
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function loadEvents(): Promise<Event[]> {
  try {
    const raw = await getEventsJson();
    if (!raw) {
      console.log('No events found in storage');
      return [];
    }
    const parsed = JSON.parse(raw) as Event[];
    const events = Array.isArray(parsed) ? parsed : [];
    console.log(`Loaded ${events.length} events from storage`);
    console.log('Events data:', JSON.stringify(events, null, 2));
    return events;
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
}

export async function saveEvents(events: Event[]): Promise<void> {
  try {
    const json = JSON.stringify(events);
    await setEventsJson(json);
    console.log(`Saved ${events.length} events to storage`);
  } catch (error) {
    console.error('Error saving events:', error);
    throw error;
  }
}

export async function createEvent(input: EventCreateInput): Promise<Event> {
  try {
    const now = new Date().toISOString();
    const event: Event = {
      id: generateId(),
      name: input.name.trim(),
      date: input.date.toISOString(),
      type: input.type ?? '5k',
      location: input.location?.trim() || undefined,
      description: input.description?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    
    console.log('Creating event:', event.name, 'with ID:', event.id);
    const events = await loadEvents();
    console.log(`Current events count before add: ${events.length}`);
    events.push(event);
    await saveEvents(events);
    console.log('Event created successfully');
    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export function formatEventDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

export function formatEventDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d');
  } catch {
    return iso;
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_KEY = '@trotter/events';
const PARTICIPANTS_KEY = '@trotter/participants';
const TIMERS_KEY = '@trotter/timers';

export async function getEventsJson(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(EVENTS_KEY);
    return value;
  } catch (error) {
    console.error('AsyncStorage getItem error:', error);
    throw error;
  }
}

export async function setEventsJson(json: string): Promise<void> {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, json);
  } catch (error) {
    console.error('AsyncStorage setItem error:', error);
    throw error;
  }
}

export async function getParticipantsJson(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PARTICIPANTS_KEY);
  } catch (error) {
    console.error('AsyncStorage getItem error (participants):', error);
    throw error;
  }
}

export async function setParticipantsJson(json: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PARTICIPANTS_KEY, json);
  } catch (error) {
    console.error('AsyncStorage setItem error (participants):', error);
    throw error;
  }
}

export async function getTimersJson(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TIMERS_KEY);
  } catch (error) {
    console.error('AsyncStorage getItem error (timers):', error);
    throw error;
  }
}

export async function setTimersJson(json: string): Promise<void> {
  try {
    await AsyncStorage.setItem(TIMERS_KEY, json);
  } catch (error) {
    console.error('AsyncStorage setItem error (timers):', error);
    throw error;
  }
}

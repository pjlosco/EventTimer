import type { Result, Participant, TimerState, Gender } from '../types/models';
import { loadParticipants } from './participantService';
import { loadTimerState, getFinishTime } from './timerService';

// Age bracket presets (suggestions)
export const AGE_BRACKET_PRESETS = {
  youth: [
    { label: '8 & Under', min: 0, max: 8 },
    { label: '9-10', min: 9, max: 10 },
    { label: '11-12', min: 11, max: 12 },
    { label: '13-14', min: 13, max: 14 },
    { label: '15-16', min: 15, max: 16 },
    { label: '17-18', min: 17, max: 18 },
  ],
  adult5year: [
    { label: '18-24', min: 18, max: 24 },
    { label: '25-29', min: 25, max: 29 },
    { label: '30-34', min: 30, max: 34 },
    { label: '35-39', min: 35, max: 39 },
    { label: '40-44', min: 40, max: 44 },
    { label: '45-49', min: 45, max: 49 },
    { label: '50-54', min: 50, max: 54 },
    { label: '55-59', min: 55, max: 59 },
    { label: '60-64', min: 60, max: 64 },
    { label: '65-69', min: 65, max: 69 },
    { label: '70-74', min: 70, max: 74 },
    { label: '75-79', min: 75, max: 79 },
    { label: '80+', min: 80, max: 999 },
  ],
  adult10year: [
    { label: '18-29', min: 18, max: 29 },
    { label: '30-39', min: 30, max: 39 },
    { label: '40-49', min: 40, max: 49 },
    { label: '50-59', min: 50, max: 59 },
    { label: '60-69', min: 60, max: 69 },
    { label: '70+', min: 70, max: 999 },
  ],
};

export function calculateAgeGroup(age: number, preset: keyof typeof AGE_BRACKET_PRESETS = 'adult10year'): string {
  const brackets = AGE_BRACKET_PRESETS[preset];
  for (const bracket of brackets) {
    if (age >= bracket.min && age <= bracket.max) {
      return bracket.label;
    }
  }
  return 'Unknown';
}

export async function tabulateResults(eventId: string): Promise<Result[]> {
  const timerState = await loadTimerState(eventId);
  if (!timerState || !timerState.startTime) {
    return [];
  }

  const participants = await loadParticipants(eventId);
  const participantMap = new Map<number, Participant>();
  participants.forEach((p) => {
    participantMap.set(p.bibNumber, p);
  });

  const results: Result[] = [];
  const { orderedBibs, finishTimestamps, startTime } = timerState;

  // Match by position: 1st bib ↔ 1st timestamp, etc.
  const maxLength = Math.max(orderedBibs.length, finishTimestamps.length);
  
  for (let i = 0; i < maxLength; i++) {
    const bib = orderedBibs[i];
    const timestamp = finishTimestamps[i];
    
    if (!bib || !timestamp) {
      // Skip incomplete pairs
      continue;
    }

    const participant = participantMap.get(bib);
    const finishTime = getFinishTime(startTime, timestamp.timestamp);
    const finishTimeMs = new Date(timestamp.timestamp).getTime() - new Date(startTime).getTime();

    const result: Result = {
      participantId: participant?.id || null,
      bibNumber: bib,
      finishOrder: i + 1,
      finishTime,
      finishTimeMs,
      participantName: participant
        ? `${participant.firstName} ${participant.lastName}`
        : undefined,
      age: participant?.age,
      gender: participant?.gender,
      ageGroup: participant?.age ? calculateAgeGroup(participant.age) : undefined,
    };

    results.push(result);
  }

  // Calculate gender and age group places
  const genderGroups = new Map<Gender, Result[]>();
  const ageGroupMap = new Map<string, Result[]>();

  results.forEach((result) => {
    if (result.gender) {
      if (!genderGroups.has(result.gender)) {
        genderGroups.set(result.gender, []);
      }
      genderGroups.get(result.gender)!.push(result);
    }
    if (result.ageGroup) {
      if (!ageGroupMap.has(result.ageGroup)) {
        ageGroupMap.set(result.ageGroup, []);
      }
      ageGroupMap.get(result.ageGroup)!.push(result);
    }
  });

  // Sort within groups and assign places
  genderGroups.forEach((group) => {
    group.sort((a, b) => a.finishTimeMs - b.finishTimeMs);
    group.forEach((result, index) => {
      result.genderPlace = index + 1;
    });
  });

  ageGroupMap.forEach((group) => {
    group.sort((a, b) => a.finishTimeMs - b.finishTimeMs);
    group.forEach((result, index) => {
      result.ageGroupPlace = index + 1;
    });
  });

  return results;
}

export function filterResultsByGender(results: Result[], gender: Gender | 'All'): Result[] {
  if (gender === 'All') return results;
  return results.filter((r) => r.gender === gender);
}

export function filterResultsByAgeGroup(results: Result[], ageGroup: string | 'All'): Result[] {
  if (ageGroup === 'All') return results;
  return results.filter((r) => r.ageGroup === ageGroup);
}

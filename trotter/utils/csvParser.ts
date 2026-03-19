import Papa from 'papaparse';
import type { ParticipantCreateInput, Gender } from '../types/models';

export interface CSVRow {
  bib: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
}

export interface ParseResult {
  success: boolean;
  participants: ParticipantCreateInput[];
  errors: string[];
}

export function parseCSVParticipants(
  csvText: string,
  eventId: string
): ParseResult {
  const result: ParseResult = {
    success: true,
    participants: [],
    errors: [],
  };

  try {
    const parsed = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize header names (case-insensitive, handle spaces)
        const normalized = header.trim().toLowerCase();
        if (normalized === 'bib' || normalized === 'bibnumber' || normalized === 'bib number') {
          return 'bib';
        }
        if (normalized === 'firstname' || normalized === 'first name' || normalized === 'fname') {
          return 'firstName';
        }
        if (normalized === 'lastname' || normalized === 'last name' || normalized === 'lname') {
          return 'lastName';
        }
        if (normalized === 'gender' || normalized === 'sex') {
          return 'gender';
        }
        if (normalized === 'age') {
          return 'age';
        }
        return header;
      },
    });

    if (parsed.errors.length > 0) {
      result.errors.push(...parsed.errors.map((e: any) => e.message || String(e)));
    }

    const seenBibs = new Set<number>();

    parsed.data.forEach((row: CSVRow, index: number) => {
      const rowNum = index + 2; // +2 because header is row 1, and index is 0-based

      // Validate required fields
      if (!row.bib || !row.firstName || !row.lastName || !row.gender || !row.age) {
        result.errors.push(`Row ${rowNum}: Missing required fields`);
        return;
      }

      // Parse bib number
      const bib = parseInt(row.bib.trim(), 10);
      if (isNaN(bib) || bib <= 0) {
        result.errors.push(`Row ${rowNum}: Invalid bib number "${row.bib}"`);
        return;
      }
      if (seenBibs.has(bib)) {
        result.errors.push(`Row ${rowNum}: Duplicate bib number ${bib}`);
        return;
      }
      seenBibs.add(bib);

      // Parse age
      const age = parseInt(row.age.trim(), 10);
      if (isNaN(age) || age <= 0 || age > 150) {
        result.errors.push(`Row ${rowNum}: Invalid age "${row.age}"`);
        return;
      }

      // Parse gender
      const genderChar = row.gender.trim().toUpperCase().charAt(0);
      let gender: Gender = 'M';
      if (genderChar === 'F' || genderChar === 'W') {
        gender = 'F';
      } else if (genderChar === 'O' || genderChar === 'X') {
        gender = 'Other';
      } else if (genderChar !== 'M') {
        result.errors.push(`Row ${rowNum}: Invalid gender "${row.gender}" (using M as default)`);
      }

      result.participants.push({
        eventId,
        bibNumber: bib,
        firstName: row.firstName.trim(),
        lastName: row.lastName.trim(),
        age,
        gender,
      });
    });

    if (result.errors.length > 0 && result.participants.length === 0) {
      result.success = false;
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(error.message || 'Failed to parse CSV');
  }

  return result;
}

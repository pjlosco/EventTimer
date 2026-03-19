import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Result } from '../types/models';

interface ResultRowProps {
  result: Result;
  showAgeGroup?: boolean;
}

export function ResultRow({ result, showAgeGroup = false }: ResultRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.positionContainer}>
        <Text style={styles.position}>{result.finishOrder}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.bib}>#{result.bibNumber}</Text>
          {result.participantName && (
            <Text style={styles.name}>{result.participantName}</Text>
          )}
        </View>
        {result.participantName && (
          <Text style={styles.meta}>
            {result.age && `${result.age} years`}
            {result.age && result.gender && ' • '}
            {result.gender}
            {showAgeGroup && result.ageGroup && ` • ${result.ageGroup}`}
          </Text>
        )}
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{result.finishTime}</Text>
        {result.genderPlace && (
          <Text style={styles.place}>
            {result.gender === 'M' ? 'M' : result.gender === 'F' ? 'F' : ''}
            {result.genderPlace}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  positionContainer: {
    width: 40,
    alignItems: 'center',
  },
  position: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d6b8a',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  bib: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    color: '#999',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: '#333',
  },
  place: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});

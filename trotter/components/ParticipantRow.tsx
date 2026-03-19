import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Participant } from '../types/models';

interface ParticipantRowProps {
  participant: Participant;
  onPress: () => void;
}

export function ParticipantRow({ participant, onPress }: ParticipantRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.bibContainer}>
        <Text style={styles.bibNumber}>{participant.bibNumber}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {participant.firstName} {participant.lastName}
        </Text>
        <Text style={styles.meta}>
          {participant.age} years • {participant.gender}
          {participant.team ? ` • ${participant.team}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rowPressed: {
    opacity: 0.7,
  },
  bibContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bibNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d6b8a',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    fontSize: 13,
    color: '#666',
  },
});

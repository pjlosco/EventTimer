import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Event } from '../types/models';
import { formatEventDateShort } from '../services/eventService';
import { colors, spacing, typography } from '../theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EVENT_TYPE_LABELS: Record<Event['type'], string> = {
  '5k': '5K',
  '10k': '10K',
  marathon: 'Marathon',
  custom: 'Custom',
};

export function EventCard({ event, onPress }: EventCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{EVENT_TYPE_LABELS[event.type]}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.date}>{formatEventDateShort(event.date)}</Text>
          {event.location ? (
            <Text style={styles.meta} numberOfLines={1}>
              📍 {event.location}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.accentBar} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    marginBottom: spacing.md,
    width: '100%',
    overflow: 'hidden',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  name: {
    ...typography.heading.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    backgroundColor: colors.secondary.light + '20', // 20% opacity
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.secondary.light + '40',
  },
  badgeText: {
    ...typography.label.small,
    color: colors.secondary.dark,
  },
  details: {
    gap: spacing.xs,
  },
  date: {
    ...typography.body.medium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  meta: {
    ...typography.body.small,
    color: colors.text.tertiary,
  },
  accentBar: {
    height: 4,
    backgroundColor: colors.primary.main,
    width: '100%',
  },
});

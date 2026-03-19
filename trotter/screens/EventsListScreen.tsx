import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Event } from '../types/models';
import { EventCard } from '../components/EventCard';
import { loadEvents } from '../services/eventService';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EventsList'>;

export function EventsListScreen({ navigation }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async (showRefreshing = false) => {
    console.log('Refreshing events list...');
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const list = await loadEvents();
      console.log(`Events list refreshed: ${list.length} events`, list);
      // Use functional update to ensure state updates
      setEvents((prev) => {
        console.log('setEvents called, prev.length:', prev.length, 'new.length:', list.length);
        return list;
      });
      // Force state update check
      console.log('State updated, events.length should be:', list.length);
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );


  const empty = events.length === 0;
  

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  // Remove the early return for empty - let FlatList handle it with ListEmptyComponent


  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        key={`events-list-${events.length}`}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustContentInsets={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refresh(true)} />
        }
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Text style={styles.addButtonText}>+ New event</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first event to start timing races.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Text style={styles.primaryButtonText}>Create event</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
    flexGrow: 1,
  },
  emptyTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: 12,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    ...typography.label.large,
    color: colors.text.inverse,
  },
  addButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  addButtonText: {
    ...typography.label.medium,
    color: colors.primary.main,
    fontWeight: '700',
  },
});

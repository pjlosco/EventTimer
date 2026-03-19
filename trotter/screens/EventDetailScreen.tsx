import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loadEvents } from '../services/eventService';
import type { Event } from '../types/models';
import type { RootStackParamList } from '../navigation/types';
import { EventTabs } from '../navigation/EventTabs';

type EventDetailProps = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export function EventDetailScreen({ navigation, route }: EventDetailProps) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await loadEvents();
    const found = list.find((e) => e.id === eventId) ?? null;
    setEvent(found);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (event) {
      navigation.setOptions({ title: event.name });
    }
  }, [event, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6b8a" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Event not found.</Text>
      </View>
    );
  }

  return <EventTabs eventId={eventId} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 16,
    color: '#666',
  },
});

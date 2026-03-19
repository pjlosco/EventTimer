import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { createEvent } from '../services/eventService';
import type { RootStackParamList } from '../navigation/types';
import type { EventType } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: '5k', label: '5K' },
  { value: '10k', label: '10K' },
  { value: 'marathon', label: 'Marathon' },
  { value: 'custom', label: 'Custom' },
];

export function CreateEventScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState<EventType>('5k');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  const onDateChange = (_: unknown, d?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (d) setDate(d);
  };

  const showPicker = () => setShowDatePicker(true);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Missing name', 'Please enter an event name.');
      return;
    }
    setSaving(true);
    try {
      const event = await createEvent({
        name: trimmed,
        date,
        type,
        location: location.trim() || undefined,
      });
      // Navigate back to list first (triggers refresh), then to detail
      navigation.navigate('EventsList');
      // Small delay to let EventsList refresh, then navigate to detail
      setTimeout(() => {
        navigation.navigate('EventDetail', { eventId: event.id });
      }, 50);
    } catch (e) {
      console.error('Create event error:', e);
      Alert.alert('Error', 'Could not create event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Event name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Spring 5K 2025"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={showPicker}>
          <Text style={styles.dateText}>{format(date, 'MMMM d, yyyy')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date(2000, 0, 1)}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeRow}>
          {EVENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeChip, type === t.value && styles.typeChipActive]}
              onPress={() => setType(t.value)}
            >
              <Text
                style={[
                  styles.typeChipText,
                  type === t.value && styles.typeChipTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Location (optional)</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Central Park"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Create event</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
    padding: 20,
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  dateText: {
    fontSize: 16,
    color: '#111',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  typeChipActive: {
    backgroundColor: '#0d6b8a',
    borderColor: '#0d6b8a',
  },
  typeChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  typeChipTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#0d6b8a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  pickerWrap: {
    marginTop: 8,
  },
  doneButton: {
    backgroundColor: '#0d6b8a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

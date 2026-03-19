import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import type { TimerState } from '../types/models';

interface TimerConfigModalProps {
  visible: boolean;
  timerState: TimerState | null;
  onClose: () => void;
  onStop: () => void;
  onUpdateStartTime: (newStartTime: string) => void;
}

export function TimerConfigModal({
  visible,
  timerState,
  onClose,
  onStop,
  onUpdateStartTime,
}: TimerConfigModalProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [manualTimeInput, setManualTimeInput] = useState('');
  const [useManualTime, setUseManualTime] = useState(false);

  if (!timerState) return null;

  const startDate = timerState.startTime ? parseISO(timerState.startTime) : new Date();
  const [selectedDate, setSelectedDate] = useState(startDate);

  // Reset selected date when timer state changes
  useEffect(() => {
    if (timerState.startTime) {
      setSelectedDate(parseISO(timerState.startTime));
    }
  }, [timerState.startTime]);

  const handleDateChange = (_: unknown, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(true);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (_: unknown, date?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSaveDateTime = () => {
    const newStartTime = selectedDate.toISOString();
    onUpdateStartTime(newStartTime);
    setUseManualTime(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleManualTimeSave = () => {
    // Parse HH:MM:SS format
    const parts = manualTimeInput.trim().split(':');
    if (parts.length !== 3) {
      Alert.alert('Invalid format', 'Please use HH:MM:SS format (e.g., 06:15:23)');
      return;
    }
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      Alert.alert('Invalid time', 'Please enter valid numbers');
      return;
    }

    // Create new date with today's date but the specified time
    const now = new Date();
    const newDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      seconds
    );
    onUpdateStartTime(newDate.toISOString());
    setManualTimeInput('');
    setUseManualTime(false);
  };

  const originalStartTime = timerState.startTime
    ? format(parseISO(timerState.startTime), 'MMM d, yyyy h:mm:ss a')
    : 'Not started';

  // Calculate available height for ScrollView
  const screenHeight = Dimensions.get('window').height;
  const maxModalHeight = screenHeight * 0.85;
  const headerHeight = 60; // Approximate header height
  const scrollViewMaxHeight = maxModalHeight - headerHeight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Timer Configuration</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeHeaderButton}>
                <Text style={styles.closeHeaderButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={[styles.scrollView, { maxHeight: scrollViewMaxHeight }]}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
            <View style={styles.section}>
              <Text style={styles.label}>Current Start Time</Text>
              <Text style={styles.value}>{originalStartTime}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Change Start Time</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setUseManualTime(false);
                    setShowDatePicker(true);
                  }}
                >
                  <Text style={styles.buttonText}>Pick Date & Time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setUseManualTime(true);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.buttonText}>Enter Time (HH:MM:SS)</Text>
                </TouchableOpacity>
              </View>

              {useManualTime && (
                <View style={styles.manualInput}>
                  <TextInput
                    style={styles.timeInput}
                    value={manualTimeInput}
                    onChangeText={setManualTimeInput}
                    placeholder="06:15:23"
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleManualTimeSave}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}

              {showDatePicker && Platform.OS === 'ios' && (
                <View style={styles.iosPickerWrapper}>
                  <View style={styles.iosPickersRow}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      style={styles.picker}
                    />
                    <DateTimePicker
                      value={selectedDate}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeChange}
                      style={styles.picker}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={handleSaveDateTime}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              {showDatePicker && Platform.OS === 'android' && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </View>
              )}
            </View>

            {timerState.isRunning && (
              <View style={styles.section}>
                <TouchableOpacity style={styles.stopButton} onPress={onStop}>
                  <Text style={styles.stopButtonText}>Stop Timer</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e4e8',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeHeaderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f7f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeHeaderButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  scrollView: {
    // maxHeight will be set dynamically
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#f5f7f8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  manualInput: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e4e8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0d6b8a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  iosPickerWrapper: {
    marginTop: 12,
  },
  iosPickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  picker: {
    height: 150,
    flex: 1,
  },
  pickerContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#0d6b8a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  stopButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#f5f7f8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

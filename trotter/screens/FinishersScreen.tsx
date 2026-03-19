import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { TimerState } from '../types/models';
import {
  getOrCreateTimerState,
  startTimer,
  stopTimer,
  updateStartTime,
  addBibToOrder,
  addTimestamp,
  removeBibFromOrder,
  removeTimestamp,
  reorderBibs,
  formatTime,
  getElapsedTime,
} from '../services/timerService';
import { TimerDisplay } from '../components/TimerDisplay';
import { TimerConfigModal } from '../components/TimerConfigModal';
import { colors, spacing, typography } from '../theme';

type FinishersScreenProps = {
  eventId: string;
};

export function FinishersScreen({ eventId }: FinishersScreenProps) {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [bibInput, setBibInput] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);

  const loadState = useCallback(async () => {
    const state = await getOrCreateTimerState(eventId);
    setTimerState(state);
  }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      loadState();
    }, [loadState])
  );

  const handleStart = async () => {
    if (timerState?.isRunning) {
      Alert.alert('Timer already running', 'Stop the timer first to restart.');
      return;
    }
    const state = await startTimer(eventId);
    setTimerState(state);
  };

  const handleStop = async () => {
    if (!timerState?.isRunning) {
      return;
    }
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: async () => {
            const state = await stopTimer(eventId);
            setTimerState(state);
            setShowConfigModal(false);
          },
        },
      ]
    );
  };

  const handleUpdateStartTime = async (newStartTime: string) => {
    const state = await updateStartTime(eventId, newStartTime);
    setTimerState(state);
  };

  const handleAddBib = async () => {
    const bib = parseInt(bibInput, 10);
    if (isNaN(bib) || bib <= 0) {
      Alert.alert('Invalid bib number', 'Please enter a valid bib number');
      return;
    }
    if (timerState?.orderedBibs.includes(bib)) {
      Alert.alert('Duplicate bib', 'This bib number is already in the list');
      return;
    }
    const state = await addBibToOrder(eventId, bib);
    setTimerState(state);
    setBibInput('');
    Keyboard.dismiss(); // Auto-close keyboard after submission
  };

  const handleStamp = async () => {
    if (!timerState?.isRunning || !timerState.startTime) {
      Alert.alert('Timer not running', 'Start the timer first');
      return;
    }
    const state = await addTimestamp(eventId);
    setTimerState(state);
  };

  const handleRemoveBib = async (bib: number) => {
    const state = await removeBibFromOrder(eventId, bib);
    setTimerState(state);
  };

  const handleRemoveTimestamp = async (timestampId: string) => {
    const state = await removeTimestamp(eventId, timestampId);
    setTimerState(state);
  };

  if (!timerState) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer Section */}
      <View style={styles.timerSection}>
        <View style={styles.timerHeader}>
          <TimerDisplay startTime={timerState.startTime} isRunning={timerState.isRunning} />
          {!timerState.isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start Timer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.configureButton}
              onPress={() => setShowConfigModal(true)}
            >
              <Text style={styles.configureButtonText}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Split View: Bib List (Top) + Timestamp List (Bottom) */}
      <View style={styles.splitContainer}>
        {/* Top Half: Bib Order List */}
        <View style={styles.halfSection}>
          <Text style={styles.sectionTitle}>Bib Order</Text>
          <View style={styles.bibInputRow}>
            <TextInput
              style={styles.bibInput}
              value={bibInput}
              onChangeText={setBibInput}
              placeholder="Enter bib #"
              keyboardType="number-pad"
              onSubmitEditing={handleAddBib}
            />
            <TouchableOpacity style={styles.addBibButton} onPress={handleAddBib}>
              <Text style={styles.addBibButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={[...timerState.orderedBibs].reverse()} // Reverse: latest first
            keyExtractor={(item, index) => `bib-${index}-${item}`}
            renderItem={({ item, index }) => {
              // Calculate position from reversed list
              const actualPosition = timerState.orderedBibs.length - index;
              return (
                <View style={styles.bibRow}>
                  <Text style={styles.bibPosition}>{actualPosition}</Text>
                  <Text style={styles.bibNumber}>{item}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveBib(item)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No bibs added yet</Text>
            }
            style={styles.list}
          />
        </View>

        {/* Bottom Half: Timestamp List */}
        <View style={styles.halfSection}>
          <Text style={styles.sectionTitle}>Finish Times</Text>
          <TouchableOpacity
            style={[
              styles.stampButton,
              (!timerState.isRunning || !timerState.startTime) && styles.stampButtonDisabled,
            ]}
            onPress={handleStamp}
            disabled={!timerState.isRunning || !timerState.startTime}
          >
            <Text style={styles.stampButtonText}>STAMP TIME</Text>
          </TouchableOpacity>
          <FlatList
            data={[...timerState.finishTimestamps].reverse()} // Reverse: latest first
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              let finishTime = '00:00:00';
              if (timerState.startTime) {
                const startMs = new Date(timerState.startTime).getTime();
                const finishMs = new Date(item.timestamp).getTime();
                const diff = finishMs - startMs;
                // Only show time if timestamp is after start time
                if (diff >= 0) {
                  finishTime = formatTime(diff);
                } else {
                  // If negative, show error indicator
                  finishTime = '--:--:--';
                }
              }
              // Calculate position from reversed list
              const actualPosition = timerState.finishTimestamps.length - index;
              return (
                <View style={styles.timestampRow}>
                  <Text style={styles.timestampPosition}>{actualPosition}</Text>
                  <Text style={styles.timestampTime}>{finishTime}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveTimestamp(item.id)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No timestamps yet</Text>
            }
            style={styles.list}
          />
        </View>
      </View>

      <TimerConfigModal
        visible={showConfigModal}
        timerState={timerState}
        onClose={() => setShowConfigModal(false)}
        onStop={handleStop}
        onUpdateStartTime={handleUpdateStartTime}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerSection: {
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.sm,
    borderRadius: 12,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    ...typography.label.medium,
    color: colors.text.inverse,
  },
  configureButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  configureButtonText: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
  },
  halfSection: {
    flex: 1,
    padding: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  sectionTitle: {
    ...typography.heading.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bibInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bibInput: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.medium,
    ...typography.body.medium,
    color: colors.text.primary,
  },
  addBibButton: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    justifyContent: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  addBibButtonText: {
    ...typography.label.medium,
    color: colors.text.inverse,
  },
  stampButton: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  stampButtonDisabled: {
    backgroundColor: colors.neutral.gray400,
    shadowOpacity: 0,
    elevation: 0,
  },
  stampButtonText: {
    ...typography.heading.h4,
    color: colors.text.inverse,
  },
  list: {
    flex: 1,
  },
  bibRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  bibPosition: {
    width: 32,
    ...typography.label.small,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  bibNumber: {
    flex: 1,
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  timestampPosition: {
    width: 32,
    ...typography.label.small,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  timestampTime: {
    flex: 1,
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.error + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.error + '30',
  },
  removeButtonText: {
    color: colors.accent.error,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    ...typography.body.small,
    color: colors.text.tertiary,
    marginTop: spacing.xl,
  },
});

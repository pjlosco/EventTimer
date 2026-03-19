import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { formatTime, getElapsedTime } from '../services/timerService';
import { colors, typography, spacing } from '../theme';

// Cap time display at 99:99:99
function capTimeDisplay(timeStr: string): string {
  const parts = timeStr.split(':');
  if (parts.length !== 3) return timeStr;
  const hours = Math.min(parseInt(parts[0], 10), 99);
  const minutes = Math.min(parseInt(parts[1], 10), 99);
  const seconds = Math.min(parseInt(parts[2], 10), 99);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface TimerDisplayProps {
  startTime: string | null;
  isRunning: boolean;
  showStartTime?: boolean;
}

export function TimerDisplay({ startTime, isRunning, showStartTime = true }: TimerDisplayProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsedMs = getElapsedTime(startTime);
      setElapsed(elapsedMs);
    }, 100); // Update every 100ms for smooth display

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  const formattedStartTime = startTime
    ? format(new Date(startTime), 'MMM d, h:mm:ss a')
    : null;

  // If not running, show static time
  if (!isRunning || !startTime) {
    return (
      <View style={styles.container}>
        <Text style={styles.time}>00:00:00</Text>
        {showStartTime && formattedStartTime && (
          <Text style={styles.startTime}>Started: {formattedStartTime}</Text>
        )}
      </View>
    );
  }

  const timeStr = formatTime(elapsed);
  const cappedTime = capTimeDisplay(timeStr);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{cappedTime}</Text>
      {showStartTime && formattedStartTime && (
        <Text style={styles.startTime}>Started: {formattedStartTime}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    margin: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  time: {
    fontSize: typography.timer.fontSize,
    fontWeight: typography.timer.fontWeight,
    lineHeight: typography.timer.lineHeight,
    letterSpacing: typography.timer.letterSpacing,
    fontVariant: ['tabular-nums'],
    color: colors.primary.main,
    textShadowColor: colors.primary.main + '20',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  startTime: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
});

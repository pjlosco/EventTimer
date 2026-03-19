import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Participant } from '../types/models';
import { ParticipantRow } from '../components/ParticipantRow';
import {
  loadParticipants,
  deleteParticipant,
  createParticipant,
} from '../services/participantService';
import { parseCSVParticipants } from '../utils/csvParser';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ParticipantsList'>;

export function ParticipantsListScreen({ navigation, route }: Props) {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        const list = await loadParticipants(eventId);
        // Sort by bib number
        list.sort((a, b) => a.bibNumber - b.bibNumber);
        setParticipants(list);
      } catch (error) {
        console.error('Error refreshing participants:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId]
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteParticipant(id);
      await refresh();
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  };

  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/vnd.ms-excel'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const csvText = await FileSystem.readAsStringAsync(fileUri);

      const parseResult = parseCSVParticipants(csvText, eventId);

      if (parseResult.errors.length > 0) {
        const errorMsg =
          parseResult.errors.length > 5
            ? `${parseResult.errors.slice(0, 5).join('\n')}\n...and ${parseResult.errors.length - 5} more errors`
            : parseResult.errors.join('\n');
        Alert.alert('Import Errors', errorMsg, [
          {
            text: parseResult.participants.length > 0 ? 'Import Valid Rows' : 'Cancel',
            style: parseResult.participants.length > 0 ? 'default' : 'cancel',
            onPress: parseResult.participants.length > 0 ? () => importParticipants(parseResult.participants) : undefined,
          },
        ]);
        return;
      }

      if (parseResult.participants.length === 0) {
        Alert.alert('No Data', 'CSV file contains no valid participants');
        return;
      }

      await importParticipants(parseResult.participants);
    } catch (error: any) {
      Alert.alert('Import Error', error.message || 'Failed to import CSV file');
    }
  };

  const importParticipants = async (participants: Array<{
    eventId: string;
    bibNumber: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'M' | 'F' | 'Other';
  }>) => {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const participant of participants) {
      try {
        await createParticipant(participant);
        successCount++;
      } catch (error: any) {
        errorCount++;
        errors.push(`Bib ${participant.bibNumber}: ${error.message}`);
      }
    }

    await refresh();

    if (errorCount > 0) {
      const errorMsg =
        errors.length > 5
          ? `${errors.slice(0, 5).join('\n')}\n...and ${errors.length - 5} more errors`
          : errors.join('\n');
      Alert.alert(
        'Import Complete',
        `Imported ${successCount} participants.\n\nErrors:\n${errorMsg}`
      );
    } else {
      Alert.alert('Import Complete', `Successfully imported ${successCount} participants`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6b8a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={participants}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <ParticipantRow
            participant={item}
            onPress={() =>
              navigation.navigate('AddEditParticipant', {
                eventId,
                participantId: item.id,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refresh(true)} />
        }
        ListHeaderComponent={
          <TouchableOpacity style={styles.importButton} onPress={handleImportCSV}>
            <Text style={styles.importButtonText}>📥 Import CSV</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No participants yet</Text>
            <Text style={styles.emptySubtext}>
              Add participants manually or import from CSV
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditParticipant', { eventId })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  importButton: {
    backgroundColor: '#0d6b8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0d6b8a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
});

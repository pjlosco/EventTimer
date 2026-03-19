import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  createParticipant,
  updateParticipant,
  loadAllParticipants,
  getNextAvailableBibNumber,
} from '../services/participantService';
import type { RootStackParamList } from '../navigation/types';
import type { Gender, Participant } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditParticipant'>;

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export function AddEditParticipantScreen({ navigation, route }: Props) {
  const { eventId, participantId } = route.params;
  const isEditing = !!participantId;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);

  const [bibNumber, setBibNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('M');
  const [team, setTeam] = useState('');

  useEffect(() => {
    if (isEditing && participantId) {
      loadParticipant();
    } else {
      // Auto-assign bib number when creating new participant
      assignNextBibNumber();
    }
  }, [participantId, eventId]);

  const assignNextBibNumber = async () => {
    if (!isEditing) {
      try {
        const nextBib = await getNextAvailableBibNumber(eventId);
        setBibNumber(nextBib.toString());
      } catch (error) {
        console.error('Error getting next bib number:', error);
      }
    }
  };

  const loadParticipant = async () => {
    try {
      const all = await loadAllParticipants();
      const found = all.find((p) => p.id === participantId);
      if (found) {
        setParticipant(found);
        setBibNumber(found.bibNumber.toString());
        setFirstName(found.firstName);
        setLastName(found.lastName);
        setAge(found.age.toString());
        setGender(found.gender);
        setTeam(found.team || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load participant');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const bib = parseInt(bibNumber, 10);
    const ageNum = parseInt(age, 10);

    if (!bibNumber.trim() || isNaN(bib) || bib <= 0) {
      Alert.alert('Invalid bib number', 'Please enter a valid bib number');
      return;
    }
    if (!firstName.trim()) {
      Alert.alert('Missing first name', 'Please enter a first name');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Missing last name', 'Please enter a last name');
      return;
    }
    if (!age.trim() || isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
      Alert.alert('Invalid age', 'Please enter a valid age');
      return;
    }

    setSaving(true);
    try {
      if (isEditing && participantId) {
        await updateParticipant(participantId, {
          eventId,
          bibNumber: bib,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: ageNum,
          gender,
          team: team.trim() || undefined,
        });
      } else {
        await createParticipant({
          eventId,
          bibNumber: bib,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: ageNum,
          gender,
          team: team.trim() || undefined,
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not save participant');
    } finally {
      setSaving(false);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <View style={styles.bibRow}>
          <View style={styles.bibInputContainer}>
            <Text style={styles.label}>Bib number *</Text>
            <TextInput
              style={styles.input}
              value={bibNumber}
              onChangeText={setBibNumber}
              placeholder="e.g. 101"
              keyboardType="number-pad"
              editable={!isEditing}
            />
          </View>
          {!isEditing && (
            <TouchableOpacity
              style={styles.autoAssignButton}
              onPress={assignNextBibNumber}
            >
              <Text style={styles.autoAssignText}>Auto</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>First name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="John"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Last name *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Doe"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="25"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[styles.genderChip, gender === g.value && styles.genderChipActive]}
              onPress={() => setGender(g.value)}
            >
              <Text
                style={[
                  styles.genderChipText,
                  gender === g.value && styles.genderChipTextActive,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Team (optional)</Text>
        <TextInput
          style={styles.input}
          value={team}
          onChangeText={setTeam}
          placeholder="Team name"
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Add'} participant
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  content: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  bibRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  bibInputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  autoAssignButton: {
    backgroundColor: '#0d6b8a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoAssignText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  genderChipActive: {
    backgroundColor: '#0d6b8a',
    borderColor: '#0d6b8a',
  },
  genderChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  genderChipTextActive: {
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
});

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsListScreen } from '../screens/EventsListScreen';
import { CreateEventScreen } from '../screens/CreateEventScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { ParticipantsListScreen } from '../screens/ParticipantsListScreen';
import { AddEditParticipantScreen } from '../screens/AddEditParticipantScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#111',
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 17, fontWeight: '600' },
        contentStyle: { backgroundColor: '#f5f7f8' },
      }}
    >
      <Stack.Screen
        name="EventsList"
        component={EventsListScreen}
        options={{ 
          title: 'Trotter', 
          headerLargeTitle: false, // Disable to prevent content overlap
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'New event' }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event' }}
      />
      <Stack.Screen
        name="ParticipantsList"
        component={ParticipantsListScreen}
        options={{ title: 'Participants' }}
      />
      <Stack.Screen
        name="AddEditParticipant"
        component={AddEditParticipantScreen}
        options={({ route }) => ({
          title: route.params.participantId ? 'Edit participant' : 'Add participant',
        })}
      />
    </Stack.Navigator>
  );
}

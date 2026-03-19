import React from 'react';
import { Text, View } from 'react-native';
import { FinishersScreen } from '../screens/FinishersScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParticipantsListScreen } from '../screens/ParticipantsListScreen';
import { AddEditParticipantScreen } from '../screens/AddEditParticipantScreen';
import type { RootStackParamList } from './types';

const Tab = createBottomTabNavigator();
const RegistrationStack = createNativeStackNavigator<RootStackParamList>();

type EventTabsProps = {
  eventId: string;
};

// Registration stack (nested in tab)
function RegistrationStackScreen({ eventId }: { eventId: string }) {
  return (
    <RegistrationStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#111',
        headerShadowVisible: false,
      }}
    >
      <RegistrationStack.Screen
        name="ParticipantsList"
        component={ParticipantsListScreen}
        initialParams={{ eventId }}
        options={{ title: 'Participants' }}
      />
      <RegistrationStack.Screen
        name="AddEditParticipant"
        component={AddEditParticipantScreen}
        options={({ route }) => {
          const params = route.params as { eventId: string; participantId?: string };
          return {
            title: params.participantId ? 'Edit participant' : 'Add participant',
          };
        }}
      />
    </RegistrationStack.Navigator>
  );
}

export function EventTabs({ eventId }: EventTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0d6b8a',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e4e8',
        },
      }}
    >
      <Tab.Screen
        name="Registration"
        options={{
          tabBarLabel: 'Registration',
          tabBarIcon: ({ color }) => (
            <TabIcon name="person" color={color} />
          ),
        }}
      >
        {() => <RegistrationStackScreen eventId={eventId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Finishers"
        options={{
          tabBarLabel: 'Finishers',
          tabBarIcon: ({ color }) => (
            <TabIcon name="timer" color={color} />
          ),
        }}
      >
        {() => <FinishersScreen eventId={eventId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Results"
        options={{
          tabBarLabel: 'Results',
          tabBarIcon: ({ color }) => (
            <TabIcon name="trophy" color={color} />
          ),
        }}
      >
        {() => <ResultsScreen eventId={eventId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Simple placeholder components
function FinishersPlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
        Finishers & Timing coming in Milestone 3
      </Text>
    </View>
  );
}

function ResultsPlaceholder() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
        Results coming in Milestone 4
      </Text>
    </View>
  );
}

// Simple icon component (we'll use text for now, can add react-native-vector-icons later)
function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    person: '👤',
    timer: '⏱️',
    trophy: '🏆',
  };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '•'}</Text>;
}

export type RootStackParamList = {
  EventsList: undefined;
  CreateEvent: undefined;
  EventDetail: { eventId: string };
  ParticipantsList: { eventId: string };
  AddEditParticipant: { eventId: string; participantId?: string };
};

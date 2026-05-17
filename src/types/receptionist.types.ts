export interface QueueAction {
  patientId: string;
  action: 'next' | 'absent' | 'complete';
}

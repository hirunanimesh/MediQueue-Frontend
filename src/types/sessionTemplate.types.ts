export interface CreateSessionTemplateDTO {
  medicalCenterId: number;
  dayOfWeek: string;
  startTime: string; // Format: "HH:mm:ss"
  endTime: string; // Format: "HH:mm:ss"
  maxPatients: number;
  active: boolean;
}

export interface SessionTemplateResponse {
  id: number;
  medicalCenterId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  active: boolean;
}

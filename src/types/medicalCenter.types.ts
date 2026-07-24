export interface MedicalCenterDTO {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opensAt: string; // Format: "HH:mm:ss"
  closesAt: string; // Format: "HH:mm:ss"
}

export interface MedicalCenterResponse {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  opensAt?: string;
  closesAt?: string;
}

export interface DoctorOwnedMedicalCentersResponse {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  opensAt?: string;
  closesAt?: string;
}

export interface StandardResponse<T> {
  code: number;
  message: string;
  data: T;
}

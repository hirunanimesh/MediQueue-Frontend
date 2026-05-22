import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  LoginPayload,
  RegisterDoctorPayload,
  RegisterPatientPayload,
  RegisterReceptionistPayload,
} from '@/types/auth.types';

export interface AuthResponse {
  message: string;
  token?: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: string;
}

export const registerPatient = async (
  payload: RegisterPatientPayload,
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER_PATIENT,
    payload,
  );
  return data;
};

export const registerDoctor = async (
  payload: RegisterDoctorPayload,
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER_DOCTOR,
    payload,
  );
  return data;
};

export const registerReceptionist = async (
  payload: RegisterReceptionistPayload,
): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER_RECEPTIONIST,
    payload,
  );
  return data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload,
  );
  return data;
};

import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  DoctorOwnedMedicalCentersResponse,
  MedicalCenterDTO,
  MedicalCenterResponse,
  StandardResponse,
} from '@/types/medicalCenter.types';

export const createMedicalCenter = async (
  payload: MedicalCenterDTO,
): Promise<StandardResponse<MedicalCenterResponse>> => {
  const { data } = await axiosInstance.post<StandardResponse<MedicalCenterResponse>>(
    API_ENDPOINTS.MEDICAL_CENTER.CREATE,
    payload,
  );
  return data;
};

export const getOwnedMedicalCenters = async (): Promise<
  StandardResponse<DoctorOwnedMedicalCentersResponse[]> | DoctorOwnedMedicalCentersResponse[]
> => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.MEDICAL_CENTER.OWNED);
  return data;
};

export const getAssignedMedicalCenters = async (): Promise<
  StandardResponse<DoctorOwnedMedicalCentersResponse[]> | DoctorOwnedMedicalCentersResponse[]
> => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.MEDICAL_CENTER.ASSIGNED);
  return data;
};

export const updateMedicalCenter = async (
  id: number | string,
  payload: MedicalCenterDTO,
): Promise<StandardResponse<MedicalCenterResponse>> => {
  const { data } = await axiosInstance.patch<StandardResponse<MedicalCenterResponse>>(
    API_ENDPOINTS.MEDICAL_CENTER.UPDATE(id),
    payload,
  );
  return data;
};


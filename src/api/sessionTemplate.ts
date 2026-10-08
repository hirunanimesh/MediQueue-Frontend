import { axiosInstance } from '@/api/axiosInstance';
import { API_ENDPOINTS } from '@/constants/api';
import type { StandardResponse } from '@/types/medicalCenter.types';
import type {
  CreateSessionTemplateDTO,
  SessionTemplateResponse,
} from '@/types/sessionTemplate.types';

export const createSessionTemplate = async (
  payload: CreateSessionTemplateDTO,
): Promise<StandardResponse<SessionTemplateResponse>> => {
  const { data } = await axiosInstance.post<StandardResponse<SessionTemplateResponse>>(
    API_ENDPOINTS.SESSION_TEMPLATE.CREATE,
    payload,
  );
  return data;
};

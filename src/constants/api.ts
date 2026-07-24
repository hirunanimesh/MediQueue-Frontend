

export const API_BASE_URL = 'http://10.185.201.42:8083';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER_PATIENT: '/api/v1/auth/register/patient',
    REGISTER_DOCTOR: '/api/v1/auth/register/doctor',
    REGISTER_RECEPTIONIST: '/api/v1/auth/register/recep',
  },
  MEDICAL_CENTER: {
    CREATE: '/api/v1/medical-center/create',
    UPDATE: (id: number | string) => `/api/v1/medical-center/update/${id}`,
    OWNED: '/api/v1/medical-center/owned-medical-centers',
    ASSIGNED: '/api/v1/medical-center/assigned-medical-centers',
  },
} as const;


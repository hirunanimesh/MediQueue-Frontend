

export const API_BASE_URL = 'http://10.161.8.41:8083';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER_PATIENT: '/api/v1/auth/register/patient',
    REGISTER_DOCTOR: '/api/v1/auth/register/doctor',
    REGISTER_RECEPTIONIST: '/api/v1/auth/register/recep',
  },
} as const;

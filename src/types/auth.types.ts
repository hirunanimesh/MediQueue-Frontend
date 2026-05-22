// Register base (shared across all roles)
export interface RegisterBase {
  username: string;
  password: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST';
}

// Patient Registration — POST /api/v1/auth/register/patient
export interface RegisterPatientPayload {
  register: RegisterBase;
  first_Name: string;
  last_name: string;
  phone_number: string;
  address: string;
}

// Doctor Registration — POST /api/v1/auth/register/doctor
export interface RegisterDoctorPayload {
  register: RegisterBase;
  firstName: string;
  lastName: string;
  specialized_area: string;
  hospital: string;
  experience_years: number;
  phone_number: string;
}

// Receptionist Registration — POST /api/v1/auth/register/recep (Doctor protected)
export interface RegisterReceptionistPayload {
  register: RegisterBase;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// Login — POST /api/v1/auth/login
export interface LoginPayload {
  email: string;
  password: string;
}

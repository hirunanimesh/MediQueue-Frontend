import { z } from 'zod';

const email = z.string().email('Invalid email format');
const password = z.string().min(8, 'Password must be at least 8 characters');
const required = z.string().min(1, 'This field is required');

export const patientRegistrationSchema = z.object({
  username: required,
  email,
  password,
  firstName: required,
  lastName: required,
  phoneNumber: required,
  address: required,
});

export const doctorRegistrationSchema = z.object({
  username: required,
  email,
  password,
  firstName: required,
  lastName: required,
  specializedArea: required,
  hospital: required,
  experienceYears: z
    .string()
    .min(1, 'This field is required')
    .regex(/^\d+$/, 'Years of experience must be numeric'),
  phoneNumber: required,
});

export const receptionistRegistrationSchema = z.object({
  username: required,
  email,
  password,
  firstName: required,
  lastName: required,
  phoneNumber: required,
});

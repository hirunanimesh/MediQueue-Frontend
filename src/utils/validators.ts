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
  profilePictureUrl: z.string().url('Please upload a valid profile picture'),
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
  profilePictureUrl: z.string().url('Please upload a valid profile picture'),
});

export const receptionistRegistrationSchema = z.object({
  username: required,
  email,
  password,
  firstName: required,
  lastName: required,
  phoneNumber: required,
});

export const medicalCenterSchema = z.object({
  name: z.string().min(1, 'Medical Center Name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z
    .string()
    .min(1, 'Latitude is required')
    .refine((val) => !isNaN(Number(val)), 'Latitude must be a valid number'),
  longitude: z
    .string()
    .min(1, 'Longitude is required')
    .refine((val) => !isNaN(Number(val)), 'Longitude must be a valid number'),
  opensAt: z
    .string()
    .min(1, 'Opening time is required')
    .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Format must be HH:mm or HH:mm:ss (e.g. 08:00:00)'),
  closesAt: z
    .string()
    .min(1, 'Closing time is required')
    .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Format must be HH:mm or HH:mm:ss (e.g. 17:00:00)'),
});


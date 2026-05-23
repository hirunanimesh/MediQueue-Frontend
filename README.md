# Smart Doctor Channeling & Queue Management System

A production-ready React Native (Expo) mobile foundation for doctor channeling and real-time queue management with role-based workflows for **Patient**, **Doctor**, and **Receptionist** users.

## Tech Stack

- React Native
- Expo
- Expo Router
- Axios
- Zod
- Redux Toolkit
- expo-secure-store
- react-hook-form
- expo-image-picker

## Folder Structure

| Folder | Purpose |
|---|---|
| `api/` | All HTTP calls, grouped by domain. axiosInstance handles auth headers and error interception. |
| `app/` | Expo Router file-based screens, grouped by role using route groups `(auth)`, `(doctor)`, `(patient)`, `(receptionist)` |
| `components/` | Reusable UI components. `common/` for shared atoms; role-specific subfolders for domain components. |
| `constants/` | App-wide constants: colors, typography, API endpoints, role enums |
| `context/` | React Context providers for global state (auth session, queue state) |
| `hooks/` | Custom hooks that encapsulate logic (form state, auth access, queue polling) |
| `navigation/` | Role-based routing logic after authentication |
| `services/` | Side-effect services: secure token storage, push notifications |
| `store/` | Redux Toolkit store and slices (alternative: Zustand stores) |
| `types/` | TypeScript interfaces and types for API payloads, domain models |
| `utils/` | Pure utility functions: validators, formatters, error parsers |
| `assets/` | Static assets: images, icons, custom fonts |

## Getting Started

```bash
npm install
npm run start
```

## Cloudinary Setup

Create a local `.env` file at the project root and add:

```bash
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

The app reads these values through Expo public env vars, so they are available in the frontend bundle. Keep the `.env` file out of version control; `.env.example` is provided as a template.

To configure the unsigned upload preset in Cloudinary:

1. Open the Cloudinary console and go to Settings > Upload.
2. Create a new upload preset.
3. Set the preset to unsigned.
4. Restrict allowed formats and size limits as needed for your app.
5. Copy the preset name into `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

The `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` value is your Cloudinary cloud name from the dashboard home page.

The reusable upload flow lives in `src/config/cloudinary.ts`, `src/services/cloudinaryService.ts`, and `src/components/common/ImageUploadField.tsx`, so other screens can upload images with the same direct-to-Cloudinary path.

Optional platform targets:

```bash
npm run android
npm run ios
npm run web
```

## API Endpoints

| Endpoint | Method | Access |
|---|---|---|
| `/api/v1/auth/register/patient` | POST | Public |
| `/api/v1/auth/register/doctor` | POST | Public |
| `/api/v1/auth/register/recep` | POST | Doctor-protected |
| `/api/v1/auth/login` | POST | Public |

## Role Access Matrix

| Screen | Patient | Doctor | Receptionist |
|---|---|---|---|
| Register Patient | ✅ Public | ✅ Public | ✅ Public |
| Register Doctor | ✅ Public | ✅ Public | ✅ Public |
| Register Receptionist | ❌ | ✅ Doctor only | ❌ |
| Patient Dashboard | ✅ | ❌ | ❌ |
| Doctor Dashboard | ❌ | ✅ | ❌ |
| Receptionist Dashboard | ❌ | ❌ | ✅ |

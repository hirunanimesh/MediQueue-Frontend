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

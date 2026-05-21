import { Redirect } from 'expo-router';

import { Role } from '@/constants/roles';

export const roleDashboardRoute = (role: Role | null): '/(patient)/dashboard' | '/(doctor)/dashboard' | '/(receptionist)/dashboard' | '/(admin)/dashboard' | '/(auth)/login' => {
  switch (role) {
    case Role.PATIENT:
      return '/(patient)/dashboard';
    case Role.DOCTOR:
      return '/(doctor)/dashboard';
    case Role.RECEPTIONIST:
      return '/(receptionist)/dashboard';
    case Role.ADMIN:
      return '/(admin)/dashboard';
    default:
      return '/(auth)/login';
  }
};

export const RoleRouter = ({ role }: { role: Role | null }) => <Redirect href={roleDashboardRoute(role)} />; 

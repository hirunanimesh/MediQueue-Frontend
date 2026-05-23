import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { roleDashboardRoute } from '@/navigation/RoleRouter';

const PatientDashboard = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(roleDashboardRoute(null));
    } catch {
      // ignore errors on logout
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-xl font-semibold mb-6">Patient Dashboard</Text>

      <Pressable onPress={handleLogout} className="rounded-md bg-red-600 px-4 py-2">
        <Text className="font-semibold text-white">Logout</Text>
      </Pressable>
    </View>
  );
};

export default PatientDashboard;

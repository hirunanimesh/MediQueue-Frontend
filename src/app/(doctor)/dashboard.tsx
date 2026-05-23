import { Pressable, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { roleDashboardRoute } from '@/navigation/RoleRouter'

const DoctorDashboard = () => {
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
      <Text className="text-xl font-semibold mb-6">Doctor Dashboard</Text>

      <Pressable onPress={handleLogout} className="bg-red-600 px-4 py-2 rounded-md">
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
};

export default DoctorDashboard;

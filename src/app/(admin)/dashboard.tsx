import { StyleSheet, Text, View } from 'react-native';
import DoctorDashboard from '../(doctor)/dashboard';

const AdminDashboard = () => (
  <View style={styles.container}>
    <Text>Admin Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default AdminDashboard;

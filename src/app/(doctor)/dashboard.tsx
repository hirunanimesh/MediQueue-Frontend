import { StyleSheet, Text, View } from 'react-native';

const DoctorDashboard = () => (
  <View style={styles.container}>
    <Text>Doctor Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default DoctorDashboard;

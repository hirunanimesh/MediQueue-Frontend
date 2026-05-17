import { StyleSheet, Text, View } from 'react-native';

const PatientDashboard = () => (
  <View style={styles.container}>
    <Text>Patient Dashboard</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default PatientDashboard;

import { StyleSheet, Text, View } from 'react-native';

const QueueStatus = () => (
  <View style={styles.container}>
    <Text>Queue Status</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default QueueStatus;

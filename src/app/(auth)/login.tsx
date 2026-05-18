import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';

const LoginScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    <Link href="/(auth)/register-patient" style={styles.link}>Register as Patient</Link>
    <Link href="/(auth)/register-doctor" style={styles.link}>Register as Doctor</Link>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  link: {
    color: colors.primary,
  },
});

export default LoginScreen;

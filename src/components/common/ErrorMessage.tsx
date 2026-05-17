import { StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return <Text style={styles.error}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontSize: 13,
  },
});

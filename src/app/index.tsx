import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { RoleRouter } from '@/navigation/RoleRouter';
import { useAuth } from '@/hooks/useAuth';

const IndexScreen = () => {
  const { isHydrating, role } = useAuth();

  if (isHydrating) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return <RoleRouter role={role} />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IndexScreen;

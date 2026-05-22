import '../global.css';

import { Stack } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';

import { AuthProvider } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { store } from '@/store/store';

const RootLayout = () => (
  <ReduxProvider store={store}>
    <AuthProvider>
      <QueueProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </QueueProvider>
    </AuthProvider>
  </ReduxProvider>
);

export default RootLayout;

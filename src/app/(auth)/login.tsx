import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { login as loginRequest } from '@/api/auth';
import { Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { roleDashboardRoute } from '@/navigation/RoleRouter';

const decodeBase64Url = (value: string) => {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    '=',
  );

  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(paddedValue);
  }

  return Buffer.from(paddedValue, 'base64').toString('utf8');
};

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      const token = response.data;
      const payloadSegment = token.split('.')[1];
      const decodedPayload = JSON.parse(decodeBase64Url(payloadSegment)) as {
        role?: string;
        userName?: string;
        sub?: string;
      };

      const roleMap: Record<string, Role> = {
        ROLE_PATIENT: Role.PATIENT,
        ROLE_DOCTOR: Role.DOCTOR,
        ROLE_RECEPTIONIST: Role.RECEPTIONIST,
        ROLE_ADMIN: Role.ADMIN,
      };

      const role = decodedPayload.role ? roleMap[decodedPayload.role] : undefined;
      const username = decodedPayload.userName ?? decodedPayload.sub ?? email.trim();

      if (!role) {
        throw new Error('Login succeeded, but the token role was not recognized.');
      }

      await login({
        token,
        user: {
          username,
          role,
        },
      });

      router.replace(roleDashboardRoute(role));
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to log in.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterPatient = () => {
    router.push('/(auth)/register-patient');
  };

  const handleRegisterDoctor = () => {
    router.push('/(auth)/register-doctor');
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-5">
      <View className="w-full max-w-sm rounded-3xl bg-white px-6 py-8 shadow-lg shadow-slate-200/60">
        <Text className="text-center text-3xl font-bold text-slate-900">Login</Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          Enter your email and password to continue.
        </Text>

        <View className="mt-8 gap-4">
          <View className="gap-2">
            <Text className="text-sm font-medium text-slate-700">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="doctor1@gmail.com"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-slate-700">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              placeholder="••••••••"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
            />
          </View>

          {!!errorMessage && <Text className="text-sm text-red-600">{errorMessage}</Text>}

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            className={`items-center rounded-2xl bg-blue-600 px-4 py-4 ${isSubmitting ? 'opacity-60' : ''}`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-base font-semibold text-white">Login</Text>
            )}
          </Pressable>

          <View className="mt-2 gap-3">
            <Text className="text-center text-sm text-slate-500">Need an account?</Text>

            <Pressable
              onPress={handleRegisterPatient}
              className="items-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3"
            >
              <Text className="text-base font-semibold text-blue-700">Register as Patient</Text>
            </Pressable>

            <Pressable
              onPress={handleRegisterDoctor}
              className="items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <Text className="text-base font-semibold text-slate-700">Register as Doctor</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

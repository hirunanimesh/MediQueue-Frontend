import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { registerReceptionist } from '@/api/auth';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { roleDashboardRoute } from '@/navigation/RoleRouter';
import { receptionistRegistrationSchema } from '@/utils/validators';

type ReceptionistRegistrationForm = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const RegisterReceptionistScreen = () => {
  const router = useRouter();
  const { role, isHydrating } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReceptionistRegistrationForm>({
    resolver: zodResolver(receptionistRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (!isHydrating && role !== Role.DOCTOR) {
      router.replace(roleDashboardRoute(role));
    }
  }, [isHydrating, role, router]);

  const onSubmit = async (values: ReceptionistRegistrationForm) => {
    try {
      await registerReceptionist({
        register: {
          username: values.username,
          email: values.email,
          password: values.password,
          role: Role.RECEPTIONIST,
        },
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      });

      Alert.alert('Success', 'Receptionist account created.', [
        { text: 'OK', onPress: () => router.replace('/(doctor)/dashboard') },
      ]);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while registering the receptionist.';
      Alert.alert('Registration Failed', errorMsg);
    }
  };

  if (isHydrating || role !== Role.DOCTOR) {
    return null;
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="px-5 py-10"
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <View className="gap-4">
          <Text className="text-2xl font-bold text-slate-900">
            Register Receptionist
          </Text>
          <Text className="text-sm text-slate-500">
            Create a receptionist account to help manage your medical centers.
          </Text>
        </View>

        <View className="mt-6 gap-3">
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Input
                label="Username"
                placeholder="e.g. receptionist01"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.username?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="e.g. recep@example.com"
                value={field.value}
                keyboardType="email-address"
                onChangeText={field.onChange}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="Password"
                placeholder="Enter a secure password"
                value={field.value}
                secureTextEntry
                onChangeText={field.onChange}
                error={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Input
                label="First Name"
                placeholder="e.g. John"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.firstName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Input
                label="Last Name"
                placeholder="e.g. Doe"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.lastName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <Input
                label="Phone Number"
                placeholder="e.g. 0771234567"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.phoneNumber?.message}
              />
            )}
          />

          <View className="mt-3 gap-3">
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={`w-full items-center rounded-2xl bg-blue-600 px-4 py-4 ${
                isSubmitting ? 'opacity-60' : ''
              }`}
            >
              <Text className="text-base font-semibold text-white">
                {isSubmitting ? 'Submitting...' : 'Register Receptionist'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              className="items-center rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <Text className="text-base font-semibold text-slate-700">
                Back to Dashboard
              </Text>
            </Pressable>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

export default RegisterReceptionistScreen;

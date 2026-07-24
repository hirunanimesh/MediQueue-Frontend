import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { registerReceptionist } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { roleDashboardRoute } from '@/navigation/RoleRouter';
import { receptionistRegistrationSchema } from '@/utils/validators';
import { colors } from '@/constants/colors';

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
  };

  if (isHydrating || role !== Role.DOCTOR) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>Register Receptionist</Text>
        <View style={styles.form}>
          <Controller control={control} name="username" render={({ field }) => <Input label="Username" value={field.value} onChangeText={field.onChange} error={errors.username?.message} />} />
          <Controller control={control} name="email" render={({ field }) => <Input label="Email" value={field.value} keyboardType="email-address" onChangeText={field.onChange} error={errors.email?.message} />} />
          <Controller control={control} name="password" render={({ field }) => <Input label="Password" value={field.value} secureTextEntry onChangeText={field.onChange} error={errors.password?.message} />} />
          <Controller control={control} name="firstName" render={({ field }) => <Input label="First Name" value={field.value} onChangeText={field.onChange} error={errors.firstName?.message} />} />
          <Controller control={control} name="lastName" render={({ field }) => <Input label="Last Name" value={field.value} onChangeText={field.onChange} error={errors.lastName?.message} />} />
          <Controller control={control} name="phoneNumber" render={({ field }) => <Input label="Phone Number" value={field.value} onChangeText={field.onChange} error={errors.phoneNumber?.message} />} />
          <Button title={isSubmitting ? 'Submitting...' : 'Register Receptionist'} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  form: {
    gap: 12,
  },
});

export default RegisterReceptionistScreen;

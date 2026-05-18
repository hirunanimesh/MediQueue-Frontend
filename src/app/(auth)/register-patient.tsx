import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { registerPatient } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Input } from '@/components/common/Input';
import { colors } from '@/constants/colors';
import { Role } from '@/constants/roles';
import { patientRegistrationSchema } from '@/utils/validators';

type PatientRegistrationForm = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

const RegisterPatientScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientRegistrationForm>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
    },
  });

  const onSubmit = async (values: PatientRegistrationForm) => {
    await registerPatient({
      register: {
        username: values.username,
        email: values.email,
        password: values.password,
        role: Role.PATIENT,
      },
      first_Name: values.firstName,
      last_name: values.lastName,
      phone_number: values.phoneNumber,
      address: values.address,
    });

    Alert.alert('Success', 'Patient account created successfully.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>Patient Registration</Text>
        <View style={styles.form}>
          <Controller control={control} name="username" render={({ field }) => <Input label="Username" value={field.value} onChangeText={field.onChange} error={errors.username?.message} />} />
          <Controller control={control} name="email" render={({ field }) => <Input label="Email" value={field.value} keyboardType="email-address" onChangeText={field.onChange} error={errors.email?.message} />} />
          <Controller control={control} name="password" render={({ field }) => <Input label="Password" value={field.value} secureTextEntry onChangeText={field.onChange} error={errors.password?.message} />} />
          <Controller control={control} name="firstName" render={({ field }) => <Input label="First Name" value={field.value} onChangeText={field.onChange} error={errors.firstName?.message} />} />
          <Controller control={control} name="lastName" render={({ field }) => <Input label="Last Name" value={field.value} onChangeText={field.onChange} error={errors.lastName?.message} />} />
          <Controller control={control} name="phoneNumber" render={({ field }) => <Input label="Phone Number" value={field.value} onChangeText={field.onChange} error={errors.phoneNumber?.message} />} />
          <Controller control={control} name="address" render={({ field }) => <Input label="Address" value={field.value} onChangeText={field.onChange} error={errors.address?.message} />} />
          <ErrorMessage message={errors.root?.message} />
          <Button title={isSubmitting ? 'Submitting...' : 'Register'} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
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

export default RegisterPatientScreen;

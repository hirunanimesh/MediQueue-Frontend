import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { registerDoctor } from '@/api/auth';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { colors } from '@/constants/colors';
import { Role } from '@/constants/roles';
import { doctorRegistrationSchema } from '@/utils/validators';

type DoctorRegistrationForm = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specializedArea: string;
  hospital: string;
  experienceYears: string;
  phoneNumber: string;
};

const RegisterDoctorScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DoctorRegistrationForm>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      specializedArea: '',
      hospital: '',
      experienceYears: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (values: DoctorRegistrationForm) => {
    await registerDoctor({
      register: {
        username: values.username,
        email: values.email,
        password: values.password,
        role: Role.DOCTOR,
      },
      firstName: values.firstName,
      lastName: values.lastName,
      specialized_area: values.specializedArea,
      hospital: values.hospital,
      experience_years: Number(values.experienceYears),
      phone_number: values.phoneNumber,
    });

    Alert.alert('Success', 'Doctor account created successfully.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/login') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.title}>Doctor Registration</Text>
        <View style={styles.form}>
          <Controller control={control} name="username" render={({ field }) => <Input label="Username" value={field.value} onChangeText={field.onChange} error={errors.username?.message} />} />
          <Controller control={control} name="email" render={({ field }) => <Input label="Email" value={field.value} keyboardType="email-address" onChangeText={field.onChange} error={errors.email?.message} />} />
          <Controller control={control} name="password" render={({ field }) => <Input label="Password" value={field.value} secureTextEntry onChangeText={field.onChange} error={errors.password?.message} />} />
          <Controller control={control} name="firstName" render={({ field }) => <Input label="First Name" value={field.value} onChangeText={field.onChange} error={errors.firstName?.message} />} />
          <Controller control={control} name="lastName" render={({ field }) => <Input label="Last Name" value={field.value} onChangeText={field.onChange} error={errors.lastName?.message} />} />
          <Controller control={control} name="specializedArea" render={({ field }) => <Input label="Specialized Area" value={field.value} onChangeText={field.onChange} error={errors.specializedArea?.message} />} />
          <Controller control={control} name="hospital" render={({ field }) => <Input label="Hospital" value={field.value} onChangeText={field.onChange} error={errors.hospital?.message} />} />
          <Controller control={control} name="experienceYears" render={({ field }) => <Input label="Years of Experience" value={field.value} keyboardType="numeric" onChangeText={field.onChange} error={errors.experienceYears?.message} />} />
          <Controller control={control} name="phoneNumber" render={({ field }) => <Input label="Phone Number" value={field.value} onChangeText={field.onChange} error={errors.phoneNumber?.message} />} />
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

export default RegisterDoctorScreen;

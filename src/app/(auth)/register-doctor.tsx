import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { registerDoctor } from '@/api/auth';
import { Card } from '@/components/common/Card';
import { ImageUploadField } from '@/components/common/ImageUploadField';
import { Input } from '@/components/common/Input';
import { Role } from '@/constants/roles';
import { parseApiError } from '@/utils/errorHandler';
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
  profilePictureUrl: string;
};

const RegisterDoctorScreen = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isProfilePictureUploading, setIsProfilePictureUploading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
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
      profilePictureUrl: '',
    },
  });

  const onSubmit = async (values: DoctorRegistrationForm) => {
    try {
      setSubmitError(null);

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
        profile_picture_url: values.profilePictureUrl,
      });

      Alert.alert('Success', 'Doctor account created successfully.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (error) {
      const message = parseApiError(error);
      setSubmitError(message);
      Alert.alert('Registration failed', message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="flex-grow justify-center px-5 py-6">
      <Card>
        <View className="gap-4">
          <Text className="text-2xl font-bold text-slate-900">Doctor Registration</Text>
          <Text className="text-sm text-slate-500">Create your doctor account to access the dashboard.</Text>
        </View>

        <View className="mt-6 gap-3">
          <Controller control={control} name="username" render={({ field }) => <Input label="Username" value={field.value} onChangeText={field.onChange} error={errors.username?.message} />} />
          <Controller control={control} name="email" render={({ field }) => <Input label="Email" value={field.value} keyboardType="email-address" onChangeText={field.onChange} error={errors.email?.message} />} />
          <Controller control={control} name="password" render={({ field }) => <Input label="Password" value={field.value} secureTextEntry onChangeText={field.onChange} error={errors.password?.message} />} />
          <Controller control={control} name="firstName" render={({ field }) => <Input label="First Name" value={field.value} onChangeText={field.onChange} error={errors.firstName?.message} />} />
          <Controller control={control} name="lastName" render={({ field }) => <Input label="Last Name" value={field.value} onChangeText={field.onChange} error={errors.lastName?.message} />} />
          <Controller control={control} name="specializedArea" render={({ field }) => <Input label="Specialized Area" value={field.value} onChangeText={field.onChange} error={errors.specializedArea?.message} />} />
          <Controller control={control} name="hospital" render={({ field }) => <Input label="Hospital" value={field.value} onChangeText={field.onChange} error={errors.hospital?.message} />} />
          <Controller control={control} name="experienceYears" render={({ field }) => <Input label="Years of Experience" value={field.value} keyboardType="numeric" onChangeText={field.onChange} error={errors.experienceYears?.message} />} />
          <Controller control={control} name="phoneNumber" render={({ field }) => <Input label="Phone Number" value={field.value} onChangeText={field.onChange} error={errors.phoneNumber?.message} />} />
          <Controller
            control={control}
            name="profilePictureUrl"
            render={({ field }) => (
              <ImageUploadField
                label="Profile Picture"
                value={field.value}
                error={errors.profilePictureUrl?.message}
                helperText="Upload a clear profile photo. It will be sent directly to Cloudinary."
                isUploading={isProfilePictureUploading}
                onUploadingChange={setIsProfilePictureUploading}
                onChange={(uploadedUrl) => {
                  field.onChange(uploadedUrl);
                  setValue('profilePictureUrl', uploadedUrl, { shouldValidate: true, shouldDirty: true });
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {!!submitError && <Text className="text-sm text-red-600">{submitError}</Text>}
          <View className="mt-2 gap-3">
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || isProfilePictureUploading}
              className={`w-full items-center rounded-2xl bg-blue-600 px-4 py-4 ${(isSubmitting || isProfilePictureUploading) ? 'opacity-60' : ''}`}
            >
              <Text className="text-base font-semibold text-white">
                {isSubmitting ? 'Submitting...' : isProfilePictureUploading ? 'Uploading Picture...' : 'Complete Registration'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace('/(auth)/login')}
              className="items-center rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
              <Text className="text-base font-semibold text-slate-700">Back to Login</Text>
            </Pressable>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

export default RegisterDoctorScreen;

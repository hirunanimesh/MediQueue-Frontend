import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { uploadImageToCloudinary } from '@/services/cloudinaryService';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  isUploading?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
  uploadFolder?: string;
}

export const ImageUploadField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  isUploading = false,
  onUploadingChange,
  uploadFolder,
}: ImageUploadFieldProps) => {
  const [localPreviewUri, setLocalPreviewUri] = useState<string | null>(value || null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalPreviewUri(value || null);
  }, [value]);

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const pickImage = async () => {
    try {
      setLocalError(null);

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        setLocalError('Permission to access your photos is required to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const selectedAsset = result.assets[0];

      if (!selectedAsset.uri) {
        setLocalError('Unable to read the selected image.');
        return;
      }

      setLocalPreviewUri(selectedAsset.uri);
      onUploadingChange?.(true);

      const secureUrl = await uploadImageToCloudinary(selectedAsset.uri, uploadFolder ? { folder: uploadFolder } : undefined);
      onChange(secureUrl);
      setLocalPreviewUri(secureUrl);
      onBlur?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Image upload failed. Please try again.';
      setLocalError(message);
      setLocalPreviewUri(value || null);
      onChange('');
      console.error('Image picker/upload failed:', error);
      Alert.alert('Upload failed', message);
    } finally {
      onUploadingChange?.(false);
    }
  };

  const previewUri = value || localPreviewUri;
  const displayedError = localError ?? error;

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-slate-900">{label}</Text>

      <View className="flex-row items-start gap-3">
        <View className="h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[18px] border border-slate-300 bg-slate-50">
          {previewUri ? (
            <Image source={{ uri: previewUri }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <Text className="px-2 text-center text-xs text-slate-500">No photo selected</Text>
          )}
        </View>

        <View className="flex-1 gap-2">
          <Pressable
            onPress={pickImage}
            disabled={isUploading}
            accessibilityRole="button"
            accessibilityLabel="Upload profile picture"
            className={`min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 ${isUploading ? 'opacity-60' : ''}`}
            style={({ pressed }) => [pressed ? { opacity: 0.9 } : null]}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View className="flex-row items-center gap-2">
                <View className="h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Text className="text-xs font-bold leading-none text-white">↑</Text>
                </View>
                <Text className="text-sm font-semibold text-white">Upload Photo</Text>
              </View>
            )}
          </Pressable>

          <Text className="text-xs leading-4 text-slate-500">
            {helperText ?? 'Select an image to upload directly to Cloudinary.'}
          </Text>
        </View>
      </View>

      {!!displayedError && <Text className="text-xs text-red-600">{displayedError}</Text>}
    </View>
  );
};

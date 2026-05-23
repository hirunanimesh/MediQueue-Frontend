const requiredEnv = (key: string, description: string): string => {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`${description} is missing. Add ${key} to your Expo env file.`);
  }

  return value;
};

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  uploadUrl: string;
}

export const getCloudinaryConfig = (): CloudinaryConfig => {
  const cloudName = requiredEnv('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name');
  const uploadPreset = requiredEnv('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET', 'Cloudinary upload preset');

  return {
    cloudName,
    uploadPreset,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  };
};
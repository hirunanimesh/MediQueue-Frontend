import { getCloudinaryConfig } from '@/config/cloudinary';

export interface CloudinaryUploadResponse {
  secure_url?: string;
  public_id?: string;
  asset_id?: string;
  error?: {
    message?: string;
  };
}

interface UploadImageOptions {
  folder?: string;
}

const getFileExtension = (uri: string): string => {
  const cleanUri = uri.split('?')[0];
  const extension = cleanUri.slice(cleanUri.lastIndexOf('.') + 1).toLowerCase();

  return extension || 'jpg';
};

const getMimeType = (uri: string): string => {
  const extension = getFileExtension(uri);

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'heic':
      return 'image/heic';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
};

const getFileName = (uri: string): string => `upload-${Date.now()}.${getFileExtension(uri)}`;

export const uploadImageToCloudinary = async (
  imageUri: string,
  options: UploadImageOptions = {},
): Promise<string> => {
  const { uploadPreset, uploadUrl } = getCloudinaryConfig();
  const formData = new FormData();

  formData.append(
    'file',
    {
      uri: imageUri,
      type: getMimeType(imageUri),
      name: getFileName(imageUri),
    } as never,
  );
  formData.append('upload_preset', uploadPreset);

  if (options.folder) {
    formData.append('folder', options.folder);
  }

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const result = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok) {
    throw new Error(result.error?.message ?? 'Cloudinary image upload failed.');
  }

  if (!result.secure_url) {
    throw new Error('Cloudinary did not return a secure URL.');
  }

  console.log('Cloudinary secure_url:', result.secure_url);

  return result.secure_url;
};
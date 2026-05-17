export const formatPhoneNumber = (phone: string): string => phone.replace(/\s+/g, '');

export const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString();

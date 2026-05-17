export const parseApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    const maybeMessage = (error as { message?: string }).message;
    if (maybeMessage) {
      return maybeMessage;
    }
  }

  return 'Something went wrong. Please try again.';
};

import { useState } from 'react';

export const useForm = <T extends Record<string, string>>(initialValues: T) => {
  const [values, setValues] = useState(initialValues);

  const updateValue = (key: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return { values, updateValue, setValues };
};

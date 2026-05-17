import { createContext, type PropsWithChildren, useMemo, useState } from 'react';

interface QueueContextValue {
  currentNumber: number;
  setCurrentNumber: (value: number) => void;
}

export const QueueContext = createContext<QueueContextValue | undefined>(undefined);

export const QueueProvider = ({ children }: PropsWithChildren) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  const value = useMemo(
    () => ({
      currentNumber,
      setCurrentNumber,
    }),
    [currentNumber],
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

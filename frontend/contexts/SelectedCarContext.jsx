"use client";

import { createContext, useContext, useState } from 'react';

const SelectedCarContext = createContext();

export function SelectedCarProvider({ children }) {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <SelectedCarContext.Provider value={{ selectedCar, setSelectedCar }}>
      {children}
    </SelectedCarContext.Provider>
  );
}

export function useSelectedCar() {
  const context = useContext(SelectedCarContext);
  if (!context) {
    throw new Error('useSelectedCar must be used within a SelectedCarProvider');
  }
  return context;
} 
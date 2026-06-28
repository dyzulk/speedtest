import React, { createContext, useContext, useState, useEffect } from 'react';

export type UnitType = 'Kbps' | 'Mbps' | 'KBps' | 'MBps';
export type ScaleType = 100 | 500 | 1000;

interface SettingsState {
  unit: UnitType;
  scale: ScaleType;
}

interface SettingsContextType extends SettingsState {
  setUnit: (unit: UnitType) => void;
  setScale: (scale: ScaleType) => void;
}

const defaultState: SettingsState = {
  unit: 'Mbps',
  scale: 100,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnitState] = useState<UnitType>(defaultState.unit);
  const [scale, setScaleState] = useState<ScaleType>(defaultState.scale);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('speedtest-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (['Kbps', 'Mbps', 'KBps', 'MBps'].includes(parsed.unit)) setUnitState(parsed.unit);
        if ([100, 500, 1000].includes(parsed.scale)) setScaleState(parsed.scale);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('speedtest-settings', JSON.stringify({ unit, scale }));
  }, [unit, scale]);

  const setUnit = (newUnit: UnitType) => setUnitState(newUnit);
  const setScale = (newScale: ScaleType) => setScaleState(newScale);

  return (
    <SettingsContext.Provider value={{ unit, scale, setUnit, setScale }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

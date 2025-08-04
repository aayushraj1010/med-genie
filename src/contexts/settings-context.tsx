'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  autoSpeak: boolean;
  voiceEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleAutoSpeak: () => void;
  toggleVoiceEnabled: () => void;
}

const defaultSettings: Settings = {
  autoSpeak: false,
  voiceEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('med-genie-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('med-genie-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleAutoSpeak = () => {
    setSettings(prev => ({ ...prev, autoSpeak: !prev.autoSpeak }));
  };

  const toggleVoiceEnabled = () => {
    setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    toggleAutoSpeak,
    toggleVoiceEnabled,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 
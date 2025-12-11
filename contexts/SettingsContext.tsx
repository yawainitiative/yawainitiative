
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { supabase } from '../services/supabase';

const defaultSettings: AppSettings = {
  appName: 'YAWAI',
  tagline: 'Empowerment',
  logoUrl: null,
  contactEmail: 'info@yawai.org',
  accentColor: '#F59E0B' // yawai-gold
};

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Fetch settings from Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .single();

        if (error) {
          // 42P01: Table does not exist (Schema not migrated)
          // PGRST116: JSON object requested, multiple (or no) rows returned (Table empty)
          if (error.code === '42P01' || error.code === 'PGRST116') {
             console.warn("Settings table not found or empty. Using default settings. (Please run SQL migration if you are the admin)");
             return;
          }
          
          console.error("Error fetching settings:", error.message || error);
          return;
        }

        if (data) {
          setSettings({
            appName: data.app_name || defaultSettings.appName,
            tagline: data.tagline || defaultSettings.tagline,
            logoUrl: data.logo_url || null,
            contactEmail: data.contact_email || defaultSettings.contactEmail,
            accentColor: data.accent_color || defaultSettings.accentColor
          });
        }
      } catch (err) {
        console.error("Unexpected error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    // 1. Optimistic Update (UI updates immediately)
    const updatedState = { ...settings, ...newSettings };
    setSettings(updatedState);

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 1, // Enforce singleton row
          app_name: updatedState.appName,
          tagline: updatedState.tagline,
          logo_url: updatedState.logoUrl,
          contact_email: updatedState.contactEmail,
          accent_color: updatedState.accentColor
        });

      if (error) {
        console.error("Error saving settings:", error.message || error);
        if (error.code === '42P01') {
           alert("System Error: 'app_settings' table missing. Please run the database migration script.");
        }
      }
    } catch (err) {
      console.error("Failed to save settings to DB:", err);
    }
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    try {
      await supabase
        .from('app_settings')
        .upsert({
          id: 1,
          app_name: defaultSettings.appName,
          tagline: defaultSettings.tagline,
          logo_url: null,
          contact_email: defaultSettings.contactEmail,
          accent_color: defaultSettings.accentColor
        });
    } catch (err) {
      console.error("Failed to reset settings:", err);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

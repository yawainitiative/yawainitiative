
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface LogoContextType {
  logoUrl: string | null;
  updateLogo: (url: string) => Promise<void>;
  isLoading: boolean;
}

const LogoContext = createContext<LogoContextType>({
  logoUrl: null,
  updateLogo: async () => {},
  isLoading: false,
});

export const useLogo = () => useContext(LogoContext);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // 1. Try fetching from Supabase 'app_settings' table
        // We use 'setting_value' based on the new SQL schema
        const { data, error } = await supabase
          .from('app_settings')
          .select('setting_value')
          .eq('setting_key', 'logo_url')
          .single();

        if (data && data.setting_value) {
          setLogoUrl(data.setting_value);
          localStorage.setItem('yawai_app_logo', data.setting_value); // Cache locally
        } else {
          // 2. Fallback to Local Storage if DB is empty or fails
          const storedLogo = localStorage.getItem('yawai_app_logo');
          if (storedLogo) setLogoUrl(storedLogo);
        }
      } catch (err) {
        // Silent fail to local storage
        const storedLogo = localStorage.getItem('yawai_app_logo');
        if (storedLogo) setLogoUrl(storedLogo);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogo();
  }, []);

  const updateLogo = async (url: string) => {
    // 1. Optimistic update
    setLogoUrl(url);
    localStorage.setItem('yawai_app_logo', url);

    try {
      // 2. Persist to Supabase with new column names
      const { error } = await supabase
        .from('app_settings')
        .upsert(
          { setting_key: 'logo_url', setting_value: url }, 
          { onConflict: 'setting_key' }
        );

      if (error) {
        console.warn('Failed to sync logo to database:', error.message);
      }
    } catch (err) {
      console.error('Error updating logo settings:', err);
    }
  };

  return (
    <LogoContext.Provider value={{ logoUrl, updateLogo, isLoading }}>
      {children}
    </LogoContext.Provider>
  );
};

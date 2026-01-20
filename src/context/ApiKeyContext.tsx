'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const STORAGE_KEY = 'passport-api-key';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
    }
    setIsInitialized(true);
  }, []);

  // Save API key to localStorage when it changes
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Don't render children until we've checked localStorage
  if (!isInitialized) {
    return null;
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}

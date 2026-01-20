'use client';

import { useState, useEffect } from 'react';

interface SettingsPanelProps {
  defaultApiKey: string;
  defaultScorerId: string;
  onSettingsChange: (apiKey: string, scorerId: string, useDefaults: boolean) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsPanel({ defaultApiKey, defaultScorerId, onSettingsChange, isOpen: controlledIsOpen, onOpenChange }: SettingsPanelProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };
  const [apiKey, setApiKey] = useState('');
  const [scorerId, setScorerId] = useState('');
  const [useDefaults, setUseDefaults] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('passport-custom-api-key');
    const savedScorerId = localStorage.getItem('passport-custom-scorer-id');
    const savedUseDefaults = localStorage.getItem('passport-use-defaults');

    if (savedUseDefaults === 'false') {
      setUseDefaults(false);
      setApiKey(savedApiKey || '');
      setScorerId(savedScorerId || '');
    }
  }, []);

  // Update parent when settings change
  useEffect(() => {
    if (useDefaults) {
      onSettingsChange(defaultApiKey, defaultScorerId, true);
    } else {
      onSettingsChange(apiKey, scorerId, false);
    }
  }, [useDefaults, apiKey, scorerId, defaultApiKey, defaultScorerId, onSettingsChange]);

  const handleSave = () => {
    localStorage.setItem('passport-use-defaults', String(useDefaults));
    if (!useDefaults) {
      localStorage.setItem('passport-custom-api-key', apiKey);
      localStorage.setItem('passport-custom-scorer-id', scorerId);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setUseDefaults(true);
    setApiKey('');
    setScorerId('');
    localStorage.removeItem('passport-custom-api-key');
    localStorage.removeItem('passport-custom-scorer-id');
    localStorage.setItem('passport-use-defaults', 'true');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
        {!useDefaults && (
          <span className="w-2 h-2 rounded-full bg-primary" title="Using custom settings" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-xl border border-border bg-background shadow-lg z-50">
            <h3 className="font-semibold mb-4">Authentication Settings</h3>

            {/* Use Defaults Toggle */}
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={useDefaults}
                onChange={(e) => setUseDefaults(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm">Use test credentials</span>
            </label>

            {!useDefaults && (
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scorer ID</label>
                  <input
                    type="text"
                    value={scorerId}
                    onChange={(e) => setScorerId(e.target.value)}
                    placeholder="Enter your scorer ID"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              {!useDefaults && (
                <button
                  onClick={handleReset}
                  className="py-2 px-4 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {useDefaults
                ? 'Using test credentials. Your requests are proxied through our server.'
                : 'Your credentials are stored locally and sent directly to the API.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

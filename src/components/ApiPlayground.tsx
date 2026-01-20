'use client';

import { useState, useEffect, useCallback } from 'react';
import { ParsedEndpoint } from '@/types/api';
import { getTagDisplayName } from '@/lib/endpoint-config';
import { EndpointSection } from './EndpointSection';
import { SettingsPanel } from './SettingsPanel';

interface NavigationItem {
  tag: string;
  displayName: string;
  endpoints: {
    id: string;
    slug: string;
    displayName: string;
    method: string;
  }[];
}

interface ApiPlaygroundProps {
  endpoints: ParsedEndpoint[];
  groupedEndpoints: Record<string, ParsedEndpoint[]>;
  navigation: NavigationItem[];
  baseUrl: string;
  defaultScorerId: string;
}

export function ApiPlayground({
  groupedEndpoints,
  navigation,
  baseUrl,
  defaultScorerId: serverScorerId,
}: ApiPlaygroundProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [useTestCredentials, setUseTestCredentials] = useState(true);
  const [globalScorerId, setGlobalScorerId] = useState('');
  const [globalAddress, setGlobalAddress] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsChange = useCallback((apiKey: string, newScorerId: string, useDefaults: boolean) => {
    setUseTestCredentials(useDefaults);
    if (!useDefaults && newScorerId) {
      setGlobalScorerId(newScorerId);
    }
  }, []);

  const handleGlobalScorerIdChange = useCallback((scorerId: string) => {
    setGlobalScorerId(scorerId);
  }, []);

  const handleGlobalAddressChange = useCallback((address: string) => {
    setGlobalAddress(address);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            // Update URL without scrolling
            window.history.replaceState(null, '', `#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    // Observe all endpoint sections
    navigation.forEach(group => {
      group.endpoints.forEach(ep => {
        const element = document.getElementById(ep.slug);
        if (element) observer.observe(element);
      });
    });

    return () => observer.disconnect();
  }, [navigation]);

  // Scroll to hash on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-500',
    POST: 'bg-blue-500',
    PUT: 'bg-amber-500',
    DELETE: 'bg-red-500',
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 border-r border-border overflow-y-auto sticky top-14 h-[calc(100vh-3.5rem)]">
        <nav className="p-4 space-y-6">
          {navigation.map((group) => (
            <div key={group.tag}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.displayName}
              </h3>
              <ul className="space-y-1">
                {group.endpoints.map((endpoint) => (
                  <li key={endpoint.id}>
                    <a
                      href={`#${endpoint.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(endpoint.slug);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === endpoint.slug
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <span className={`${methodColors[endpoint.method]} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                        {endpoint.method}
                      </span>
                      <span className="truncate">{endpoint.displayName.replace('GET ', '')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">API Reference</h1>
                <p className="text-muted-foreground">
                  Explore and test the Human Passport APIs. Build Sybil-resistant applications.
                </p>
              </div>
              <SettingsPanel
                defaultApiKey=""
                defaultScorerId={serverScorerId}
                onSettingsChange={handleSettingsChange}
                isOpen={settingsOpen}
                onOpenChange={setSettingsOpen}
              />
            </div>
          </div>

          {/* Base URL */}
          <div className="mb-8 p-4 rounded-xl border border-border bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Base URL</p>
                <code className="text-sm font-mono text-primary">{baseUrl}</code>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(baseUrl)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
                title="Copy base URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Endpoints by Tag */}
          {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => (
            <div key={tag} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{getTagDisplayName(tag)}</h2>
              <div className="space-y-6">
                {tagEndpoints.map((endpoint) => (
                  <EndpointSection
                    key={endpoint.id}
                    endpoint={endpoint}
                    baseUrl={baseUrl}
                    defaultScorerId={serverScorerId}
                    useTestCredentials={useTestCredentials}
                    globalScorerId={globalScorerId}
                    globalAddress={globalAddress}
                    onScorerIdChange={handleGlobalScorerIdChange}
                    onAddressChange={handleGlobalAddressChange}
                    onOpenSettings={handleOpenSettings}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Resources */}
          <section className="mt-12 p-6 rounded-xl border border-border bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://docs.passport.xyz/building-with-passport/stamps/passport-api-v2/getting-access"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary transition-colors"
              >
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Get API Key</p>
                  <p className="text-xs text-muted-foreground">Request access to the API</p>
                </div>
              </a>
              <a
                href="https://docs.passport.xyz/building-with-passport/stamps/passport-api-v2/quick-start-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary transition-colors"
              >
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Quick Start</p>
                  <p className="text-xs text-muted-foreground">Get started in minutes</p>
                </div>
              </a>
              <a
                href="https://docs.passport.xyz/building-with-passport/stamps/passport-api-v2/data-dictionary"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary transition-colors"
              >
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Data Dictionary</p>
                  <p className="text-xs text-muted-foreground">Understand the data models</p>
                </div>
              </a>
              <a
                href="https://docs.passport.xyz/building-with-passport/model-based-detection/available-models"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:border-primary transition-colors"
              >
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Available Models</p>
                  <p className="text-xs text-muted-foreground">Explore scoring models</p>
                </div>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useCallback, useEffect } from 'react';
import { ParsedEndpoint, ApiResponse } from '@/types/api';
import { getPathParameters, getQueryParameters, buildUrl } from '@/lib/openapi';
import { executeRequest, buildProxiedRequest } from '@/lib/api-client';
import { getEndpointDisplayName, getEndpointSlug, getEndpointDescription, getEndpointDocsUrl } from '@/lib/endpoint-config';
import { CodeGenerator } from './CodeGenerator';
import { ResponseViewer } from './ResponseViewer';

interface EndpointSectionProps {
  endpoint: ParsedEndpoint;
  baseUrl: string;
  defaultScorerId?: string;
  useTestCredentials?: boolean;
  globalScorerId?: string;
  globalAddress?: string;
  onScorerIdChange?: (scorerId: string) => void;
  onAddressChange?: (address: string) => void;
  onOpenSettings?: () => void;
}

const CODE_SAMPLE_API_KEY = 'YOUR_API_KEY';

export function EndpointSection({
  endpoint,
  baseUrl,
  defaultScorerId = '',
  useTestCredentials = true,
  globalScorerId = '',
  globalAddress = '',
  onScorerIdChange,
  onAddressChange,
  onOpenSettings,
}: EndpointSectionProps) {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeSamples, setShowCodeSamples] = useState(false);

  const pathParameters = getPathParameters(endpoint);
  const queryParameters = getQueryParameters(endpoint);
  const slug = getEndpointSlug(endpoint.id);
  const displayName = getEndpointDisplayName(endpoint.id);
  const customDescription = getEndpointDescription(endpoint.id);
  const docsUrl = getEndpointDocsUrl(endpoint.id);

  // Convert markdown links and HTML to JSX
  const renderDescription = (text: string) => {
    // Convert markdown links [text](url) to HTML, then render
    const withLinks = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    // Convert **text** to bold
    const withBold = withLinks.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return <span dangerouslySetInnerHTML={{ __html: withBold }} />;
  };

  const handleUpdateClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onOpenSettings) {
      setTimeout(() => onOpenSettings(), 300);
    }
  };

  // Initialize parameters
  useEffect(() => {
    const initialPath: Record<string, string> = {};
    pathParameters.forEach(p => {
      if (p.name === 'scorer_id') {
        // Use global scorer_id, or test credentials default if enabled, otherwise empty
        initialPath[p.name] = globalScorerId || (useTestCredentials ? defaultScorerId : '');
      } else if (p.name === 'address') {
        initialPath[p.name] = globalAddress || '';
      } else {
        initialPath[p.name] = '';
      }
    });
    setPathParams(initialPath);

    const initialQuery: Record<string, string> = {};
    queryParameters.forEach(p => {
      initialQuery[p.name] = p.schema.default?.toString() || '';
    });
    setQueryParams(initialQuery);
  }, [endpoint.id, defaultScorerId, useTestCredentials, globalScorerId, globalAddress]);

  // Sync with global values when they change
  useEffect(() => {
    if (globalScorerId && pathParams.scorer_id !== globalScorerId) {
      setPathParams(prev => prev.scorer_id !== undefined ? { ...prev, scorer_id: globalScorerId } : prev);
    }
  }, [globalScorerId]);

  useEffect(() => {
    if (globalAddress && pathParams.address !== globalAddress) {
      setPathParams(prev => prev.address !== undefined ? { ...prev, address: globalAddress } : prev);
    }
  }, [globalAddress]);

  const updatePathParam = useCallback((name: string, value: string) => {
    setPathParams(prev => ({ ...prev, [name]: value }));
    // Notify parent of scorer_id or address changes for global sync
    if (name === 'scorer_id' && onScorerIdChange) {
      onScorerIdChange(value);
    } else if (name === 'address' && onAddressChange) {
      onAddressChange(value);
    }
  }, [onScorerIdChange, onAddressChange]);

  const updateQueryParam = useCallback((name: string, value: string) => {
    setQueryParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const currentUrl = buildUrl(baseUrl, endpoint.path, pathParams, queryParams);

  const canSendRequest = () => {
    for (const param of pathParameters) {
      if (param.required && !pathParams[param.name]) {
        return false;
      }
    }
    for (const param of queryParameters) {
      if (param.required && !queryParams[param.name]) {
        return false;
      }
    }
    return true;
  };

  const handleSendRequest = async () => {
    if (!canSendRequest()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const request = buildProxiedRequest(endpoint.method, currentUrl);
      const result = await executeRequest(request);
      setResponse(result);
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        duration: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-500',
    POST: 'bg-blue-500',
    PUT: 'bg-amber-500',
    DELETE: 'bg-red-500',
  };

  return (
    <section id={slug} className="scroll-mt-20 border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`${methodColors[endpoint.method]} text-white text-xs font-bold px-2 py-1 rounded`}>
              {endpoint.method}
            </span>
            <h3 className="text-lg font-semibold">{displayName}</h3>
          </div>
          <div className="flex items-center gap-4">
            {docsUrl && (
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Docs
              </a>
            )}
            <a
              href={`#${slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Link to this section"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </a>
          </div>
        </div>
        <code className="text-sm text-muted-foreground mt-1 block">{endpoint.path}</code>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Description */}
        {(customDescription || endpoint.description) && (
          <div className="text-muted-foreground mb-6">
            {customDescription ? renderDescription(customDescription) : endpoint.description}
          </div>
        )}

        {/* Parameters & Try It - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Parameters */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Parameters</h4>

            {pathParameters.length === 0 && queryParameters.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No parameters required</p>
            ) : (
              <div className="space-y-3">
                {pathParameters.map(param => {
                  const isLockedScorerId = param.name === 'scorer_id' && useTestCredentials;
                  return (
                    <div key={param.name} className="space-y-1">
                      <label className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{param.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          path
                        </span>
                        {param.required && <span className="text-red-500 text-xs">*</span>}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pathParams[param.name] || ''}
                          onChange={(e) => updatePathParam(param.name, e.target.value)}
                          placeholder={param.description || `Enter ${param.name}`}
                          disabled={isLockedScorerId}
                          className={`flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono ${
                            isLockedScorerId ? 'bg-muted text-muted-foreground cursor-not-allowed' : ''
                          }`}
                        />
                        {isLockedScorerId && (
                          <button
                            type="button"
                            onClick={handleUpdateClick}
                            className="px-3 py-2 text-sm rounded-lg border border-border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            update
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {queryParameters.map(param => (
                  <div key={param.name} className="space-y-1">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{param.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        query
                      </span>
                      {param.required && <span className="text-red-500 text-xs">*</span>}
                    </label>
                    <input
                      type="text"
                      value={queryParams[param.name] || ''}
                      onChange={(e) => updateQueryParam(param.name, e.target.value)}
                      placeholder={param.schema.default?.toString() || `Enter ${param.name}`}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Try It */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Try It</h4>

            {/* URL Preview */}
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Request URL</p>
              <code className="text-xs break-all">{currentUrl}</code>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendRequest}
              disabled={!canSendRequest() || isLoading}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                canSendRequest() && !isLoading
                  ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </div>

        {/* Response - Full Width */}
        {(response || isLoading) && (
          <div className="mt-6">
            <ResponseViewer response={response} isLoading={isLoading} />
          </div>
        )}

        {/* Code Samples Toggle */}
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={() => setShowCodeSamples(!showCodeSamples)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showCodeSamples ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Code Samples
          </button>

          {showCodeSamples && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Replace <code className="px-1 py-0.5 bg-muted rounded">YOUR_API_KEY</code> with your API key
              </p>
              <CodeGenerator
                method={endpoint.method}
                url={currentUrl}
                apiKey={CODE_SAMPLE_API_KEY}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

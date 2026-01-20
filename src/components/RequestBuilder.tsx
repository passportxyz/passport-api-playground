'use client';

import { useState, useCallback, useEffect } from 'react';
import { ParsedEndpoint, ApiResponse } from '@/types/api';
import { getPathParameters, getQueryParameters, buildUrl } from '@/lib/openapi';
import { executeRequest, buildProxiedRequest } from '@/lib/api-client';
import { ParameterInput } from './ParameterInput';
import { CodeGenerator } from './CodeGenerator';
import { ResponseViewer } from './ResponseViewer';
import { MethodBadge } from './MethodBadge';

interface RequestBuilderProps {
  endpoint: ParsedEndpoint;
  baseUrl: string;
  defaultScorerId?: string;
}

// Placeholder for code samples - users will replace with their own key
const CODE_SAMPLE_API_KEY = 'YOUR_API_KEY';

export function RequestBuilder({ endpoint, baseUrl, defaultScorerId = '' }: RequestBuilderProps) {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pathParameters = getPathParameters(endpoint);
  const queryParameters = getQueryParameters(endpoint);

  // Initialize parameters
  useEffect(() => {
    const initialPath: Record<string, string> = {};
    pathParameters.forEach(p => {
      // Pre-fill scorer_id with the default value
      if (p.name === 'scorer_id' && defaultScorerId) {
        initialPath[p.name] = defaultScorerId;
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
  }, [endpoint.id, defaultScorerId]);

  const updatePathParam = useCallback((name: string, value: string) => {
    setPathParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const updateQueryParam = useCallback((name: string, value: string) => {
    setQueryParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const currentUrl = buildUrl(baseUrl, endpoint.path, pathParams, queryParams);

  const canSendRequest = () => {
    // Check all required path params are filled
    for (const param of pathParameters) {
      if (param.required && !pathParams[param.name]) {
        return false;
      }
    }
    // Check all required query params are filled
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
      // Use the server-side proxy (API key is added on server)
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

  return (
    <div className="space-y-6">
      {/* Endpoint header */}
      <div className="flex items-center gap-3">
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-muted-foreground">{endpoint.path}</code>
      </div>

      {/* Description */}
      {endpoint.description && (
        <p className="text-muted-foreground">{endpoint.description}</p>
      )}

      {/* Parameters */}
      {(pathParameters.length > 0 || queryParameters.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parameters</h3>

          {pathParameters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Path Parameters</h4>
              {pathParameters.map(param => (
                <ParameterInput
                  key={param.name}
                  parameter={param}
                  value={pathParams[param.name] || ''}
                  onChange={(value) => updatePathParam(param.name, value)}
                />
              ))}
            </div>
          )}

          {queryParameters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Query Parameters</h4>
              {queryParameters.map(param => (
                <ParameterInput
                  key={param.name}
                  parameter={param}
                  value={queryParams[param.name] || ''}
                  onChange={(value) => updateQueryParam(param.name, value)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Request URL preview */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Request URL</h3>
        <div className="p-3 rounded-lg bg-muted font-mono text-sm break-all">
          {currentUrl}
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSendRequest}
        disabled={!canSendRequest() || isLoading}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          canSendRequest() && !isLoading
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Sending...' : 'Try It'}
      </button>

      {/* Code samples */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Code Samples</h3>
        <p className="text-sm text-muted-foreground">
          Replace <code className="px-1 py-0.5 bg-muted rounded">YOUR_API_KEY</code> with your actual API key.
        </p>
        <CodeGenerator
          method={endpoint.method}
          url={currentUrl}
          apiKey={CODE_SAMPLE_API_KEY}
        />
      </div>

      {/* Response */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Response</h3>
        <ResponseViewer response={response} isLoading={isLoading} />
      </div>
    </div>
  );
}

'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { ApiResponse } from '@/types/api';

interface ResponseViewerProps {
  response: ApiResponse | null;
  isLoading: boolean;
}

export function ResponseViewer({ response, isLoading }: ResponseViewerProps) {
  if (isLoading) {
    return (
      <div className="p-4 rounded-lg border border-border bg-muted">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="text-sm text-muted-foreground">Sending request...</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="p-4 rounded-lg border border-border bg-muted">
        <p className="text-sm text-muted-foreground">
          Click &quot;Send Request&quot; to see the response here.
        </p>
      </div>
    );
  }

  const statusColor = response.status >= 200 && response.status < 300
    ? 'text-green-500'
    : response.status >= 400
      ? 'text-red-500'
      : 'text-yellow-500';

  const jsonString = typeof response.data === 'string'
    ? response.data
    : JSON.stringify(response.data, null, 2);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Response header */}
      <div className="flex items-center justify-between p-3 bg-muted border-b border-border">
        <div className="flex items-center gap-4">
          <span className={`font-mono font-bold ${statusColor}`}>
            {response.status} {response.statusText}
          </span>
          <span className="text-sm text-muted-foreground">
            {response.duration}ms
          </span>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(jsonString)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Copy
        </button>
      </div>

      {/* Response body */}
      <div className="max-h-[500px] overflow-auto">
        <Highlight
          theme={themes.nightOwl}
          code={jsonString}
          language="json"
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={style} className="p-4 text-sm !bg-code-bg">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none">
                    {i + 1}
                  </span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

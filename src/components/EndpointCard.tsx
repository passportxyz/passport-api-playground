'use client';

import Link from 'next/link';
import { ParsedEndpoint } from '@/types/api';
import { MethodBadge } from './MethodBadge';

interface EndpointCardProps {
  endpoint: ParsedEndpoint;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
  // Create a URL-friendly slug from the endpoint
  const slug = endpoint.id.replace(/_/g, '-').toLowerCase();

  return (
    <Link
      href={`/endpoint/${slug}`}
      className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all group"
    >
      <div className="flex items-start gap-3">
        <MethodBadge method={endpoint.method} className="mt-0.5" />
        <div className="flex-1 min-w-0">
          <code className="text-sm font-mono text-foreground group-hover:text-primary transition-colors">
            {endpoint.path}
          </code>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {endpoint.summary || endpoint.description}
          </p>
          {endpoint.requiresAuth && (
            <span className="inline-flex items-center mt-2 text-xs text-muted-foreground">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Requires API Key
            </span>
          )}
        </div>
        <svg
          className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

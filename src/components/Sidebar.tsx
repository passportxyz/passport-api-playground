'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ParsedEndpoint } from '@/types/api';
import { MethodBadge } from './MethodBadge';

interface SidebarProps {
  endpoints: ParsedEndpoint[];
  groupedEndpoints: Record<string, ParsedEndpoint[]>;
}

export function Sidebar({ groupedEndpoints }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border overflow-y-auto">
      <nav className="p-4 space-y-6">
        <div>
          <Link
            href="/"
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Overview
          </Link>
        </div>

        {Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
          <div key={tag}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {tag}
            </h3>
            <ul className="space-y-1">
              {endpoints.map((endpoint) => {
                const slug = endpoint.id.replace(/_/g, '-').toLowerCase();
                const isActive = pathname === `/endpoint/${slug}`;

                return (
                  <li key={endpoint.id}>
                    <Link
                      href={`/endpoint/${slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <MethodBadge method={endpoint.method} className="text-[10px] px-1.5 py-0" />
                      <span className="truncate font-mono text-xs">
                        {endpoint.path.split('/').pop() || endpoint.path}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

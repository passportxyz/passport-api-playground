# Integration Guide: Merging into Passport Docs

This document provides a comprehensive guide for integrating the API Playground into the [passport-docs](https://github.com/passportxyz/passport-docs) Nextra-based documentation site.

## Overview

The passport-docs site uses:
- **Framework**: Next.js 13 with Nextra 2.13
- **Styling**: Styled-JSX (built into Next.js)
- **Theme**: nextra-theme-docs
- **Content**: MDX files in `/pages` directory

This playground uses:
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Content**: React components

## Integration Approach

There are two main approaches for integration:

### Option A: Embed as Components (Recommended)

Keep the playground as React components that can be imported into MDX pages.

### Option B: Separate Route

Add the playground as a separate route within the Nextra site.

---

## Option A: Embed as Components

### Step 1: Copy Components

Copy the following directories to passport-docs:

```
passport-api-playground/src/components/  →  passport-docs/components/playground/
passport-api-playground/src/lib/         →  passport-docs/lib/playground/
passport-api-playground/src/types/       →  passport-docs/types/
passport-api-playground/src/context/     →  passport-docs/context/
```

### Step 2: Convert Tailwind to Styled-JSX

Each component needs styling conversion. Here's the pattern:

**Before (Tailwind):**
```tsx
export function MethodBadge({ method }: { method: string }) {
  return (
    <span className="px-2 py-0.5 text-xs font-bold rounded bg-green-500 text-white">
      {method}
    </span>
  );
}
```

**After (Styled-JSX):**
```tsx
export function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PUT: '#eab308',
    DELETE: '#ef4444',
  };

  return (
    <>
      <span className="method-badge">
        {method}
      </span>
      <style jsx>{`
        .method-badge {
          padding: 2px 8px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 4px;
          background-color: ${colors[method] || '#6b7280'};
          color: white;
        }
      `}</style>
    </>
  );
}
```

### Step 3: Create MDX Wrapper

Create a wrapper component for use in MDX:

```tsx
// components/playground/APIPlayground.tsx
'use client';

import { useEffect, useState } from 'react';
import { ApiKeyProvider } from '@/context/ApiKeyContext';
import { RequestBuilder } from './RequestBuilder';
import { fetchOpenAPISpec, parseEndpoints, getBaseUrl } from '@/lib/playground/openapi';

interface APIPlaygroundProps {
  endpointId: string;
}

export function APIPlayground({ endpointId }: APIPlaygroundProps) {
  const [endpoint, setEndpoint] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    async function loadSpec() {
      const spec = await fetchOpenAPISpec();
      const endpoints = parseEndpoints(spec);
      const found = endpoints.find(e => e.id === endpointId);
      setEndpoint(found);
      setBaseUrl(getBaseUrl(spec));
    }
    loadSpec();
  }, [endpointId]);

  if (!endpoint) return <div>Loading...</div>;

  return (
    <ApiKeyProvider>
      <RequestBuilder endpoint={endpoint} baseUrl={baseUrl} />
    </ApiKeyProvider>
  );
}
```

### Step 4: Use in MDX Pages

```mdx
---
title: API Reference
---

import { APIPlayground } from '@/components/playground/APIPlayground';

# Get Score

Retrieve the Stamp-based unique humanity score for a specified address.

<APIPlayground endpointId="v2_api_api_stamps_a_submit_passport" />
```

### Step 5: Add Dependencies

Add to passport-docs `package.json`:

```json
{
  "dependencies": {
    "prism-react-renderer": "^2.4.1"
  }
}
```

---

## Option B: Separate Route

### Step 1: Configure Nextra for App Router Pages

Nextra 2.x uses Pages Router. For a separate route, you can:

1. Create a custom page that bypasses Nextra theming
2. Or wait for Nextra 3.x which supports App Router

### Step 2: Add as External Link

Temporarily, add the playground as an external link in the navigation:

```tsx
// theme.config.tsx
const config = {
  // ...
  navbar: {
    extraContent: (
      <a href="https://playground.passport.xyz" target="_blank">
        API Playground
      </a>
    ),
  },
};
```

---

## Component Conversion Reference

### Color Variables

| Tailwind Class | CSS Variable | Value (Light) | Value (Dark) |
|---------------|--------------|---------------|--------------|
| `bg-background` | `--background` | `#ffffff` | `#111111` |
| `text-foreground` | `--foreground` | `#111111` | `#ededed` |
| `bg-muted` | `--muted` | `#f5f5f5` | `#1a1a1a` |
| `text-muted-foreground` | `--muted-foreground` | `#737373` | `#a3a3a3` |
| `border-border` | `--border` | `#e5e5e5` | `#262626` |
| `bg-primary` | `--primary` | `#3b82f6` | `#3b82f6` |
| `text-primary-foreground` | `--primary-foreground` | `#ffffff` | `#ffffff` |

### Nextra Component Equivalents

| Playground Component | Nextra Equivalent |
|---------------------|-------------------|
| Tabs (CodeGenerator) | `import { Tab, Tabs } from 'nextra/components'` |
| Cards (EndpointCard) | `import { Card, Cards } from 'nextra/components'` |
| Callout (warnings) | `import { Callout } from 'nextra/components'` |

### Dark Mode

Nextra handles dark mode automatically via CSS classes. Ensure your styled-jsx respects the `.dark` class:

```tsx
<style jsx>{`
  .component {
    background: var(--background);
    color: var(--foreground);
  }

  :global(.dark) .component {
    /* Dark mode overrides if needed */
  }
`}</style>
```

---

## Files to Migrate

### Critical Files

1. **`src/lib/openapi.ts`** - OpenAPI spec fetching and parsing
2. **`src/lib/api-client.ts`** - API request execution
3. **`src/lib/code-templates.ts`** - Code generation
4. **`src/context/ApiKeyContext.tsx`** - API key state management
5. **`src/types/api.ts`** - TypeScript type definitions

### Components (by priority)

1. **`RequestBuilder.tsx`** - Core interactive component
2. **`CodeGenerator.tsx`** - Code sample tabs
3. **`ResponseViewer.tsx`** - JSON response display
4. **`ParameterInput.tsx`** - Form inputs
5. **`ApiKeyInput.tsx`** - API key management
6. **`MethodBadge.tsx`** - HTTP method badges

### Optional Components

- `Header.tsx` - Not needed (Nextra provides navigation)
- `Sidebar.tsx` - Not needed (Nextra provides sidebar)
- `ThemeToggle.tsx` - Not needed (Nextra provides theme toggle)

---

## Testing After Migration

1. **Build Test**: Run `pnpm build` to ensure no TypeScript errors
2. **Dev Test**: Run `pnpm dev` and navigate to API reference pages
3. **Functionality Test**:
   - Enter an API key and verify it persists
   - Fill in parameters and verify URL updates
   - Send a request and verify response displays
   - Switch code sample languages
   - Test dark mode toggle

---

## Troubleshooting

### "Cannot find module" errors

Ensure path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Styled-JSX not applying

Wrap components with `<>` fragments and ensure `<style jsx>` is a direct child:

```tsx
return (
  <>
    <div className="wrapper">content</div>
    <style jsx>{`...`}</style>
  </>
);
```

### Dark mode not working

Ensure you're using CSS variables, not hardcoded colors:

```tsx
// Bad
background: #ffffff;

// Good
background: var(--background);
```

---

## Questions?

Reach out to the Passport team or open an issue in the repository.

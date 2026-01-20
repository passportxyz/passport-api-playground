# Architecture Documentation

This document describes the technical architecture of the Human Passport API Playground.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Client                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Header    │  │   Sidebar   │  │      Main Content       │  │
│  │  Component  │  │  Component  │  │   (Page Components)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    ApiKeyContext                           │  │
│  │              (Global State Provider)                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Build Time / ISR
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     OpenAPI Spec Fetch                           │
│              https://api.passport.xyz/v2/openapi.json           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Runtime (User Request)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Human Passport API                             │
│                  https://api.passport.xyz                        │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
RootLayout
├── ApiKeyProvider (Context)
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation Links
│   │   └── ThemeToggle
│   │
│   └── Page Content
│       ├── Sidebar
│       │   └── Endpoint Navigation
│       │
│       └── Main
│           ├── Home Page
│           │   ├── ApiKeyInput
│           │   ├── EndpointCard (×5)
│           │   └── Resource Links
│           │
│           └── Endpoint Page
│               ├── ApiKeyInput
│               └── RequestBuilder
│                   ├── ParameterInput (×n)
│                   ├── CodeGenerator
│                   │   └── Language Tabs (curl, js, python)
│                   └── ResponseViewer
```

## Data Flow

### 1. OpenAPI Spec Loading (Build Time)

```
┌──────────────┐     fetch      ┌─────────────────┐
│  Next.js     │ ──────────────>│ api.passport.xyz│
│  Build       │                │ /v2/openapi.json│
└──────────────┘                └─────────────────┘
       │
       │ parseEndpoints()
       ▼
┌──────────────────────────────────────┐
│         ParsedEndpoint[]              │
│  - id: string                         │
│  - method: GET/POST/PUT/DELETE        │
│  - path: string                       │
│  - parameters: Parameter[]            │
│  - responses: Response[]              │
└──────────────────────────────────────┘
       │
       │ generateStaticParams()
       ▼
┌──────────────────────────────────────┐
│     Static Pages Generated            │
│  - /                                  │
│  - /endpoint/[slug] (×5)             │
└──────────────────────────────────────┘
```

### 2. API Request Flow (Runtime)

```
┌─────────────┐     User Input     ┌──────────────────┐
│  Parameter  │ ──────────────────>│  RequestBuilder  │
│   Inputs    │                    │    Component     │
└─────────────┘                    └──────────────────┘
                                          │
                                          │ buildUrl()
                                          ▼
                                   ┌──────────────────┐
                                   │   Current URL    │
                                   │   Preview        │
                                   └──────────────────┘
                                          │
                                          │ User clicks "Send"
                                          ▼
┌─────────────┐                    ┌──────────────────┐
│  ApiKey     │ ──────────────────>│  executeRequest()│
│  Context    │      X-API-Key     │  api-client.ts   │
└─────────────┘                    └──────────────────┘
                                          │
                                          │ fetch()
                                          ▼
                                   ┌──────────────────┐
                                   │ api.passport.xyz │
                                   │   /v2/...        │
                                   └──────────────────┘
                                          │
                                          │ Response
                                          ▼
                                   ┌──────────────────┐
                                   │ ResponseViewer   │
                                   │ - status code    │
                                   │ - duration       │
                                   │ - JSON body      │
                                   └──────────────────┘
```

### 3. Code Generation Flow

```
┌──────────────────────────────────────────────────────┐
│                    CodeGenerator                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  Input:                                         │  │
│  │  - method: string                               │  │
│  │  - url: string (with params)                    │  │
│  │  - apiKey: string                               │  │
│  │  - body?: object                                │  │
│  └────────────────────────────────────────────────┘  │
│                         │                            │
│         ┌───────────────┼───────────────┐            │
│         ▼               ▼               ▼            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐     │
│  │   cURL     │  │ JavaScript │  │   Python   │     │
│  │  Template  │  │  Template  │  │  Template  │     │
│  └────────────┘  └────────────┘  └────────────┘     │
│         │               │               │            │
│         └───────────────┼───────────────┘            │
│                         ▼                            │
│  ┌────────────────────────────────────────────────┐  │
│  │  Syntax Highlighted Code Block                  │  │
│  │  (prism-react-renderer)                         │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## State Management

### Global State (ApiKeyContext)

```typescript
interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}
```

**Storage**: localStorage (`passport-api-key`)

**Provider Location**: `RootLayout` (wraps entire app)

### Local State (Component Level)

| Component | State | Purpose |
|-----------|-------|---------|
| `RequestBuilder` | `pathParams`, `queryParams` | Form input values |
| `RequestBuilder` | `response`, `isLoading` | API response state |
| `CodeGenerator` | `activeLanguage` | Selected code tab |
| `ThemeToggle` | `isDark` | Current theme |
| `ApiKeyInput` | `isVisible`, `inputValue` | UI state |

## File Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout + providers
│   ├── page.tsx                 # Home page (server component)
│   ├── globals.css              # Tailwind + CSS variables
│   └── endpoint/
│       └── [slug]/
│           └── page.tsx         # Endpoint detail (server component)
│
├── components/                   # React components
│   ├── ApiKeyInput.tsx          # API key form (client)
│   ├── CodeGenerator.tsx        # Code samples (client)
│   ├── EndpointCard.tsx         # Endpoint card (client)
│   ├── Header.tsx               # Site header (client)
│   ├── MethodBadge.tsx          # Method badge (client)
│   ├── ParameterInput.tsx       # Param input (client)
│   ├── RequestBuilder.tsx       # Main builder (client)
│   ├── ResponseViewer.tsx       # Response display (client)
│   ├── Sidebar.tsx              # Navigation (client)
│   └── ThemeToggle.tsx          # Theme switch (client)
│
├── context/
│   └── ApiKeyContext.tsx        # API key state provider
│
├── lib/                          # Utilities
│   ├── api-client.ts            # Request execution
│   ├── code-templates.ts        # Code generation
│   └── openapi.ts               # OpenAPI parsing
│
└── types/
    └── api.ts                   # TypeScript definitions
```

## Rendering Strategy

| Route | Rendering | Revalidation |
|-------|-----------|--------------|
| `/` | SSG (Static) | 1 hour (ISR) |
| `/endpoint/[slug]` | SSG (Static) | 1 hour (ISR) |

**Why SSG?**
- OpenAPI spec changes infrequently
- Fast initial page load
- SEO-friendly
- Reduces API calls

**Why 1 hour revalidation?**
- Balances freshness with performance
- Picks up API changes within reasonable time
- Matches typical documentation update frequency

## Security Considerations

1. **API Key Storage**
   - Stored in localStorage (client-side only)
   - Never sent to our servers
   - Only sent to api.passport.xyz in headers

2. **CORS**
   - Requests to api.passport.xyz require proper CORS headers
   - The API must allow requests from the playground domain

3. **No Server-Side Secrets**
   - No environment variables with secrets
   - All API calls are client-side

## Performance Optimizations

1. **Static Generation**
   - Pages are pre-rendered at build time
   - Minimal JavaScript for initial paint

2. **Code Splitting**
   - Each component is a separate chunk
   - Client components loaded on demand

3. **Syntax Highlighting**
   - Uses prism-react-renderer (lightweight)
   - Only loads grammars for used languages

4. **Caching**
   - OpenAPI spec cached via ISR
   - localStorage for API key persistence

## Extensibility

### Adding a New Endpoint

No code changes needed! New endpoints from the OpenAPI spec are automatically:
1. Parsed at build time
2. Added to the sidebar
3. Given a detail page
4. Support all features (params, code gen, etc.)

### Adding a New Code Language

1. Add template function in `lib/code-templates.ts`:
```typescript
export function generateRubyCode(params: CodeTemplateParams): string {
  // ...
}
```

2. Add to languages array in `CodeGenerator.tsx`:
```typescript
const languages = [
  // ...
  { id: 'ruby', label: 'Ruby', prismLanguage: 'ruby' },
];
```

### Adding a New Parameter Type

Update `ParameterInput.tsx` to handle the new type:
```typescript
if (parameter.schema.type === 'newType') {
  return <CustomInput ... />;
}
```

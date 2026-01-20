# Human Passport API Playground

An interactive API reference and playground for the Human Passport (formerly Gitcoin Passport) Developer Platform. This application allows developers to explore, test, and understand the Stamps and Models APIs.

## Features

- **Interactive API Testing**: Test API endpoints directly in the browser with your API key
- **Code Generation**: Auto-generated code samples in cURL, JavaScript, and Python
- **Dynamic Documentation**: Documentation is fetched from the live OpenAPI spec at build time
- **Dark Mode Support**: Matches the passport-docs styling with light/dark theme toggle
- **Response Viewer**: Syntax-highlighted JSON responses with status codes and timing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Syntax Highlighting**: prism-react-renderer

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/passportxyz/passport-api-playground.git
cd passport-api-playground

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the playground.

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## Project Structure

```
passport-api-playground/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page with endpoint listing
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── globals.css         # Global styles and CSS variables
│   │   └── endpoint/[slug]/    # Dynamic endpoint detail pages
│   ├── components/             # React components
│   │   ├── ApiKeyInput.tsx     # API key input with localStorage
│   │   ├── CodeGenerator.tsx   # Code sample generation
│   │   ├── EndpointCard.tsx    # Endpoint overview card
│   │   ├── Header.tsx          # Site header with navigation
│   │   ├── MethodBadge.tsx     # HTTP method badge
│   │   ├── ParameterInput.tsx  # Form input for parameters
│   │   ├── RequestBuilder.tsx  # Main request building UI
│   │   ├── ResponseViewer.tsx  # JSON response display
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   └── ThemeToggle.tsx     # Dark/light mode toggle
│   ├── context/                # React context providers
│   │   └── ApiKeyContext.tsx   # Global API key state
│   ├── lib/                    # Utility functions
│   │   ├── api-client.ts       # API request execution
│   │   ├── code-templates.ts   # Code generation templates
│   │   └── openapi.ts          # OpenAPI spec parsing
│   └── types/                  # TypeScript type definitions
│       └── api.ts              # API-related types
├── docs/                       # Additional documentation
│   └── ARCHITECTURE.md         # Technical architecture
├── INTEGRATION.md              # Passport-docs integration guide
└── package.json
```

## Data Source

The API documentation is dynamically fetched from the Human Passport OpenAPI specification:

```
https://api.passport.xyz/v2/openapi.json
```

The spec is fetched at build time and revalidated every hour using Next.js ISR (Incremental Static Regeneration).

## Supported APIs

### Stamp API v2
- `GET /v2/stamps/{scorer_id}/score/{address}` - Retrieve Stamp-based score
- `GET /v2/stamps/{scorer_id}/score/{address}/history` - Retrieve historical score
- `GET /v2/stamps/metadata` - Get all available Stamps
- `GET /v2/stamps/{address}` - Get Stamps for an address

### Model API
- `GET /v2/models/score/{address}` - Retrieve model-based scores

## Environment Variables

No environment variables are required for basic operation. The OpenAPI spec is fetched from the public API endpoint.

Optional:
- `NEXT_PUBLIC_GA_ID` - Google Analytics measurement ID (if analytics are needed)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Integration with Passport Docs

This playground is designed to eventually be merged into the [passport-docs](https://github.com/passportxyz/passport-docs) repository. See [INTEGRATION.md](./INTEGRATION.md) for the migration guide.

## License

This project is part of the Human Passport ecosystem. See the [Human Passport GitHub](https://github.com/passportxyz) for licensing information.

## Links

- [Human Passport Docs](https://docs.passport.xyz)
- [API Quick Start Guide](https://docs.passport.xyz/building-with-passport/stamps/passport-api-v2/quick-start-guide)
- [Get API Access](https://docs.passport.xyz/building-with-passport/stamps/passport-api-v2/getting-access)
- [GitHub](https://github.com/passportxyz)

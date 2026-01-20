import { notFound } from 'next/navigation';
import { fetchOpenAPISpec, parseEndpoints, groupEndpointsByTag, getBaseUrl } from '@/lib/openapi';
import { Sidebar } from '@/components/Sidebar';
import { RequestBuilder } from '@/components/RequestBuilder';

export const revalidate = 3600; // Revalidate every hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const spec = await fetchOpenAPISpec();
  const endpoints = parseEndpoints(spec);

  return endpoints.map((endpoint) => ({
    slug: endpoint.id.replace(/_/g, '-').toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const spec = await fetchOpenAPISpec();
  const endpoints = parseEndpoints(spec);

  const endpoint = endpoints.find(
    (e) => e.id.replace(/_/g, '-').toLowerCase() === slug
  );

  if (!endpoint) {
    return { title: 'Not Found | Human Passport API Reference' };
  }

  return {
    title: `${endpoint.method} ${endpoint.path} | Human Passport API Reference`,
    description: endpoint.summary || endpoint.description,
  };
}

export default async function EndpointPage({ params }: PageProps) {
  const { slug } = await params;
  const spec = await fetchOpenAPISpec();
  const endpoints = parseEndpoints(spec);
  const groupedEndpoints = groupEndpointsByTag(endpoints);
  const baseUrl = getBaseUrl(spec);
  const scorerId = process.env.PASSPORT_SCORER_ID || '';

  const endpoint = endpoints.find(
    (e) => e.id.replace(/_/g, '-').toLowerCase() === slug
  );

  if (!endpoint) {
    notFound();
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar endpoints={endpoints} groupedEndpoints={groupedEndpoints} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              API Reference
            </a>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground">{endpoint.tag}</span>
          </nav>

          {/* Endpoint title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{endpoint.summary || endpoint.path}</h1>
          </div>

          {/* Request Builder */}
          <RequestBuilder endpoint={endpoint} baseUrl={baseUrl} defaultScorerId={scorerId} />
        </div>
      </main>
    </div>
  );
}

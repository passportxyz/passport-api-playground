import { fetchOpenAPISpec, parseEndpoints, groupEndpointsByTag, getBaseUrl } from '@/lib/openapi';
import { ParsedEndpoint } from '@/types/api';
import { getTagDisplayName, getTagOrder, getEndpointOrder, getEndpointSlug, getEndpointDisplayName } from '@/lib/endpoint-config';
import { ApiPlayground } from '@/components/ApiPlayground';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const spec = await fetchOpenAPISpec();
  const endpoints = parseEndpoints(spec);
  const groupedEndpoints = groupEndpointsByTag(endpoints);
  const baseUrl = getBaseUrl(spec);
  const defaultScorerId = process.env.PASSPORT_SCORER_ID || '';

  // Sort endpoints within each group
  const sortedGroupedEndpoints = Object.fromEntries(
    Object.entries(groupedEndpoints)
      .map(([tag, eps]): [string, ParsedEndpoint[]] => [
        tag,
        [...eps].sort((a, b) => getEndpointOrder(a.id) - getEndpointOrder(b.id))
      ])
      .sort(([tagA], [tagB]) => getTagOrder(tagA) - getTagOrder(tagB))
  );

  // Build navigation data
  const navigation = Object.entries(sortedGroupedEndpoints).map(([tag, eps]) => ({
    tag,
    displayName: getTagDisplayName(tag),
    endpoints: eps.map(ep => ({
      id: ep.id,
      slug: getEndpointSlug(ep.id),
      displayName: getEndpointDisplayName(ep.id),
      method: ep.method,
    }))
  }));

  return (
    <ApiPlayground
      endpoints={endpoints}
      groupedEndpoints={sortedGroupedEndpoints}
      navigation={navigation}
      baseUrl={baseUrl}
      defaultScorerId={defaultScorerId}
    />
  );
}

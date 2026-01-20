// Endpoint display configuration
// Maps operation IDs to custom display names and order

export const TAG_CONFIG: Record<string, { displayName: string; order: number }> = {
  'Stamp API': { displayName: 'Stamps API', order: 1 },
  'Model Analysis': { displayName: 'Models API', order: 2 },
};

export const ENDPOINT_CONFIG: Record<string, { displayName: string; slug: string; order: number; description?: string; docsUrl?: string }> = {
  // Stamps API
  'v2_api_api_stamps_a_submit_passport': {
    displayName: 'GET Stamps Score',
    slug: 'stamps-score',
    order: 1,
    description: `This is the primary endpoint that partners using the Stamps product will use.<br /><br />This endpoint returns the latest score and Stamp data for a single address.`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/stamps/passport-api/api-reference#retrieve-latest-score-for-a-single-address',
  },
  'v2_api_api_stamps_get_score_history': {
    displayName: 'GET Score History',
    slug: 'score-history',
    order: 2,
    description: `This endpoint will return the historical score and Stamp data for a single address at a specified time.<br /><br />**Note:** To access this endpoint, you must submit your use case and be approved by the Passport team. To do so, please fill out the following form, making sure to provide a detailed description of your use case. The Passport team typically reviews and responds to form responses within 48 hours. [Request access](https://forms.gle/4GyicBfhtHW29eEu8)`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/stamps/passport-api/api-reference#retrieve-historical-score-for-a-single-address',
  },
  'v2_api_api_stamps_get_passport_stamps': {
    displayName: 'GET Verified Stamps',
    slug: 'verified-stamps',
    order: 3,
    description: `Use this endpoint to request all Stamps that have been verified by the specified Ethereum address.<br /><br />If you would like to retrieve the metadata for all available Stamps, please use the [GET All Stamps](#all-stamps) endpoint.`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/stamps/passport-api/api-reference#retrieve-stamps-verified-by-a-single-address',
  },
  'v2_api_api_stamps_stamp_display': {
    displayName: 'GET All Stamps',
    slug: 'all-stamps',
    order: 4,
    description: `Use this endpoint to request all Stamps available on Passport.<br /><br />If you would like to retrieve just the Stamps that are connected to a specified Ethereum address, please use the [GET Verified Stamps](#verified-stamps) endpoint.`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/stamps/passport-api/api-reference#retrieve-all-stamps-available-in-passport',
  },
  // Models API
  'v2_api_api_models_get_analysis': {
    displayName: 'GET Model Score',
    slug: 'model-score',
    order: 1,
    description: `Retrieve Sybil classification score for an Ethereum address. A score of -1 means that the given address doesn't have enough transaction history. A score of 0 means the user is likely a Sybil, and a score of 100 means the user is likely a human.`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/models/api-reference',
  },
};

export function getEndpointDescription(operationId: string): string | undefined {
  return ENDPOINT_CONFIG[operationId]?.description;
}

export function getEndpointDocsUrl(operationId: string): string | undefined {
  return ENDPOINT_CONFIG[operationId]?.docsUrl;
}

export function getEndpointDisplayName(operationId: string): string {
  return ENDPOINT_CONFIG[operationId]?.displayName || operationId;
}

export function getEndpointSlug(operationId: string): string {
  return ENDPOINT_CONFIG[operationId]?.slug || operationId.replace(/_/g, '-').toLowerCase();
}

export function getEndpointOrder(operationId: string): number {
  return ENDPOINT_CONFIG[operationId]?.order || 999;
}

export function getTagDisplayName(tag: string): string {
  return TAG_CONFIG[tag]?.displayName || tag;
}

export function getTagOrder(tag: string): number {
  return TAG_CONFIG[tag]?.order || 999;
}

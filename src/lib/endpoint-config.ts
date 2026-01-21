// Endpoint display configuration
// Maps operation IDs to custom display names and order

export const TAG_CONFIG: Record<string, { displayName: string; order: number }> = {
  'Stamp API': { displayName: 'Stamps API', order: 1 },
  'Model Analysis': { displayName: 'Models API', order: 2 },
  'Individual Verifications': { displayName: 'Individual Verifications', order: 3 },
};

// Base URLs for different API groups
export const INDIVIDUAL_VERIFICATIONS_BASE_URL = 'https://api.holonym.io';

// Static endpoint definitions for Individual Verifications
// These endpoints don't come from OpenAPI and use a different base URL (api.holonym.io)
export const INDIVIDUAL_VERIFICATION_ENDPOINTS = [
  {
    id: 'iv_gov_id_verification',
    method: 'GET' as const,
    path: '/sybil-resistance/gov-id/{network}',
    summary: 'Check government ID verification status',
    description: 'Returns whether a user has completed government ID (KYC) verification and has a unique proof for the specified action.',
    tag: 'Individual Verifications',
    parameters: [
      {
        name: 'network',
        in: 'path' as const,
        description: 'Network (optimism or base-sepolia)',
        required: true,
        schema: { type: 'string', default: 'optimism' },
      },
      {
        name: 'user',
        in: 'query' as const,
        description: 'User\'s blockchain address',
        required: true,
        schema: { type: 'string' },
      },
      {
        name: 'action-id',
        in: 'query' as const,
        description: 'Action ID for sybil resistance (default: 123456789)',
        required: true,
        schema: { type: 'string', default: '123456789' },
      },
    ],
    responses: {},
    requiresAuth: false,
  },
  {
    id: 'iv_phone_verification',
    method: 'GET' as const,
    path: '/sybil-resistance/phone/{network}',
    summary: 'Check phone verification status',
    description: 'Returns whether a user has completed phone verification and has a unique proof for the specified action.',
    tag: 'Individual Verifications',
    parameters: [
      {
        name: 'network',
        in: 'path' as const,
        description: 'Network (optimism or base-sepolia)',
        required: true,
        schema: { type: 'string', default: 'optimism' },
      },
      {
        name: 'user',
        in: 'query' as const,
        description: 'User\'s blockchain address',
        required: true,
        schema: { type: 'string' },
      },
      {
        name: 'action-id',
        in: 'query' as const,
        description: 'Action ID for sybil resistance (default: 123456789)',
        required: true,
        schema: { type: 'string', default: '123456789' },
      },
    ],
    responses: {},
    requiresAuth: false,
  },
  {
    id: 'iv_biometrics_verification',
    method: 'GET' as const,
    path: '/sybil-resistance/biometrics/{network}',
    summary: 'Check biometrics verification status',
    description: 'Returns whether a user has completed biometric verification (face uniqueness and liveness check).',
    tag: 'Individual Verifications',
    parameters: [
      {
        name: 'network',
        in: 'path' as const,
        description: 'Network (optimism or base-sepolia)',
        required: true,
        schema: { type: 'string', default: 'optimism' },
      },
      {
        name: 'user',
        in: 'query' as const,
        description: 'User\'s blockchain address',
        required: true,
        schema: { type: 'string' },
      },
      {
        name: 'action-id',
        in: 'query' as const,
        description: 'Action ID for sybil resistance (default: 123456789)',
        required: true,
        schema: { type: 'string', default: '123456789' },
      },
    ],
    responses: {},
    requiresAuth: false,
  },
  {
    id: 'iv_clean_hands',
    method: 'GET' as const,
    path: '/api/scan/addresses/{address}/attestations',
    summary: 'Query Proof of Clean Hands attestations',
    description: 'Query Sign Protocol for Proof of Clean Hands attestations (sanctions/PEP screening).',
    tag: 'Individual Verifications',
    parameters: [
      {
        name: 'address',
        in: 'path' as const,
        description: 'User\'s blockchain address',
        required: true,
        schema: { type: 'string' },
      },
    ],
    responses: {},
    requiresAuth: false,
  },
];

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
  // Individual Verifications
  'iv_gov_id_verification': {
    displayName: 'GET Gov ID Verification',
    slug: 'gov-id-verification',
    order: 1,
    description: `Check if a user has completed government ID (KYC) verification with a unique proof for your action ID. Users can verify at [id.human.tech/gov-id](https://id.human.tech/gov-id).`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/individual-verifications/api-reference#check-government-id-verification',
  },
  'iv_phone_verification': {
    displayName: 'GET Phone Verification',
    slug: 'phone-verification',
    order: 2,
    description: `Check if a user has completed phone verification with a unique proof for your action ID. Users can verify at [id.human.tech/phone](https://id.human.tech/phone).`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/individual-verifications/api-reference#check-phone-verification',
  },
  'iv_biometrics_verification': {
    displayName: 'GET Biometrics Verification',
    slug: 'biometrics-verification',
    order: 3,
    description: `Check if a user has completed biometric verification (face uniqueness and liveness check). Users can verify at [id.human.tech/biometrics](https://id.human.tech/biometrics).`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/individual-verifications/api-reference#check-biometrics-verification',
  },
  'iv_clean_hands': {
    displayName: 'GET Proof of Clean Hands',
    slug: 'clean-hands',
    order: 5,
    description: `Query Proof of Clean Hands attestations to verify a user is not on sanctions or PEP (Politically Exposed Persons) lists. Uses [Sign Protocol](https://sign.global) on Optimism. Users can verify at [id.human.tech/clean-hands](https://id.human.tech/clean-hands).`,
    docsUrl: 'https://docs.passport.xyz/building-with-passport/individual-verifications/api-reference#query-proof-of-clean-hands-attestations-via-sign-protocol',
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

export function isIndividualVerificationEndpoint(operationId: string): boolean {
  return operationId.startsWith('iv_');
}

export const SIGN_PROTOCOL_BASE_URL = 'https://mainnet-rpc.sign.global';

export function getBaseUrlForEndpoint(operationId: string): string {
  if (operationId === 'iv_clean_hands') {
    return SIGN_PROTOCOL_BASE_URL;
  }
  if (isIndividualVerificationEndpoint(operationId)) {
    return INDIVIDUAL_VERIFICATIONS_BASE_URL;
  }
  return 'https://api.passport.xyz';
}

// Sample responses for each endpoint
const SAMPLE_RESPONSES: Record<string, string> = {
  // Stamps API
  'v2_api_api_stamps_a_submit_passport': JSON.stringify({
    address: "0x...",
    score: "25.123",
    passing_score: true,
    threshold: "20",
    last_score_timestamp: "2024-01-15T10:30:00Z",
    expiration_timestamp: "2025-01-15T10:30:00Z",
    stamps: [
      { name: "Google", credential: "..." },
      { name: "Discord", credential: "..." }
    ]
  }, null, 2),
  'v2_api_api_stamps_get_score_history': JSON.stringify({
    address: "0x...",
    score: "22.456",
    timestamp: "2024-01-10T08:00:00Z",
    stamps: [
      { name: "Google", credential: "..." }
    ]
  }, null, 2),
  'v2_api_api_stamps_get_passport_stamps': JSON.stringify({
    items: [
      {
        version: "1.0.0",
        credential: {
          type: ["VerifiableCredential"],
          credentialSubject: {
            id: "did:pkh:eip155:1:0x...",
            provider: "Google"
          }
        }
      }
    ]
  }, null, 2),
  'v2_api_api_stamps_stamp_display': JSON.stringify({
    items: [
      {
        id: "Google",
        name: "Google",
        description: "Connect your Google account",
        icon: "https://...",
        groups: [{ name: "Social" }]
      }
    ]
  }, null, 2),
  // Models API
  'v2_api_api_models_get_analysis': JSON.stringify({
    address: "0x...",
    score: 75,
    model: "ethereum_activity_v1"
  }, null, 2),
  // Individual Verifications
  'iv_gov_id_verification': JSON.stringify({
    result: true,
    expirationDate: 1770922106
  }, null, 2),
  'iv_phone_verification': JSON.stringify({
    result: true,
    expirationDate: 1770922106
  }, null, 2),
  'iv_biometrics_verification': JSON.stringify({
    result: true,
    expirationDate: 1780661994
  }, null, 2),
  'iv_clean_hands': JSON.stringify({
    data: {
      rows: [
        {
          fullSchemaId: "onchain_evm_10_0x8",
          attester: "0xB1f50c6C34C72346b1229e5C80587D0D659556Fd",
          isReceiver: true,
          revoked: false,
          validUntil: 1735689600
        }
      ]
    }
  }, null, 2),
};

export function getEndpointSampleResponse(operationId: string): string {
  return SAMPLE_RESPONSES[operationId] || JSON.stringify({ message: "Sample response not available" }, null, 2);
}

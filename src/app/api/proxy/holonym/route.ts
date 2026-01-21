import { NextRequest, NextResponse } from 'next/server';

const HOLONYM_API_BASE = 'https://api.holonym.io';

export async function GET(request: NextRequest) {
  return handleProxy(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxy(request, 'POST');
}

async function handleProxy(request: NextRequest, method: string) {
  // Get the target path from query parameter
  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get('path');

  if (!targetPath) {
    return NextResponse.json(
      { error: 'Missing path parameter' },
      { status: 400 }
    );
  }

  // Build the target URL
  // Remove the 'path' param from query string, keep others
  const targetSearchParams = new URLSearchParams(searchParams);
  targetSearchParams.delete('path');
  const queryString = targetSearchParams.toString();
  const targetUrl = `${HOLONYM_API_BASE}${targetPath}${queryString ? `?${queryString}` : ''}`;

  try {
    // Get request body if present
    let body: string | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await request.text();
      } catch {
        // No body
      }
    }

    // Make the proxied request - no API key needed for Individual Verifications
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body || undefined,
    });

    // Get response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Proxy-Status': response.status.toString(),
        'X-Proxy-Duration': response.headers.get('x-response-time') || '0',
      },
    });
  } catch (error) {
    console.error('Holonym proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy request failed' },
      { status: 500 }
    );
  }
}

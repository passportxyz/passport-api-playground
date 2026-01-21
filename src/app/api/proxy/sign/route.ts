import { NextRequest, NextResponse } from 'next/server';

const SIGN_PROTOCOL_BASE = 'https://mainnet-rpc.sign.global';

export async function GET(request: NextRequest) {
  return handleProxy(request, 'GET');
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
  const targetUrl = `${SIGN_PROTOCOL_BASE}${targetPath}${queryString ? `?${queryString}` : ''}`;

  try {
    // Make the proxied request - no API key needed for Sign Protocol
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Get response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Proxy-Status': response.status.toString(),
      },
    });
  } catch (error) {
    console.error('Sign Protocol proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy request failed' },
      { status: 500 }
    );
  }
}

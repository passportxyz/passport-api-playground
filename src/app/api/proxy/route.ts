import { NextRequest, NextResponse } from 'next/server';

const PASSPORT_API_BASE = 'https://api.passport.xyz';
const API_KEY = process.env.PASSPORT_API_KEY;

export async function GET(request: NextRequest) {
  return handleProxy(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxy(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxy(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request, 'DELETE');
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

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key not configured on server' },
      { status: 500 }
    );
  }

  // Build the target URL
  // Remove the 'path' param from query string, keep others
  const targetSearchParams = new URLSearchParams(searchParams);
  targetSearchParams.delete('path');
  const queryString = targetSearchParams.toString();
  const targetUrl = `${PASSPORT_API_BASE}${targetPath}${queryString ? `?${queryString}` : ''}`;

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

    // Make the proxied request
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
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
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy request failed' },
      { status: 500 }
    );
  }
}

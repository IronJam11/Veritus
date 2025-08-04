import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string[] } }
) {
  try {
    const hash = params.hash.join('/');
    
    if (!hash) {
      return NextResponse.json({ error: 'Hash is required' }, { status: 400 });
    }

    // List of IPFS gateways to try
    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      `https://dweb.link/ipfs/${hash}`,
      `https://nftstorage.link/ipfs/${hash}`,
      `https://4everland.io/ipfs/${hash}`,
      `https://cf-ipfs.com/ipfs/${hash}`,
      `https://ipfs.io/ipfs/${hash}`,
      `https://cloudflare-ipfs.com/ipfs/${hash}`,
      `https://gateway.ipfs.io/ipfs/${hash}`
    ];

    // Try each gateway
    for (const gatewayUrl of gateways) {
      try {
        const headers: HeadersInit = {
          'Accept': 'application/json, image/*, */*',
        };

        // Add authorization for Pinata gateway
        if (gatewayUrl.includes('gateway.pinata.cloud') && process.env.PINATA_JWT) {
          headers['Authorization'] = `Bearer ${process.env.PINATA_JWT}`;
        }

        const response = await fetch(gatewayUrl, {
          headers,
          // 10 second timeout
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          // Get the content type
          const contentType = response.headers.get('content-type') || 'application/octet-stream';
          
          // Get the response data
          const data = await response.arrayBuffer();
          
          // Return the data with proper headers
          return new NextResponse(data, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${gatewayUrl}:`, error);
        continue;
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch from all IPFS gateways' },
      { status: 404 }
    );
  } catch (error) {
    console.error('IPFS proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

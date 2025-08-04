/**
 * Utility functions for handling IPFS URLs and gateways
 */

// List of IPFS gateways in order of preference
const IPFS_GATEWAYS = [
  process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud",
  "https://dweb.link",
  "https://nftstorage.link", 
  "https://4everland.io/ipfs",
  "https://cf-ipfs.com",
  "https://ipfs.io",
  "https://cloudflare-ipfs.com",
  "https://gateway.ipfs.io"
];

/**
 * Extract IPFS hash from various IPFS URL formats
 */
export const extractIPFSHash = (url: string): string | null => {
  if (!url) return null;
  
  // Match various IPFS URL patterns
  const patterns = [
    /\/ipfs\/([a-zA-Z0-9]+)/,           // /ipfs/hash
    /^(Qm[a-zA-Z0-9]{44})$/,           // Direct hash starting with Qm
    /^(baf[a-zA-Z0-9]+)$/,             // CIDv1 hash starting with baf
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Convert any IPFS URL to use a reliable gateway
 */
export const getReliableIPFSUrl = (url: string): string => {
  if (!url) return "";
  
  const hash = extractIPFSHash(url);
  if (!hash) return url; // Return original if we can't extract hash
  
  // Use the primary gateway
  return `${IPFS_GATEWAYS[0]}/ipfs/${hash}`;
};

/**
 * Generate multiple gateway URLs for fallback loading
 */
export const getIPFSGatewayUrls = (url: string): string[] => {
  const hash = extractIPFSHash(url);
  if (!hash) return [url];
  
  return IPFS_GATEWAYS.map(gateway => `${gateway}/ipfs/${hash}`);
};

/**
 * Fetch content from IPFS with fallback gateways
 */
export const fetchFromIPFS = async (url: string): Promise<Response> => {
  const gatewayUrls = getIPFSGatewayUrls(url);
  
  for (const gatewayUrl of gatewayUrls) {
    try {
      console.log(`Trying to fetch from: ${gatewayUrl}`);
      
      // Prepare headers - add auth for Pinata gateway
      const headers: HeadersInit = {
        'Accept': 'application/json, image/*, */*',
      };
      
      // Add authorization for Pinata gateway
      if (gatewayUrl.includes('gateway.pinata.cloud') && process.env.NEXT_PUBLIC_PINATA_JWT) {
        headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;
      }
      
      const response = await fetch(gatewayUrl, {
        // Add timeout and headers for better reliability
        signal: AbortSignal.timeout(15000), // 15 second timeout for better reliability
        headers
      });
      
      if (response.ok) {
        console.log(`Successfully fetched from: ${gatewayUrl}`);
        return response;
      }
      
      console.warn(`Failed to fetch from ${gatewayUrl}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.warn(`Error fetching from ${gatewayUrl}:`, error);
    }
  }
  
  throw new Error(`Failed to fetch from all IPFS gateways for URL: ${url}`);
};

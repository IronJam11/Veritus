import React, { useState } from 'react';
import { fetchFromIPFS, getReliableIPFSUrl, getIPFSGatewayUrls } from '@/utils/ipfs/gateway';

interface IPFSDebugProps {
  asset: {
    nftTokenId: string;
    metadataURI: string;
    title: string;
  };
}

export const IPFSDebugComponent: React.FC<IPFSDebugProps> = ({ asset }) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testMetadata = async () => {
    setLoading(true);
    const results: any = {
      originalUrl: asset.metadataURI,
      reliableUrl: getReliableIPFSUrl(asset.metadataURI),
      gatewayUrls: getIPFSGatewayUrls(asset.metadataURI),
      fetchResults: []
    };

    // Test all gateways
    for (const url of results.gatewayUrls) {
      try {
        const startTime = Date.now();
        const response = await fetch(url, { 
          signal: AbortSignal.timeout(5000),
          headers: { 'Accept': 'application/json' }
        });
        const endTime = Date.now();
        
        if (response.ok) {
          const data = await response.json();
          results.fetchResults.push({
            url,
            status: 'success',
            responseTime: endTime - startTime,
            hasImage: !!data.image,
            imageUrl: data.image,
            metadata: data
          });
        } else {
          results.fetchResults.push({
            url,
            status: 'failed',
            error: `HTTP ${response.status}: ${response.statusText}`,
            responseTime: endTime - startTime
          });
        }
      } catch (error) {
        results.fetchResults.push({
          url,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setDebugInfo(results);
    setLoading(false);
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '16px', 
      margin: '8px 0',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h4>IPFS Debug for Asset #{asset.nftTokenId}</h4>
      <p><strong>Title:</strong> {asset.title}</p>
      <p><strong>Metadata URI:</strong> {asset.metadataURI}</p>
      
      <button 
        onClick={testMetadata}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test IPFS Access'}
      </button>

      {debugInfo && (
        <div style={{ marginTop: '16px' }}>
          <h5>Results:</h5>
          <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
            <pre style={{ 
              background: '#f0f0f0', 
              padding: '8px', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div style={{ marginTop: '12px' }}>
            <h6>Gateway Status:</h6>
            {debugInfo.fetchResults.map((result: any, index: number) => (
              <div key={index} style={{ 
                padding: '4px 8px', 
                margin: '4px 0',
                borderRadius: '4px',
                backgroundColor: result.status === 'success' ? '#d4edda' : '#f8d7da'
              }}>
                <strong>{result.status === 'success' ? '✅' : '❌'} {result.url}</strong>
                {result.responseTime && <span> ({result.responseTime}ms)</span>}
                {result.error && <div style={{ fontSize: '11px', color: '#721c24' }}>{result.error}</div>}
                {result.hasImage && <div style={{ fontSize: '11px', color: '#155724' }}>✅ Has image: {result.imageUrl}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IPFSDebugComponent;

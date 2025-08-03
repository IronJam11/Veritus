"use client";

import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';

export default function AssetNFTAddressPage() {
  const { useGetAssetNFTContractAddress } = useAssetPlatformContract();
  
  const { 
    data: contractAddress, 
    isLoading, 
    isError, 
    error 
  } = useGetAssetNFTContractAddress();

  if (isLoading) {
    return <div>Loading contract address...</div>;
  }

  if (isError) {
    return (
      <div>
        <h1>Error loading contract address</h1>
        <p>{error?.message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Asset NFT Contract Address</h1>
      <div>
        <strong>Contract Address:</strong>
        <p>{contractAddress ? contractAddress.toString() : 'No address found'}</p>
      </div>
    </div>
  );
}
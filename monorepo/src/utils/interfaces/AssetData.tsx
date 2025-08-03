export interface AssetData {
  title: string;
  description: string;
  assetType: number;
  creator: string;
  ipId: string;
  shareTokenAddress: string;
  metadataURI: string;
  verificationStatus: number;
  totalRoyaltiesCollected: bigint;
  yes_votes: bigint;
  no_votes: bigint;
  licenseTermsId: bigint;
  nftTokenId: bigint;
  exists: boolean;
}

export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface ShareTokenData {
  contractAddress: string;
  currentSupply: bigint;
  totalSupply: bigint;
  name: string;
  symbol: string;
  owned: bigint;
  available: bigint;
  pricePerShare: bigint;
  isActive: boolean;
}

export interface AssetPageProps {
  params: {
    id: string;
  };
}
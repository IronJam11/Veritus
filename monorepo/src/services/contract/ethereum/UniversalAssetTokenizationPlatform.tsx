
"use client";

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { PLATFORM_ABI } from '@/utils/constants/abi/UniversalAssetTokenizationPlatform';
import { UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS } from '@/utils/constants/contracts';
import { Abi } from 'viem';
import { get } from 'http';

const TYPED_PLATFORM_ABI = PLATFORM_ABI as unknown as Abi;
export enum AssetType {
  MUSIC = 0,
  POETRY = 1,
  DANCE = 2,
  ART = 3,
  VIDEO = 4,
  WRITING = 5,
  CODE = 6,
  OTHER = 7
}

export enum VerificationStatus {
  PENDING = 0,
  VERIFIED = 1,
  REJECTED = 2
}

export interface Asset {
  nftTokenId: bigint;
  ipId: string;
  licenseTermsId: bigint;
  creator: string;
  assetType: AssetType;
  title: string;
  description: string;
  metadataURI: string;
  shareTokenAddress: string;
  totalRoyaltiesCollected: bigint;
  exists: boolean;
  verificationStatus: VerificationStatus;
  yes_votes: bigint;
  no_votes: bigint;
}

export interface CreatorProfile {
  wallet: string;
  verifiedPlatforms: string[];
  assetsCreated: bigint;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  profilephotoIPFS: string;
  bio: string;
  platformName: string;
}

export interface RoyaltyDistribution {
  totalAmount: bigint;
  timestamp: bigint;
  claimedAmount: bigint;
}

export const useAssetPlatformContract = () => {
  const { address, isConnected, chainId } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const executeTransaction = (contractCall: any) => {
    if (!Array.isArray(PLATFORM_ABI)) {
      throw new Error('Invalid ABI: must be an array');
    }
    return writeContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS as `0x${string}`,
      abi: PLATFORM_ABI,
      ...contractCall,
    });
  };

  const registerCreator = async (name: string, profilePhotoIPFS: string, bio: string) => {
    try {
      const result = await executeTransaction({
        functionName: 'registerCreator',
        args: [name, profilePhotoIPFS, bio],
      });
      return result;
    } catch (error) {
      console.error('Error in registerCreator:', error);
      throw error;
    }
  };

  const useGetAsset = (assetId: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getAsset',
      args: [assetId],
      chainId: chainId,
    });
  };

  const useGetAllAssets = () => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getAllAssets',
      chainId: chainId,
    });
  };

  const useGetCreatorAssets = (creator: string) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getCreatorAssets',
      args: [creator],
      chainId: chainId,
    });
  };

  const useAllUserAssets = () => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getAllUserAssets',
      chainId: chainId,
    });
  };


  const useGetUserShares = (user: string, assetId: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getUserShares',
      args: [user, assetId],
      chainId: chainId,
    });
  };

  const useGetAssetNFTContractAddress = () => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getAssetNFTAddress',
      chainId: chainId,
    });
  };

  

  const useGetCreatorBasicInfo = (creator: string) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getCreatorBasicInfo',
      args: [creator],
      chainId: chainId,
    });
  };

  const useGetRoyaltyDistributionCount = (assetId: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getRoyaltyDistributionCount',
      args: [assetId],
      chainId: chainId,
    });
  };

  const useGetRoyaltyDistribution = (assetId: bigint, distributionIndex: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getRoyaltyDistribution',
      args: [assetId, distributionIndex],
      chainId: chainId,
    });
  };

  const useIsPlatformVerified = (creator: string, platform: string) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'isPlatformVerified',
      args: [creator, platform],
      chainId: chainId,
    });
  };

  const useAssetRoyaltyBalance = (assetId: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'assetRoyaltyBalance',
      args: [assetId],
      chainId: chainId,
    });
  };

  const useCreators = (creator: string) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'creators',
      args: [creator],
      chainId: chainId,
    });
  };

  const useAssets = (assetId: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'assets',
      args: [assetId],
      chainId: chainId,
    });
  };
  const createAsset = (
    assetType: AssetType,
    title: string,
    description: string,
    metadataURI: string,
    creatorSharesPercent: bigint,
    pricePerShare: bigint,
    commercialRevSharePercent: bigint
  ) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'createAsset',
      args: [
        assetType,
        title,
        description,
        metadataURI,
        creatorSharesPercent,
        pricePerShare,
        commercialRevSharePercent
      ],
    });
  };

  const buyAssetShares = (assetId: bigint, shareAmount: bigint, value: bigint) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'buyAssetShares',
      args: [assetId, shareAmount],
      value: value,
    });
  };

  const depositRoyalties = (assetId: bigint, value: bigint) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'depositRoyalties',
      args: [assetId],
      value: value,
    });
  };

  const distributeRoyalties = (assetId: bigint) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'distributeRoyalties',
      args: [assetId],
    });
  };

  // Claim royalties
  const claimRoyalties = (assetId: bigint, distributionIndex: bigint) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'claimRoyalties',
      args: [assetId, distributionIndex],
    });
  };

  const submitVerification = (platformUrl: string) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'submitVerification',
      args: [platformUrl],
    });
  };

  const updateCreatorProfileDetails = (name: string, profilePhotoIPFS: string, bio: string) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'updateCreatorProfileDetails',
      args: [name, profilePhotoIPFS, bio],
    });
  };

  const voteOnAsset = (assetId: bigint, vote: boolean) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'voteOnAsset',
      args: [assetId, vote],
    });
  };

  const reportUser = (user: string) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'reportUser',
      args: [user],
    });
  };

  const verifyCreator = (creator: string, platform: string) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'verifyCreator',
      args: [creator, platform],
    });
  };

  const updateAssetVerification = (assetId: bigint, status: VerificationStatus) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'updateAssetVerification',
      args: [assetId, status],
    });
  };

  const getUserDepositions = (user: string) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getUserDepositions',
      args: [user],
      chainId: chainId,
    });
  }

  const getDistributionsByAsset = (assetId: bigint) => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getAllDistributions',
      args: [assetId],
      account: address,
      chainId: chainId,
      blockTag: 'latest',
      query: { enabled: true, staleTime: 0 }
        });
  }

  const getAllUserAssets = () => {
    return useReadContract({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'getAllAssetShares',
      chainId: chainId,
    });
  }

  const updatePlatformFee = (newFeePercent: bigint) => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'updatePlatformFee',
      args: [newFeePercent],
    });
  };

  const withdrawPlatformFees = () => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'withdrawPlatformFees',
    });
  };

  const pause = () => {
    executeTransaction({
      address: UNIVERSAL_ASSET_TOKENIZATION_PLATFORM_CONTRACT_ADDRESS,
      abi: TYPED_PLATFORM_ABI,
      functionName: 'pause',
    });
  };

  return {
    address,
    isConnected,
    chainId,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    useGetAsset,
    useGetAllAssets,
    useGetCreatorAssets,
    useGetUserShares,
    useGetCreatorBasicInfo,
    useGetRoyaltyDistributionCount,
    useGetRoyaltyDistribution,
    useIsPlatformVerified,
    useAssetRoyaltyBalance,
    useCreators,
    useGetAssetNFTContractAddress,
    useAssets,
    registerCreator,
    createAsset,
    buyAssetShares,
    getUserDepositions,
    getAllUserAssets,
    useAllUserAssets,
    depositRoyalties,
    distributeRoyalties,
    claimRoyalties,
    submitVerification,
    updateCreatorProfileDetails,
    voteOnAsset,
    reportUser,
    verifyCreator,
    updateAssetVerification,
    updatePlatformFee,
    withdrawPlatformFees,
    pause,
    getDistributionsByAsset,
  };
};

export const assetTypeToString = (assetType: AssetType): string => {
  const types = ['MUSIC', 'POETRY', 'DANCE', 'ART', 'VIDEO', 'WRITING', 'CODE', 'OTHER'];
  return types[assetType] || 'OTHER';
};

export const stringToAssetType = (str: string): AssetType => {
  const types = ['MUSIC', 'POETRY', 'DANCE', 'ART', 'VIDEO', 'WRITING', 'CODE', 'OTHER'];
  const index = types.indexOf(str.toUpperCase());
  return index !== -1 ? (index as AssetType) : AssetType.OTHER;
};

export const verificationStatusToString = (status: VerificationStatus): string => {
  const statuses = ['PENDING', 'VERIFIED', 'REJECTED'];
  return statuses[status] || 'PENDING';
};

// Helper function to format Wei to Ether
export const formatEther = (wei: bigint): string => {
  return (Number(wei) / 1e18).toString();
};
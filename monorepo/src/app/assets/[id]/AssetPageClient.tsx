"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Users, TrendingUp, Shield, Vote, DollarSign, FileText, Globe, Copy, Check } from 'lucide-react';
import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';
import { useAssetShareTokenContract } from '@/services/contract/ethereum/AssetShareToken';
import { useTheme } from '@/context/ThemeContext';
import AssetOverview from '@/components/AssetPage/AssetOverview';
import BlockchainOverview from '@/components/AssetPage/BlockchainOverviews';
import VotingSection from '@/components/AssetPage/VotingSecton';
import ShareTokenComponent from '@/components/AssetPage/ShareTokenComponent';
import { AssetData, AssetMetadata, ShareTokenData} from '@/utils/interfaces/AssetData';
import { useAccount } from 'wagmi';
import ShareHolders from '@/components/AssetPage/ShareHolders';
import DistributionsComponent from '@/components/AssetPage/distributions';



interface AssetPageClientProps {
  id: string;
}

export default function AssetClientPage({ id }: AssetPageClientProps) {
  const { address } = useAccount();
  const [copiedAddress, setCopiedAddress] = useState('');
  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [shareTokenData, setShareTokenData] = useState<ShareTokenData | null>(null);
  const [verifiers, setVerifiers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { themeClasses: theme } = useTheme();
  const { 
    useGetAsset,
    getDistributionsByAsset,
    error: contractError
  } = useAssetPlatformContract();

  const { data: asset, isLoading: assetLoading, error: assetError } = useGetAsset(BigInt(id));
  const shareTokenAddress = assetData?.shareTokenAddress;
  const { useGetTokenDetails, useGetBalanceOf , usegetAllShareholders, useGetTotalSupply} = useAssetShareTokenContract(shareTokenAddress ?? '');

  const { data: shareTokenDetails, isLoading: shareTokenLoading, error: shareTokenError } = useGetTokenDetails();
  const { data: shareTokenBalance, isLoading: shareTokenBalanceLoading, error: shareTokenBalanceError } = useGetBalanceOf(address ? address.toString() : '');
  const { data: shareholders, isLoading: shareholdersLoading, error: shareholdersError } = usegetAllShareholders();
  const { data: totalSupply, isLoading: totalSupplyLoading, error: totalSupplyError } = useGetTotalSupply();
  const { data: distributions, isLoading: distributionsLoading, error: distributionsError } = getDistributionsByAsset(assetData?.nftTokenId || BigInt(0));

  useEffect(() => {
    if (asset && Array.isArray(asset)) {
      try {
        const assetDetails = asset[0];
        const verifiersList = asset[1] || [];
        
        if (assetDetails && typeof assetDetails === 'object') {
          setAssetData({
            title: assetDetails.title || '',
            description: assetDetails.description || '',
            assetType: assetDetails.assetType || 0,
            creator: assetDetails.creator || '',
            ipId: assetDetails.ipId || '',
            shareTokenAddress: assetDetails.shareTokenAddress || '',
            metadataURI: assetDetails.metadataURI || '',
            verificationStatus: assetDetails.verificationStatus || 0,
            totalRoyaltiesCollected: assetDetails.totalRoyaltiesCollected || BigInt(0),
            yes_votes: assetDetails.yes_votes || BigInt(0),
            no_votes: assetDetails.no_votes || BigInt(0),
            licenseTermsId: assetDetails.licenseTermsId || BigInt(0),
            nftTokenId: assetDetails.nftTokenId || BigInt(0),
            exists: assetDetails.exists || false
          });
          setVerifiers(Array.isArray(verifiersList) ? verifiersList : []);
        }
      } catch (err) {
        console.error('Error processing asset data:', err);
        setError('Failed to process asset data');
      }
    }
  }, [asset]);

  useEffect(() => {
    if (shareTokenDetails && Array.isArray(shareTokenDetails)) {
      try {
        setShareTokenData({
          contractAddress: shareTokenDetails[0] as string || '',
          currentSupply: shareTokenDetails[1] as bigint || BigInt(0),
          totalSupply: totalSupply as bigint || BigInt(0),
          name: shareTokenDetails[3] as string || '',
          symbol: shareTokenDetails[4] as string || '',
          owned: shareTokenBalance as bigint || BigInt(0),
          available: shareTokenDetails[6] as bigint || BigInt(0),
          pricePerShare: shareTokenDetails[7] as bigint || BigInt(0),
          isActive: shareTokenDetails[8] as boolean || false
        });
      } catch (err) {
        console.error('Error processing share token data:', err);
        setError('Failed to process share token data');
      }
    }
  }, [shareTokenDetails]);

  useEffect(() => {
    setIsLoading(assetLoading || shareTokenLoading);
  }, [assetLoading, shareTokenLoading]);

  useEffect(() => {
    if (assetError || shareTokenError || contractError) {
      setError(assetError?.message || shareTokenError?.message || contractError?.message || 'An error occurred');
    }
  }, [assetError, shareTokenError, contractError]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} p-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-neutral-700 rounded-xl"></div>
                <div className="h-32 bg-neutral-700 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-neutral-700 rounded-xl"></div>
                <div className="h-32 bg-neutral-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assetData) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} p-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
            <p className={theme.textMuted}>
              {error || 'Unable to load asset details. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const votePercentage = assetData.yes_votes + assetData.no_votes > BigInt(0)
      ? Number((assetData.yes_votes * BigInt(100)) / (assetData.yes_votes + assetData.no_votes))
      : 0;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      <div className="border-b" style={{ borderColor: theme.border }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              className={`p-2 rounded-lg border transition-colors ${theme.walletDisconnected}`}
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{assetData.title}</h1>
              <p className={theme.textMuted}>Asset ID: {id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AssetOverview assetData={assetData} />
            <BlockchainOverview assetData={assetData} copiedAddress={copiedAddress} copyToClipboard={copyToClipboard} />
            <VotingSection assetData={assetData} copiedAddress={''} copyToClipboard={function (address: string, type: string): void {
              throw new Error('Function not implemented.');
            } } />
            {Array.isArray(distributions) && (
              <DistributionsComponent assetData={assetData} distributions={distributions} />
            )}
          </div>
          <div className="space-y-6">
            {shareTokenData && (
              <ShareTokenComponent assetData={assetData} shareTokenData={shareTokenData} />
            )}
            {shareTokenData && (
              <ShareHolders assetData={assetData} shareholders={shareholders} shareTokenData={shareTokenData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
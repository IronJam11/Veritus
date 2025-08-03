import React, { useState, useEffect, JSX } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { addressExists } from '@/services/isVoted';
import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';
import { useAssetServices } from '@/services/frontend/ethereum/buyAssets';
import { Link } from 'lucide-react';
export interface Asset {
  nftTokenId: string;
  ipId: string;
  licenseTermsId: string;
  creator: string;
  assetType: number;
  title: string;
  description: string;
  metadataURI: string;
  shareTokenAddress: string;
  totalRoyaltiesCollected: string;
  exists: boolean;
  verificationStatus: number;
  yes_votes: string;
  no_votes: string;
}

interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface AssetCardProps {
  asset: Asset;
  vote: boolean;
  verifiers: string[];
  address: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, vote, verifiers, address}) => {
  const { themeClasses: theme , isDarkMode} = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const {voteOnAsset, isPending, isConfirming, isConfirmed, error } = useAssetPlatformContract();
  const { buyShares, isPending: buyPending, isConfirming: buyConfirming, isConfirmed: buyConfirmed, error: buyError } = useAssetServices();

  // Fetch metadata when component mounts
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!asset.metadataURI) return;
      
      try {
        const response = await fetch(asset.metadataURI);
        const data: AssetMetadata = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error('Failed to fetch metadata:', error);
      }
    };

    fetchMetadata();
  }, [asset.metadataURI]);

  const getAssetTypeLabel = (assetType: number) => {
    const types = ['Digital Art', 'Music', 'Video', 'Document', 'Software', 'Other'];
    return types[assetType] || 'Unknown';
  };

  const getAssetTypeIcon = (assetType: number) => {
    const icons: { [key: number]: JSX.Element } = {
      0: ( 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      1: ( 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      2: ( 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      3: ( 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      4: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      5: ( 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    };
    return icons[assetType] || icons[5];
  };

  const getVerificationStatusConfig = (status: number) => {
    switch (status) {
      case 0: return { 
        label: 'Pending',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
      case 1: return { 
        label: 'Verified',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
      case 2: return { 
        label: 'Rejected',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
      default: return { 
        label: 'Unknown',
        color: theme.textSecondary,
        bgColor: theme.hoverBg,
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
  };

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    
    if (platformLower.includes('youtube')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    }
    
    if (platformLower.includes('twitter') || platformLower.includes('x.com')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    }
    
    if (platformLower.includes('instagram')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    }
    
    if (platformLower.includes('tiktok')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.6z"/>
        </svg>
      );
    }
    
    if (platformLower.includes('discord')) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg>
      );
    }
    
    // Default link icon
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    );
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTokenAmount = (amount: string) => {
    if (!amount || amount === '0') return '0';
    const value = parseFloat(amount) / Math.pow(10, 18);
    return value.toFixed(4);
  };

  const getTotalVotes = () => {
    const yesVotes = parseInt(asset.yes_votes) || 0;
    const noVotes = parseInt(asset.no_votes) || 0;
    return yesVotes + noVotes;
  };

  const getVotePercentage = (votes: string, total: number) => {
    if (total === 0) return 0;
    return ((parseInt(votes) || 0) / total) * 100;
  };

  const statusConfig = getVerificationStatusConfig(asset.verificationStatus);
  const socialLinks = metadata?.attributes?.filter(attr => 
    attr.trait_type.toLowerCase().includes('youtube') ||
    attr.trait_type.toLowerCase().includes('twitter') ||
    attr.trait_type.toLowerCase().includes('instagram') ||
    attr.trait_type.toLowerCase().includes('tiktok') ||
    attr.trait_type.toLowerCase().includes('discord') ||
    attr.trait_type.toLowerCase().includes('website') ||
    attr.trait_type.toLowerCase().includes('link')
  ) || [];

  if(address != asset.creator) return null;

  return (
  <div 
    className="group relative rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer w-full max-w-md"
    style={{ 
      backgroundColor: theme.paper,
      border: `1px solid ${theme.border}`,
      boxShadow: isHovered 
        ? `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` 
        : `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
      overflow: 'hidden'
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* Hover overlay effect */}
    <div 
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{ 
        background: `linear-gradient(135deg, ${theme.scanLine}20 0%, ${theme.scanLine}00 100%)`,
        boxShadow: `inset 0 0 30px ${theme.scanLine}10`
      }}
    />
    
    <div className="relative">
      {/* Image Section */}
      {metadata?.image && (
        <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
          {imageLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-transparent to-black/10"
              style={{ backgroundColor: theme.hoverBg }}
            >
              <div 
                className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" 
                style={{ borderColor: theme.textPrimary }}
              ></div>
            </div>
          )}
          {!imageError ? (
            <img
              src={metadata.image}
              alt={metadata.name || asset.title}
              className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
              style={{ backgroundColor: theme.hoverBg, color: theme.textSecondary }}
            >
              <div className="text-center p-6">
                <svg className="w-16 h-16 mx-auto mb-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Image not available</p>
              </div>
            </div>
          )}
          
          {/* Status Badge Overlay */}
          <div className="absolute top-4 right-4">
            <div 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-sm"
              style={{ 
                color: statusConfig.color,
                backgroundColor: `${statusConfig.bgColor}CC`,
                border: `1px solid ${statusConfig.color}30`,
                boxShadow: `0 2px 8px ${statusConfig.color}10`
              }}
            >
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Asset Type and Title */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
              {getAssetTypeIcon(asset.assetType)}
            </div>
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: theme.textSecondary }}>
              {getAssetTypeLabel(asset.assetType)}
            </span>
          </div>
          <h3 
            className="text-xl font-bold mb-3 line-clamp-2 group-hover:underline underline-offset-4 transition-all duration-200" 
            style={{ color: theme.textPrimary }}
          >
            {metadata?.name || asset.title}
          </h3>
          <p 
            className="text-sm line-clamp-3 leading-relaxed mb-4" 
            style={{ color: theme.textSecondary }}
          >
            {metadata?.description || asset.description}
          </p>
        </div>

        {/* Social Links Section */}
        {socialLinks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-xs font-medium tracking-wide" style={{ color: theme.textSecondary }}>SOCIAL LINKS</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-[1.03] hover:shadow-sm"
                  style={{ 
                    backgroundColor: theme.hoverBg,
                    color: theme.textPrimary,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  {getSocialIcon(link.trait_type)}
                  <span className="capitalize">{link.trait_type}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md" style={{ backgroundColor: theme.hoverBg }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="text-xs font-medium tracking-wide" style={{ color: theme.textSecondary }}>TOKEN ID</span>
            </div>
            <p className="text-sm font-semibold tracking-wide" style={{ color: theme.textPrimary }}>
              #{asset.nftTokenId}
            </p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md" style={{ backgroundColor: theme.hoverBg }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xs font-medium tracking-wide" style={{ color: theme.textSecondary }}>ROYALTIES</span>
            </div>
            <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
              {formatTokenAmount(asset.totalRoyaltiesCollected)} ETH
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              style={{ 
                backgroundColor: theme.hoverBg,
                border: `1px solid ${theme.border}`
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <Link href={`/user/${asset.creator}`}>
              <span className="text-xs font-medium block tracking-wide mb-0.5" style={{ color: theme.textSecondary }}>CREATED BY</span>
              <span className="text-sm font-semibold tracking-wide" style={{ color: theme.textPrimary }}>
                {formatAddress(asset.creator)}
              </span>
              </Link>
            </div>
          </div>
        </div>

        {asset.verificationStatus === 0 && (
          <div 
            className="mb-2 p-5 rounded-xl border" 
            style={{ 
              backgroundColor: theme.hoverBg,
              borderColor: theme.border
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium tracking-wide" style={{ color: theme.textPrimary }}>
                COMMUNITY VERIFICATION
              </span>
            </div>

            {addressExists(verifiers, address?.toString() || '') ? (
              <>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                <button onClick={() => voteOnAsset(BigInt(asset.nftTokenId), true)} className={`group bg-gradient-to-r ${theme.accent} ${isDarkMode ? 'text-black hover:from-neutral-200 hover:to-neutral-400' : 'text-white hover:from-neutral-800 hover:to-neutral-900'} px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDarkMode ? 'hover:shadow-white/25' : 'hover:shadow-black/25'} flex items-center gap-2`}>
                 Verify
               </button>
                <button onClick={() => voteOnAsset(BigInt(asset.nftTokenId), false)} className={`group bg-gradient-to-r ${theme.accent} ${isDarkMode ? 'text-black hover:from-neutral-200 hover:to-neutral-400' : 'text-white hover:from-neutral-800 hover:to-neutral-900'} px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isDarkMode ? 'hover:shadow-white/25' : 'hover:shadow-black/25'} flex items-center gap-2`}>
                 Report
               </button>
               </div>
              </>
            )}
            {}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                      Yes ({asset.yes_votes})
                    </span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                    {getVotePercentage(asset.yes_votes, getTotalVotes()).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${getVotePercentage(asset.yes_votes, getTotalVotes())}%`,
                      boxShadow: `0 2px 4px `
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                    <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                      No ({asset.no_votes})
                    </span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: theme.textSecondary }}>
                    {getVotePercentage(asset.no_votes, getTotalVotes()).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${getVotePercentage(asset.no_votes, getTotalVotes())}%`,
                      boxShadow: `0 2px 4px `
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div 
            className="mb-2 p-5 rounded-xl border" 
            style={{ 
              backgroundColor: theme.hoverBg,
              borderColor: theme.border
            }}
          >
              <button
                    onClick={async () => {
                      try {
                        await buyShares(BigInt(asset.nftTokenId), BigInt(1), BigInt(100));
                      } catch (e) {
                      }
                    }}
                    className={`group bg-gradient-to-r ${theme.accent} ${
                      isDarkMode
                        ? 'text-black hover:from-neutral-200 hover:to-neutral-400'
                        : 'text-white hover:from-neutral-800 hover:to-neutral-900'
                    } px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                      isDarkMode ? 'hover:shadow-white/25' : 'hover:shadow-black/25'
                    } flex items-center gap-2`}
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Buy Tokens"}
                  </button>
          </div>
      </div>


    </div>
  </div>
);
}
export default AssetCard;
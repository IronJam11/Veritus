"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';
import AssetCard, { Asset } from '@/components/AssetCard';
import toast from 'react-hot-toast';



export default function AssetsPage() {
    const { themeClasses: theme } = useTheme();
    const {
        useGetAllAssets,
        isPending,
        isConfirming,
        isConfirmed,
        error
    } = useAssetPlatformContract();

    const { data: assetsData, isLoading: assetsLoading, error: assetsError } = useGetAllAssets();
    console.log(assetsData);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<number | null>(null);

    // Use the assets data from the hook
    const assets = Array.isArray(assetsData) ? assetsData : [];

    // Filter assets based on search and filters
    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            asset.asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            asset.asset.creator.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === null || asset.asset.assetType === filterType;
        const matchesStatus = filterStatus === null || asset.asset.verificationStatus === filterStatus;
        
        return matchesSearch && matchesType && matchesStatus && asset.asset.exists;
    });

    const getAssetTypeOptions = () => [
        { value: null, label: 'All Types' },
        { value: 0, label: 'Digital Art' },
        { value: 1, label: 'Music' },
        { value: 2, label: 'Video' },
        { value: 3, label: 'Document' },
        { value: 4, label: 'Software' },
        { value: 5, label: 'Other' }
    ];

    const getStatusOptions = () => [
        { value: null, label: 'All Statuses' },
        { value: 0, label: 'Pending' },
        { value: 1, label: 'Verified' },
        { value: 2, label: 'Rejected' }
    ];

    // useEffect(() => {
    //     if (isPending) {
    //       toast.loading("Processing claim transaction...", { id: "claimTxStatus" });
    //     } else if (isConfirming) {
    //       toast.loading("Waiting for confirmation...", { id: "claimTxStatus" });
    //     } else if (isConfirmed) {
    //       toast.success("Royalties claimed successfully! Amount transferred to your wallet.", { id: "claimTxStatus" });
    //       window.location.reload(); 
    //     } else if (error) {
    //       toast.error(`Failed to claim royalties: ${error.message || error}`, { id: "claimTxStatus" });
    //     } else if (!isPending && !isConfirming && !isConfirmed && !error) {
    //       // Clean up toast when all states are false (idle state)
    //       toast.dismiss("claimTxStatus");
    //     }
    //   }, [isPending, isConfirming, isConfirmed, error]);

    if (assetsLoading || isPending) {
        return (
            <div className={`min-h-screen ${theme.bg}`} style={{ color: theme.textPrimary }}>
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center h-96">
                        {/* Enhanced loading spinner */}
                        <div className="relative">
                            <div 
                                className="animate-spin rounded-full h-16 w-16 border-4 border-transparent"
                                style={{ 
                                    borderTopColor: theme.textPrimary,
                                    borderRightColor: theme.textSecondary 
                                }}
                            ></div>
                            <div 
                                className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 opacity-20"
                                style={{ borderColor: theme.textPrimary }}
                            ></div>
                        </div>
                        <div className="mt-8 text-center">
                            <h2 className="text-xl font-medium mb-2" style={{ color: theme.textPrimary }}>
                                Loading Digital Assets
                            </h2>
                            <p style={{ color: theme.textSecondary }}>
                                Fetching assets from the blockchain...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || assetsError) {
        return (
            <div className={`min-h-screen ${theme.bg}`} style={{ color: theme.textPrimary }}>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-md mx-auto">
                        <div 
                            className="rounded-2xl p-8 text-center backdrop-blur-sm"
                            style={{ 
                                backgroundColor: theme.paper,
                                border: `1px solid ${theme.border}`
                            }}
                        >
                            <div className="mb-6">
                                <div 
                                    className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: theme.hoverBg }}
                                >
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ef4444' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
                                    Unable to Load Assets
                                </h2>
                                <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                                    {(error?.message || assetsError?.message) || 'There was an error connecting to the blockchain. Please check your connection and try again.'}
                                </p>
                            </div>
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                                style={{ 
                                    backgroundColor: theme.textPrimary,
                                    color: theme.background,
                                    border: `1px solid ${theme.textPrimary}`
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.bg}`} style={{ color: theme.textPrimary }}>
            <div className="container mx-auto px-4 py-8">
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent" 
                        style={{ backgroundImage: `linear-gradient(to right, ${theme.textPrimary}, ${theme.textSecondary})` }}>
                        Digital Assets
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: theme.textSecondary }}>
                        Explore and manage tokenized digital assets on the decentralized platform
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: theme.hoverBg }}>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                                {assets.length} Assets Available
                            </span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters Section */}
                <div className="mb-8">
                    <div 
                        className="rounded-2xl backdrop-blur-sm p-6 md:p-8"
                        style={{ 
                            backgroundColor: theme.paper,
                            border: `1px solid ${theme.border}`
                        }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Search - Takes more space */}
                            <div className="lg:col-span-6">
                                <label className="block text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
                                    Search Assets
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by title, description, or creator..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        style={{ 
                                            backgroundColor: theme.background,
                                            borderColor: theme.border,
                                            color: theme.textPrimary
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Asset Type Filter */}
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
                                    Asset Type
                                </label>
                                <select
                                    value={filterType ?? ''}
                                    onChange={(e) => setFilterType(e.target.value === '' ? null : parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{ 
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                        color: theme.textPrimary
                                    }}
                                >
                                    {getAssetTypeOptions().map(option => (
                                        <option key={option.value} value={option.value ?? ''} style={{ backgroundColor: theme.background }}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-medium mb-3" style={{ color: theme.textSecondary }}>
                                    Verification Status
                                </label>
                                <select
                                    value={filterStatus ?? ''}
                                    onChange={(e) => setFilterStatus(e.target.value === '' ? null : parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{ 
                                        backgroundColor: theme.background,
                                        borderColor: theme.border,
                                        color: theme.textPrimary
                                    }}
                                >
                                    {getStatusOptions().map(option => (
                                        <option key={option.value} value={option.value ?? ''} style={{ backgroundColor: theme.background }}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Enhanced Results Summary */}
                        <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${theme.border}` }}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>
                                        Showing {filteredAssets.length} of {assets.length} assets
                                    </span>
                                    {filteredAssets.length !== assets.length && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="text-sm" style={{ color: theme.textSecondary }}>
                                                Filtered
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {(searchTerm || filterType !== null || filterStatus !== null) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterType(null);
                                            setFilterStatus(null);
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                        style={{ 
                                            backgroundColor: theme.hoverBg,
                                            color: theme.textSecondary,
                                            border: `1px solid ${theme.border}`
                                        }}
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assets Grid or Empty State */}
                {filteredAssets.length === 0 ? (
                    <div className="text-center py-16">
                        <div 
                            className="max-w-md mx-auto rounded-2xl p-8 backdrop-blur-sm"
                            style={{ 
                                backgroundColor: theme.paper,
                                border: `1px solid ${theme.border}`
                            }}
                        >
                            <div className="mb-6">
                                <div 
                                    className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: theme.hoverBg }}
                                >
                                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: theme.textSecondary }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3" style={{ color: theme.textPrimary }}>
                                    {assets.length === 0 ? 'No Assets Yet' : 'No Matching Assets'}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                                    {assets.length === 0 
                                        ? 'No digital assets have been tokenized on the platform yet. Be the first to create one!' 
                                        : 'No assets match your current search and filter criteria. Try adjusting your filters or search terms.'}
                                </p>
                            </div>
                            {assets.length === 0 ? (
                                <button 
                                    className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                                    onClick={() => window.location.href = '/add-asset'}
                                    style={{ 
                                        backgroundColor: theme.textPrimary,
                                        color: theme.background,
                                        border: `1px solid ${theme.textPrimary}`
                                    }}
                                >
                                    Create First Asset
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterType(null);
                                        setFilterStatus(null);
                                    }}
                                    className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                                    style={{ 
                                        backgroundColor: theme.hoverBg,
                                        color: theme.textPrimary,
                                        border: `1px solid ${theme.border}`
                                    }}
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAssets.map((asset) => (
                            <AssetCard key={asset.asset.nftTokenId} asset={asset.asset} vote={asset.vote} verifiers={asset.verifiers} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
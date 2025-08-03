import React, { useState, useEffect, JSX } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getAssetTypeLabel } from '@/utils/getAssetLabel';
import { getVerificationStatusLabel } from '@/utils/getVerificationStatusLabel';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { FileText, ExternalLink, Loader2, Youtube, Twitter, Instagram, Facebook, Linkedin, Github, Globe, Link } from 'lucide-react';

interface MetadataAttribute {
  trait_type: string;
  value: string;
}

interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: MetadataAttribute[];
}

export default function AssetOverview({ assetData }: { assetData: AssetData }): JSX.Element {
    const { themeClasses: theme } = useTheme();
    const [metadata, setMetadata] = useState<AssetMetadata | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            if (!assetData.metadataURI) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch(assetData.metadataURI);
                if (!response.ok) {
                    throw new Error('Failed to fetch metadata');
                }
                const data = await response.json();
                setMetadata(data);
            } catch (err) {
                setError('Failed to load metadata');
                console.error('Error fetching metadata:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, [assetData.metadataURI]);

    const getSocialIcon = (url: string, size: number = 16) => {
        const lowerUrl = url.toLowerCase();
        
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
            return <Youtube size={size} className="text-red-500" />;
        }
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
            return <Twitter size={size} className="text-blue-400" />;
        }
        if (lowerUrl.includes('instagram.com')) {
            return <Instagram size={size} className="text-pink-500" />;
        }
        if (lowerUrl.includes('facebook.com')) {
            return <Facebook size={size} className="text-blue-600" />;
        }
        if (lowerUrl.includes('linkedin.com')) {
            return <Linkedin size={size} className="text-blue-700" />;
        }
        if (lowerUrl.includes('github.com')) {
            return <Github size={size} className="text-gray-800 dark:text-gray-200" />;
        }
        if (lowerUrl.includes('discord.com') || lowerUrl.includes('discord.gg')) {
            return <Link size={size} className="text-indigo-500" />;
        }
        if (lowerUrl.includes('reddit.com')) {
            return <Link size={size} className="text-orange-500" />;
        }
        if (lowerUrl.includes('tiktok.com')) {
            return <Link size={size} className="text-black dark:text-white" />;
        }
        if (lowerUrl.includes('telegram.org') || lowerUrl.includes('t.me')) {
            return <Link size={size} className="text-blue-500" />;
        }
        
        // Default icons for other URLs
        return <Globe size={size} className="text-gray-500" />;
    };

    const renderAttributeValue = (attribute: MetadataAttribute) => {
        const isUrl = attribute.value.startsWith('http://') || attribute.value.startsWith('https://');
        
        if (isUrl) {
            const icon = getSocialIcon(attribute.value);
            const domain = new URL(attribute.value).hostname.replace('www.', '');
            
            return (
                <a 
                    href={attribute.value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${theme.accent} hover:underline flex items-center gap-2 group transition-colors`}
                >
                    {icon}
                    <span className="truncate">{domain}</span>
                    <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
            );
        }
        
        return <span className="break-words">{attribute.value}</span>;
    };

    return(
        <div className="rounded-xl p-6 border" style={{ 
              background: theme.paper,
              borderColor: theme.border 
            }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText size={20} />
                Asset Overview
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Asset Image */}
                {metadata?.image && (
                    <div className="lg:col-span-1">
                        <label className={`text-sm font-medium ${theme.textMuted} block mb-2`}>Asset Image</label>
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: theme.border }}>
                            <img 
                                src={metadata.image} 
                                alt={metadata.name || assetData.title}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}
                
                {/* Asset Details */}
                <div className={`${metadata?.image ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Title</label>
                            <p className="text-lg font-semibold">{assetData.title}</p>
                        </div>
                        
                        <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Type</label>
                            <p className="text-lg">{getAssetTypeLabel(assetData.assetType)}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Description</label>
                            <p className="text-base mt-1">{assetData.description}</p>
                        </div>
                        
                        <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Verification Status</label>
                            <p className={`font-semibold ${getVerificationStatusLabel(assetData.verificationStatus).color}`}>
                                {getVerificationStatusLabel(assetData.verificationStatus).label}
                            </p>
                        </div>
                        
                        <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Total Royalties</label>
                            <p className="text-lg font-semibold">{formatBigInt(assetData.totalRoyaltiesCollected)} WEI</p>
                        </div>
                    </div>
                </div>
              </div>

              {/* Metadata Attributes */}
              {loading && (
                  <div className="mt-6 flex items-center justify-center py-4">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <span className={theme.textMuted}>Loading metadata...</span>
                  </div>
              )}

              {error && (
                  <div className="mt-6 p-4 rounded-lg" style={{ background: "#FFCDD2"+ '20', color: "#B71C1C" }}>
                      {error}
                  </div>
              )}

              {metadata?.attributes && metadata.attributes.length > 0 && (
                  <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Asset Attributes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {metadata.attributes.map((attribute, index) => (
                              <div 
                                  key={index}
                                  className="p-4 rounded-lg border"
                                  style={{ 
                                      background: theme.background,
                                      borderColor: theme.border 
                                  }}
                              >
                                  <label className={`text-sm font-medium ${theme.textMuted} block mb-2 capitalize`}>
                                      {attribute.trait_type.replace(/_/g, ' ')}
                                  </label>
                                  <div className="text-sm">
                                      {renderAttributeValue(attribute)}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>
    )
}
import React, { JSX } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getAssetTypeLabel } from '@/utils/getAssetLabel';
import { getVerificationStatusLabel } from '@/utils/getVerificationStatusLabel';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { Check, Copy, ExternalLink, FileText, Globe } from 'lucide-react';
import { formatAddress } from '@/utils/formatAddress';


export default function BlockchainOverview({ assetData, copiedAddress, copyToClipboard }: { assetData: AssetData, copiedAddress: string, copyToClipboard: (address: string, type: string) => void }): JSX.Element {
    const { themeClasses: theme } = useTheme();

    return(

        <div className="rounded-xl p-6 border" style={{ 
                      background: theme.paper,
                      borderColor: theme.border 
                    }}>
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Globe size={20} />
                        Blockchain Details
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Creator Address</label>
                            <p className="font-mono">{formatAddress(assetData.creator)}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(assetData.creator, 'creator')}
                            className={`p-2 rounded transition-colors ${theme.walletDisconnected}`}
                          >
                            {copiedAddress === 'creator' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        
                        {/* <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>IP ID</label>
                            <p className="font-mono">{formatAddress(assetData.ipId)}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(assetData.ipId, 'ipId')}
                            className={`p-2 rounded transition-colors ${theme.walletDisconnected}`}
                          >
                            {copiedAddress === 'ipId' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div> */}
                        
                        <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
                          <div>
                            <label className={`text-sm font-medium ${theme.textMuted}`}>Share Token Address</label>
                            <p className="font-mono">{formatAddress(assetData.shareTokenAddress)}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(assetData.shareTokenAddress, 'shareToken')}
                            className={`p-2 rounded transition-colors ${theme.walletDisconnected}`}
                          >
                            {copiedAddress === 'shareToken' ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
        
                        <div className="flex items-center gap-2">
                          <ExternalLink size={16} />
                          <a 
                            href={assetData.metadataURI} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View Metadata on IPFS
                          </a>
                        </div>
                      </div>
                    </div>
    );
}
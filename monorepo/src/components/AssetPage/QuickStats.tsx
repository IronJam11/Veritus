import React, { JSX } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getAssetTypeLabel } from '@/utils/getAssetLabel';
import { getVerificationStatusLabel } from '@/utils/getVerificationStatusLabel';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { Check, Copy, ExternalLink, FileText, Globe, Shield, Vote } from 'lucide-react';
import { formatAddress } from '@/utils/formatAddress';


export default function QuickStats({ assetData, verifiers }: { assetData: AssetData, verifiers: any  }): JSX.Element {
    const { themeClasses: theme } = useTheme();
    const votePercentage = assetData.yes_votes + assetData.no_votes > BigInt(0)
      ? Number((assetData.yes_votes * BigInt(100)) / (assetData.yes_votes + assetData.no_votes))
      : 0;

    return(
        <div className="rounded-xl p-6 border" style={{ 
              background: theme.paper,
              borderColor: theme.border 
            }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield size={20} />
                Quick Stats
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textMuted}>License Terms ID</span>
                  <span className="font-mono">{formatBigInt(assetData.licenseTermsId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>NFT Token ID</span>
                  <span className="font-mono">{formatBigInt(assetData.nftTokenId)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Verifiers</span>
                  <span className="font-semibold">{verifiers.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Status</span>
                  <span className={`font-semibold ${assetData.exists ? 'text-green-400' : 'text-red-400'}`}>
                    {assetData.exists ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
    );
}


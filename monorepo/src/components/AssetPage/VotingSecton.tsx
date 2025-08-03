import React, { JSX } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getAssetTypeLabel } from '@/utils/getAssetLabel';
import { getVerificationStatusLabel } from '@/utils/getVerificationStatusLabel';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { Check, Copy, ExternalLink, FileText, Globe, Vote } from 'lucide-react';
import { formatAddress } from '@/utils/formatAddress';


export default function VotingSection({ assetData, copiedAddress, copyToClipboard }: { assetData: AssetData, copiedAddress: string, copyToClipboard: (address: string, type: string) => void }): JSX.Element {
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
                <Vote size={20} />
                Community Voting
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
                  <p className="text-2xl font-bold text-green-500">{formatBigInt(assetData.yes_votes)}</p>
                  <p className={`text-sm ${theme.textMuted}`}>Yes Votes</p>
                </div>
                
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
                  <p className="text-2xl font-bold text-red-500">{formatBigInt(assetData.no_votes)}</p>
                  <p className={`text-sm ${theme.textMuted}`}>No Votes</p>
                </div>
                
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.hoverBg }}>
                  <p className="text-2xl font-bold">{votePercentage}%</p>
                  <p className={`text-sm ${theme.textMuted}`}>Approval Rate</p>
                </div>
              </div>
            </div>
    );
}




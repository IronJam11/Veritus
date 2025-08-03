import React, { JSX, use } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getAssetTypeLabel } from '@/utils/getAssetLabel';
import { getVerificationStatusLabel } from '@/utils/getVerificationStatusLabel';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { Check, Copy, ExternalLink, FileText, Globe, Shield, Vote, Users } from 'lucide-react';
import { formatAddress } from '@/utils/formatAddress';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { useDistributeFunds } from '@/services/frontend/ethereum/distributeFunds';


interface ShareTokenData {
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
export default function ShareHolders({ 
  assetData, 
  shareholders,
  shareTokenData
}: { 
  assetData: AssetData, 
  shareholders: any,
  shareTokenData: ShareTokenData
}): JSX.Element {
  const { themeClasses: theme } = useTheme();
  const { address } = useAccount();
  const shareholderAddresses = shareholders && shareholders[0] ? shareholders[0] : [];
  const shareholderAmounts = shareholders && shareholders[1] ? shareholders[1] : [];
  const shareAmount = calculateClaimEarning(address?.toString() || '', shareholders);
  console.log(shareAmount);

   const {
      distributeRoyalty,
    } = useDistributeFunds();

  function calculateClaimEarning(address: string, shareholders: any): bigint {
    const idx = shareholders && shareholders[0]
    ? shareholders[0].findIndex((a: string) => a.toLowerCase() === address.toLowerCase())
    : -1;
    const ownedShares = idx !== -1 ? shareholders[1][idx] : BigInt(0);
    const total = shareTokenData.totalSupply;
    const royalties = BigInt(assetData.totalRoyaltiesCollected);

    if (total === BigInt(0)) return BigInt(0);

    return (ownedShares * royalties) / total; 
  }

  const handleDistributeShares = async () => {
    try {
        await distributeRoyalty(
        assetData.nftTokenId);
    } catch (err: any) {
        console.error('Transaction error:', err);
    }
    }
    return(
    <div className="rounded-xl p-6 border" style={{
      background: theme.paper,
      borderColor: theme.border
    }}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Users size={20} />
        Shareholders
      </h2>
      
      <div className="space-y-4">
        <div className="bg-opacity-50 rounded-lg p-3 border" style={{
          backgroundColor: theme.background,
          borderColor: theme.border
        }}>
          <div className="flex justify-between items-center">
            <span className={theme.textMuted}>Total Shareholders</span>
            <span className="font-semibold text-lg">{shareholderAddresses.length}</span>
          </div>
        </div>
        {shareholderAddresses.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-2">Shareholder Details</h3>
            {shareholderAddresses.map((address: string, index: number) => (
              <div 
                key={index}
                className="flex justify-between items-center p-3 rounded-lg border"
                style={{
                  backgroundColor: theme.background,
                  borderColor: theme.border
                }}
              >
                <div className="flex flex-col">
                  <span className="font-mono text-sm">
                    {formatAddress(address)}
                  </span>
                  <span className={`text-xs ${theme.textMuted}`}>
                    Shareholder #{index + 1}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {shareholderAmounts[index] ? formatBigInt(shareholderAmounts[index]) : '0'}
                  </span>
                  <div className={`text-xs ${theme.textMuted}`}>shares</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users size={48} className={`mx-auto mb-3 ${theme.textMuted}`} />
            <p className={theme.textMuted}>No shareholders found</p>
          </div>
        )}
        
        {/* Asset Info */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.border }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Shield size={16} />
            Asset Information
          </h3>
          <div className="space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span className={theme.textMuted}>License Terms ID</span>
              <span className="font-mono">{formatBigInt(assetData.licenseTermsId)}</span>
            </div> */}
            <div className="flex justify-between">
              <span className={theme.textMuted}>NFT Token ID</span>
              <span className="font-mono">{formatBigInt(assetData.nftTokenId)}</span>
            </div>
            <div className="flex justify-between">
              <span className={theme.textMuted}>Status</span>
              <span className={`font-semibold ${assetData.exists ? 'text-green-400' : 'text-red-400'}`}>
                {assetData.exists ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <button 
        onClick={handleDistributeShares}
        className={`flex-1 bg-white text-black py-2 px-4 rounded-lg font-medium transition-colors`}>
              Distribute 
        </button>
      </div>
    </div>
  );
}
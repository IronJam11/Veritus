import React, {JSX, useEffect, useRef} from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getAssetTypeLabel } from '@/utils/getAssetLabel';
import { useAssetPlatformContract } from '@/services/contract/ethereum/UniversalAssetTokenizationPlatform';
import { getVerificationStatusLabel } from '@/utils/getVerificationStatusLabel';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { toast } from 'react-hot-toast';
import { FileText, Clock, CheckCircle, DollarSign, Loader2, AlertCircle } from 'lucide-react';

export default function DistributionsComponent({ 
  assetData, 
  distributions
}: { 
  assetData: AssetData, 
  distributions: any 
}): JSX.Element {
  const { themeClasses: theme } = useTheme();
  const { claimRoyalties, isPending, isConfirming, isConfirmed, error } = useAssetPlatformContract();

  // Handle the case where distributions might be empty or undefined
  if (!distributions || !distributions[0] || distributions[0].length === 0) {
    return (
      <div className={`${theme.bg} ${theme.text} p-6 rounded-lg border`} 
           style={{ borderColor: theme.border }}>
        <div className="text-center py-8">
          <FileText className={`mx-auto h-12 w-12 ${theme.textMuted} mb-4`} />
          <h3 className={`text-lg font-medium ${theme.text} mb-2`}>No Distributions Available</h3>
          <p className={theme.textMuted}>
            There are no royalty distributions for this asset yet.
          </p>
        </div>
      </div>
    );
  }

  const totalAmounts = distributions[0]; // uint256[] memory totalAmounts
  const timestamps = distributions[1];   // uint256[] memory timestamps  
  const claimed = distributions[2];      // bool[] memory claimed
  const claimableAmounts = distributions[3]; // uint256[] memory claimableAmounts
  const totalClaimable = distributions[4];   // uint256 totalClaimable

  const handleClaim = async (distributionIndex: number) => {
    try {
      // Convert assetData.id to bigint if it's not already
      const assetId = typeof assetData.nftTokenId=== 'bigint' ? assetData.nftTokenId: BigInt(assetData.nftTokenId);
      const distributionIndexBigInt = BigInt(distributionIndex);
      
      // Call the claimRoyalties function
      claimRoyalties(assetId, distributionIndexBigInt);
    } catch (err) {
      console.error('Failed to claim royalties:', err);
    }
  };

  const formatTimestamp = (timestamp: bigint | number) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

    const hasShownSuccessRef = useRef(false);

  // Handle transaction status with toast notifications
  useEffect(() => {
    if (isPending) {
      toast.loading("Processing claim transaction...", { id: "claimTxStatus" });
    } else if (isConfirming) {
      toast.loading("Waiting for confirmation...", { id: "claimTxStatus" });
    } else if (isConfirmed && !hasShownSuccessRef.current) {
      toast.success("Royalties claimed successfully! Amount transferred to your wallet.", { id: "claimTxStatus" });
      hasShownSuccessRef.current = true;
      window.location.reload(); 
    } else if (error) {
      toast.error(`Failed to claim royalties: ${error.message || error}`, { id: "claimTxStatus" });
    } else if (!isPending && !isConfirming && !isConfirmed && !error) {
      // Clean up toast when all states are false (idle state)
      toast.dismiss("claimTxStatus");
    }
  }, [isPending, isConfirming, isConfirmed, error]);

  return (
    <div className={`${theme.bg} p-6 rounded-lg`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${theme.text} mb-2`}>
          Royalty Distributions
        </h2>
        <p className={theme.textMuted}>
          Manage and claim your royalty distributions for this asset
        </p>
        
        {/* Total Claimable Summary */}
        {totalClaimable > BigInt(0) && (
          <div className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${theme.cardBg} border`}
               style={{ borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <DollarSign className={`h-5 w-5 ${theme.text}`} />
              <div>
                <h3 className={`font-semibold ${theme.text}`}>Total Claimable</h3>
                <p className={`text-lg font-bold ${theme.text}`}>
                  {formatBigInt(totalClaimable)} ETH
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Status Messages */}
        {isPending && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <p className="text-blue-800 dark:text-blue-200">
                Transaction pending... Please confirm in your wallet.
              </p>
            </div>
          </div>
        )}

        {isConfirming && (
          <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
              <p className="text-yellow-800 dark:text-yellow-200">
                Confirming transaction on the blockchain...
              </p>
            </div>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-green-800 dark:text-green-200">
                Royalties claimed successfully! The amount has been transferred to your wallet.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-red-800 dark:text-red-200">
                Failed to claim royalties: {error.message || 'Unknown error occurred'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Distribution Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {totalAmounts.map((totalAmount: bigint, index: number) => {
          const isClaimed = claimed[index];
          const claimableAmount = claimableAmounts[index];
          const timestamp = timestamps[index];
          const hasClaimableAmount = claimableAmount > BigInt(0);
          const isProcessing = isPending || isConfirming;

          return (
            <div
              key={index}
              className={`p-6 rounded-lg border bg-gradient-to-br ${theme.cardBg} transition-all duration-200 hover:shadow-lg`}
              style={{ borderColor: theme.border }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.text}`}>
                  Distribution #{index + 1}
                </h3>
                <div className="flex items-center gap-1">
                  {isClaimed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className={`h-5 w-5 ${theme.textMuted}`} />
                  )}
                </div>
              </div>

              {/* Distribution Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className={`text-sm ${theme.textMuted} mb-1`}>Total Distribution</p>
                  <p className={`font-medium ${theme.text}`}>
                    {formatBigInt(totalAmount)} WEI
                  </p>
                </div>

                <div>
                  <p className={`text-sm ${theme.textMuted} mb-1`}>Your Share</p>
                  <p className={`font-medium ${theme.text}`}>
                    {formatBigInt(claimableAmount)} WEI
                  </p>
                </div>

                <div>
                  <p className={`text-sm ${theme.textMuted} mb-1`}>Distribution Date</p>
                  <p className={`text-sm ${theme.text}`}>
                    {formatTimestamp(timestamp)}
                  </p>
                </div>

                <div>
                  <p className={`text-sm ${theme.textMuted} mb-1`}>Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isClaimed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : hasClaimableAmount
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {isClaimed ? 'Claimed' : hasClaimableAmount ? 'Available' : 'No Share'}
                  </span>
                </div>
              </div>

              {/* Claim Button */}
              <button
                onClick={() => handleClaim(index)}
                disabled={isClaimed || !hasClaimableAmount || isProcessing}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  isClaimed || !hasClaimableAmount || isProcessing
                    ? `${theme.textMuted} cursor-not-allowed border`
                    : `${theme.walletConnected} hover:scale-105 active:scale-95`
                }`}
                style={isClaimed || !hasClaimableAmount || isProcessing ? { borderColor: theme.border } : {}}
              >
                {isProcessing && hasClaimableAmount && !isClaimed ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isClaimed ? (
                  'Already Claimed'
                ) : hasClaimableAmount ? (
                  `Claim ${formatBigInt(claimableAmount)} WEI`
                ) : (
                  'No Claimable Amount'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className={`mt-6 p-4 rounded-lg border ${theme.textMuted}`}
           style={{ borderColor: theme.border, backgroundColor: theme.hoverBg }}>
        <p className="text-sm">
          <strong>Note:</strong> Distributions are automatically calculated based on your ownership percentage. 
          Once claimed, the amount will be transferred to your connected wallet. Make sure you have enough WEI 
          in your wallet to cover gas fees for the transaction.
        </p>
      </div>
    </div>
  );
}
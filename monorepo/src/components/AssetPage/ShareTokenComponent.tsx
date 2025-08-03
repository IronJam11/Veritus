import React, { JSX, use,useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { formatBigInt } from '@/utils/formatBigInt';
import { AssetData } from '@/utils/interfaces/AssetData';
import { TrendingUp, X } from 'lucide-react';
import { useAssetServices } from '@/services/frontend/ethereum/buyAssets';
import { useDepositServices } from '@/services/frontend/ethereum/depositEarnings';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

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

interface ShareTokenComponentProps {
  assetData: AssetData;
  shareTokenData: ShareTokenData;
}

export default function ShareTokenComponent({ 
  assetData, 
  shareTokenData
}: ShareTokenComponentProps): JSX.Element {
  const { themeClasses: theme } = useTheme();
  const { address } = useAccount();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showDepositModal, setshowDepositModal] = useState(false);
  const [shareAmount, setShareAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const { 
    buyShares, 
    isPending, 
    isConfirming, 
    error,
    isConfirmed,
  } = useAssetServices();

  const {
    depositRoyalty,
    isPending: isPendingDeposit,
    isConfirming: isConfirmingDeposit,
    error: errorDeposit
  } = useDepositServices();

  const calculateCost = (shares: string) => {
    if (!shares || isNaN(Number(shares)) || Number(shares) <= 0) {
      return { wei: BigInt(0), eth: '0' };
    }
    const sharesNum = BigInt(shares);
    const totalWei = sharesNum * shareTokenData.pricePerShare;
    const ethValue = (Number(totalWei) / 1e18).toFixed(6);
    return { wei: totalWei, eth: ethValue };
  };

   const calculateDepositCost = (deposit: string) => {
    if (!deposit || isNaN(Number(deposit)) || Number(deposit) <= 0) {
      return { wei: BigInt(0), eth: '0' };
    }
    const sharesNum = BigInt(deposit);
    const totalWei = deposit;
    const ethValue = (Number(totalWei) / 1e18).toFixed(6);
    return { wei: totalWei, eth: ethValue };
  };

  const cost = calculateCost(shareAmount);

  const Depositcost = calculateDepositCost(depositAmount);

  
    const handleBuyShares = async () => {
      try {
        if (!shareAmount || isNaN(Number(shareAmount)) || Number(shareAmount) <= 0) {
          toast.error("Please enter a valid share amount");
          return;
        }

        const shareAmountBigInt = BigInt(shareAmount);
        if (shareAmountBigInt > shareTokenData.available) {
          toast.error(`Insufficient shares available. Maximum: ${shareTokenData.available.toString()}`);
          return;
        }

        const totalCost = shareAmountBigInt * shareTokenData.pricePerShare;
        
        await buyShares(
          assetData.nftTokenId,
          shareAmountBigInt,
          shareTokenData.pricePerShare
        );

        // Close modal and reset form immediately
        setShowBuyModal(false);
        setShareAmount('');
        
      } catch (err: any) {
        console.error('Transaction error:', err);

      }
    };

    const handleDepositRoyalties = async () => {

    try {
        if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
        toast.error("Please enter a valid share amount");
        return;
        }
        const depositAmountBigInt = BigInt(depositAmount);
      
        await depositRoyalty(
        assetData.nftTokenId,
        depositAmountBigInt
        );
        setShowBuyModal(false);
        setShareAmount('');
        
    } catch (err: any) {
        console.error('Transaction error:', err);
    }
    };
    if(errorDeposit) {
      toast.error(
        typeof errorDeposit === 'string'
          ? errorDeposit
          : errorDeposit?.message || "Transaction error"
      );
    }


  const handleModalClose = () => {
    if (!isPending && !isConfirming) {
      setShowBuyModal(false);
      setShareAmount('');
      setDepositAmount('');
      setshowDepositModal(false);
    }
  };

  return (
    <>
      <div className="rounded-xl p-6 border" style={{ 
        background: theme.paper,
        borderColor: theme.border 
      }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Share Token
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium ${theme.textMuted}`}>Token Name</label>
            <p className="text-lg font-semibold">{shareTokenData.name}</p>
            <p className={`text-sm ${theme.textMuted}`}>({shareTokenData.symbol})</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium ${theme.textMuted}`}>Your Shares</label>
              <p className="text-lg font-bold text-blue-400">{formatBigInt(shareTokenData.owned)}</p>
            </div>
            
            <div>
              <label className={`text-sm font-medium ${theme.textMuted}`}>Available</label>
              <p className="text-lg font-bold text-green-400">{formatBigInt(shareTokenData.available)}</p>
            </div>
          </div>
          
          <div>
            <label className={`text-sm font-medium ${theme.textMuted}`}>Price per Share</label>
            <p className="text-2xl font-bold">{formatBigInt(shareTokenData.pricePerShare)} wei</p>
          </div>
          
          <div className="pt-2 border-t" style={{ borderColor: theme.border }}>
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${theme.textMuted}`}>Supply</span>
              <span className="text-sm font-medium">
                {formatBigInt(shareTokenData.totalSupply)}
              </span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Number(shareTokenData.totalSupply) / 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              onClick={() => setShowBuyModal(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${theme.walletConnected}`}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? 'Processing...' : 'Buy Shares'}
            </button>

           { assetData.creator == address &&  
           <button 
              onClick={() => setshowDepositModal(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${theme.walletDisconnected}`}
              disabled={isPending || isConfirming}
            >
              Deposit Earnings 
            </button>}
          </div>
           <div className="text-sm text-blue-400 mt-2">
                Please recheck the wallet address in the users links before buying shares
            </div>
        </div>
      </div>

      {/* Buy Shares Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl p-6 w-full max-w-md border"
            style={{ 
              background: theme.paper,
              borderColor: theme.border 
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Buy Shares</h3>
              <button
                onClick={handleModalClose}
                disabled={isPending || isConfirming}
                className={`p-1 rounded-lg transition-colors ${theme.textMuted} hover:bg-neutral-700`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${theme.textMuted} block mb-2`}>
                  Number of Shares
                </label>
                <input
                  type="number"
                  value={shareAmount}
                  onChange={(e) => setShareAmount(e.target.value)}
                  placeholder="Enter number of shares"
                  min="1"
                  max={shareTokenData.available.toString()}
                  disabled={isPending || isConfirming}
                  className={`w-full p-3 rounded-lg border font-medium transition-colors ${theme.textMuted}`}
                  style={{
                    background: theme.background,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }}
                />
                <p className={`text-xs mt-1 ${theme.textMuted}`}>
                  Available: {formatBigInt(shareTokenData.available)} shares
                </p>
              </div>

              {shareAmount && !isNaN(Number(shareAmount)) && Number(shareAmount) > 0 && (
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.border }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme.textMuted}`}>Total Cost:</span>
                    <div className="text-right">
                      <p className="font-bold text-lg">{cost.eth} ETH</p>
                      <p className={`text-xs ${theme.textMuted}`}>{cost.wei.toString()} wei</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme.textMuted}`}>Price per Share:</span>
                    <span className="text-sm font-medium">
                      {(Number(shareTokenData.pricePerShare) / 1e18).toFixed(6)} ETH
                    </span>
                  </div>
                  <div className={`text-xs ${theme.textMuted} mt-2 p-2 rounded bg-blue-500 bg-opacity-10`}>
                    💡 Contract automatically refunds any excess ETH sent
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2 rounded-lg bg-red-500 bg-opacity-20 text-red-300 text-sm">
                  {error.message || "Transaction error occurred"}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleModalClose}
                  disabled={isPending || isConfirming}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${theme.walletDisconnected}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyShares}
                  disabled={isPending || isConfirming || !shareAmount || isNaN(Number(shareAmount)) || Number(shareAmount) <= 0}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isPending || isConfirming || !shareAmount || isNaN(Number(shareAmount)) || Number(shareAmount) <= 0
                      ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                      : theme.walletConnected
                  }`}
                >
                  {isPending || isConfirming ? 'Processing...' : 'Buy Shares'}
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Earnings Modal */}

       {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-xl p-6 w-full max-w-md border"
            style={{ 
              background: theme.paper,
              borderColor: theme.border 
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Deposit to {assetData.title}</h3>
              <button
                onClick={handleModalClose}
                disabled={isPending || isConfirming}
                className={`p-1 rounded-lg transition-colors ${theme.textMuted} hover:bg-neutral-700`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${theme.textMuted} block mb-2`}>
                  Amount in wei
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter the amount to be deposited in wei"
                  disabled={isPending || isConfirming}
                  className={`w-full p-3 rounded-lg border font-medium transition-colors ${theme.textMuted}`}
                  style={{
                    background: theme.background,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }}
                />
              </div>

              {depositAmount && !isNaN(Number(depositAmount)) && Number(depositAmount) > 0 && (
                <div className="p-3 rounded-lg border" style={{ borderColor: theme.border }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme.textMuted}`}>Total Cost:</span>
                    <div className="text-right">
                      <p className="font-bold text-lg">{Depositcost.eth} ETH</p>
                      <p className={`text-xs ${theme.textMuted}`}>{Depositcost.wei.toString()} wei</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-2 rounded-lg bg-red-500 bg-opacity-20 text-red-300 text-sm">
                  {error.message || "Transaction error occurred"}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleModalClose}
                  disabled={isPending || isConfirming}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${theme.walletDisconnected}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDepositRoyalties}
                  disabled={isPending || isConfirming || !depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isPending || isConfirming || !depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0
                      ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                      : theme.walletConnected
                  }`}
                >
                  {isPending || isConfirming ? 'Processing...' : 'Deposit Earnings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
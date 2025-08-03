import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ASSET_SHARE_TOKEN_ABI } from '@/utils/constants/abi/AssetShareToken';
import { Abi } from 'viem';

const TYPED_ASSET_SHARE_TOKEN_ABI = ASSET_SHARE_TOKEN_ABI as unknown as Abi;

export interface ShareAllocation {
  creatorShares: bigint;
  publicShares: bigint;
  pricePerShare: bigint;
  saleActive: boolean;
}

export interface ShareTokenInfo {
  name: string;
  symbol: string;
  totalSupply: bigint;
  decimals: number;
  platform: string;
  assetId: bigint;
  totalShares: bigint;
  allocation: ShareAllocation;
}


export const useAssetShareTokenContract = (contractAddress: string) => {
  const { address, isConnected, chainId } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const executeTransaction = (contractCall: any) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      ...contractCall,
    });
  };

  const useGetName = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'name',
      chainId: chainId,
    });
  };

  const useGetSymbol = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'symbol',
      chainId: chainId,
    });
  };

  const useGetDecimals = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'decimals',
      chainId: chainId,
    });
  };

  const useGetTokenDetails = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'getContractDetails',
      chainId: chainId,
    });
  };

  const useGetTotalSupply = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'totalSupply',
      chainId: chainId,
    });
  };

  const useGetBalanceOf = (accountAddress: string) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [accountAddress],
      chainId: chainId,
    });
  };

  const useGetAllowance = (ownerAddress: string, spenderAddress: string) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'allowance',
      args: [ownerAddress, spenderAddress],
      chainId: chainId,
    });
  };

  const useGetPlatform = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'PLATFORM',
      chainId: chainId,
    });
  };

  const useGetAssetId = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'ASSET_ID',
      chainId: chainId,
    });
  };

  const useGetTotalShares = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'TOTAL_SHARES',
      chainId: chainId,
    });
  };

  const useGetAllocation = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'allocation',
      chainId: chainId, 
    });
  };

  const useGetRemainingShares = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'getRemainingShares',
      chainId: chainId,
    });
  };

  const useGetOwner = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'owner',
      chainId: chainId,
    });
  };

  const usegetAllShareholders = () => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: TYPED_ASSET_SHARE_TOKEN_ABI,
      functionName: 'getAllShareholders',
      chainId: chainId,
    });
  };

  const buyShares = (shareAmount: bigint, value: bigint) => {
    executeTransaction({
      functionName: 'buyShares',
      args: [shareAmount],
      value,
    });
  };

  
  const toggleSale = () => {
    executeTransaction({
      functionName: 'toggleSale',
      args: [],
    });
  };

  const updatePrice = (newPrice: bigint) => {
    executeTransaction({
      functionName: 'updatePrice',
      args: [newPrice],
    });
  };

  const transfer = (to: string, amount: bigint) => {
    executeTransaction({
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  const transferFrom = (from: string, to: string, amount: bigint) => {
    executeTransaction({
      functionName: 'transferFrom',
      args: [from, to, amount],
    });
  };

  const approve = (spender: string, amount: bigint) => {
    executeTransaction({
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  const renounceOwnership = () => {
    executeTransaction({
      functionName: 'renounceOwnership',
      args: [],
    });
  };

  const transferOwnership = (newOwner: string) => {
    executeTransaction({
      functionName: 'transferOwnership',
      args: [newOwner],
    });
  };

  const calculateTotalCost = (shareAmount: bigint, pricePerShare: bigint): bigint => {
    return shareAmount * pricePerShare;
  };

  const getCompleteTokenInfo = async (): Promise<ShareTokenInfo | null> => {
    try {
      const [
        nameResult,
        symbolResult,
        totalSupplyResult,
        decimalsResult,
        platformResult,
        assetIdResult,
        totalSharesResult,
        allocationResult
      ] = await Promise.all([
        useGetName(),
        useGetSymbol(),
        useGetTotalSupply(),
        useGetDecimals(),
        useGetPlatform(),
        useGetAssetId(),
        useGetTotalShares(),
        useGetAllocation(),
        useGetTokenDetails()
      ]);

      if (
        nameResult.data &&
        symbolResult.data &&
        totalSupplyResult.data &&
        decimalsResult.data &&
        platformResult.data &&
        assetIdResult.data &&
        totalSharesResult.data &&
        allocationResult.data
      ) {
        return {
          name: nameResult.data as string,
          symbol: symbolResult.data as string,
          totalSupply: totalSupplyResult.data as bigint,
          decimals: decimalsResult.data as number,
          platform: platformResult.data as string,
          assetId: assetIdResult.data as bigint,
          totalShares: totalSharesResult.data as bigint,
          allocation: allocationResult.data as ShareAllocation
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching complete token info:', error);
      return null;
    }
  };

  const canBuyShares = (shareAmount: bigint, userBalance: bigint, pricePerShare: bigint, remainingShares: bigint): boolean => {
    const totalCost = calculateTotalCost(shareAmount, pricePerShare);
    return (
      shareAmount > 0 &&
      shareAmount <= remainingShares &&
      userBalance >= totalCost
    );
  };

  return {
    address,
    isConnected,
    chainId,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    contractAddress,
    useGetName,
    useGetSymbol,
    useGetDecimals,
    useGetTokenDetails,
    useGetTotalSupply,
    useGetBalanceOf,
    useGetAllowance,
    useGetPlatform,
    useGetAssetId,
    useGetTotalShares,
    useGetAllocation,
    useGetRemainingShares,
    usegetAllShareholders,
    useGetOwner,
    buyShares,
    toggleSale,
    updatePrice,
    transfer,
    transferFrom,
    approve,
    renounceOwnership,
    transferOwnership,
    calculateTotalCost,
    getCompleteTokenInfo,
    canBuyShares,
  };
};
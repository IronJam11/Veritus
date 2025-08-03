import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ASSET_NFT_ABI } from '@/utils/constants/abi/AssetNFT';
import { ASSET_NFT_CONTRACT_ADDRESS } from '@/utils/constants/contracts';
import { Abi } from 'viem';

const TYPED_ASSET_NFT_ABI = ASSET_NFT_ABI as unknown as Abi;

export interface TokenInfo {
  tokenId: bigint;
  owner: string;
  tokenURI: string;
}
export const useAssetNFTContract = () => {
  const { address, isConnected, chainId } = useAccount();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const executeTransaction = (contractCall: any) => {
    writeContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      ...contractCall,
    });
  };

  const useGetTokenURI = (tokenId: bigint) => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'tokenURI',
      args: [tokenId],
      chainId: chainId,
    });
  };

  const useGetOwnerOf = (tokenId: bigint) => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'ownerOf',
      args: [tokenId],
      chainId: chainId,
    });
  };

  const useGetBalanceOf = (ownerAddress: string) => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'balanceOf',
      args: [ownerAddress],
      chainId: chainId,
    });
  };

  const useGetNextTokenId = () => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'nextTokenId',
      chainId: chainId,
    });
  };

  const useGetApproved = (tokenId: bigint) => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'getApproved',
      args: [tokenId],
      chainId: chainId,
    });
  };

  const useIsApprovedForAll = (ownerAddress: string, operatorAddress: string) => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'isApprovedForAll',
      args: [ownerAddress, operatorAddress],
      chainId: chainId,
    });
  };

  const useGetName = () => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'name',
      chainId: chainId,
    });
  };

  const useGetSymbol = () => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'symbol',
      chainId: chainId,
    });
  };

  const useGetOwner = () => {
    return useReadContract({
      address: ASSET_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: TYPED_ASSET_NFT_ABI,
      functionName: 'owner',
      chainId: chainId,
    });
  };

  const mint = (to: string, tokenURI: string) => {
    executeTransaction({
      functionName: 'mint',
      args: [to, tokenURI],
    });
  };

  const approve = (to: string, tokenId: bigint) => {
    executeTransaction({
      functionName: 'approve',
      args: [to, tokenId],
    });
  };

  const setApprovalForAll = (operator: string, approved: boolean) => {
    executeTransaction({
      functionName: 'setApprovalForAll',
      args: [operator, approved],
    });
  };

  const transferFrom = (from: string, to: string, tokenId: bigint) => {
    executeTransaction({
      functionName: 'transferFrom',
      args: [from, to, tokenId],
    });
  };

  const safeTransferFrom = (from: string, to: string, tokenId: bigint, data?: string) => {
    executeTransaction({
      functionName: 'safeTransferFrom',
      args: data ? [from, to, tokenId, data] : [from, to, tokenId],
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

  const getTokenInfo = async (tokenId: bigint): Promise<TokenInfo | null> => {
    try {
      const [owner, tokenURI] = await Promise.all([
        useGetOwnerOf(tokenId),
        useGetTokenURI(tokenId)
      ]);

      if (owner.data && tokenURI.data) {
        return {
          tokenId,
          owner: owner.data as string,
          tokenURI: tokenURI.data as string
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
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
    useGetTokenURI,
    useGetOwnerOf,
    useGetBalanceOf,
    useGetNextTokenId,
    useGetApproved,
    useIsApprovedForAll,
    useGetName,
    useGetSymbol,
    useGetOwner,
    mint,
    approve,
    setApprovalForAll,
    transferFrom,
    safeTransferFrom,
    renounceOwnership,
    transferOwnership,
    getTokenInfo,
  };
};
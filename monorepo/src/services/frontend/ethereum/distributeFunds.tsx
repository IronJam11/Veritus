import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAssetPlatformContract } from "@/services/contract/ethereum/UniversalAssetTokenizationPlatform";

export const useDistributeFunds = () => {
  const {
    distributeRoyalties,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useAssetPlatformContract();

  // Track if we've already shown success toast
  const hasShownSuccessRef = useRef(false);

  const distributeRoyalty = async (
    assetId: bigint,
  ) => {
    try {
      // Reset success flag when starting new transaction
      hasShownSuccessRef.current = false;
      
      const result = await distributeRoyalties(assetId);
      return result;
    } catch (err: any) {
      console.error("Distribute royalty error:", err);

      let errorMessage = "Failed to distribute royalty";

      if (err?.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (err?.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction";
      } else if (err?.message?.includes("execution reverted")) {
        errorMessage = "Transaction failed - please check contract conditions";
      } else if (err?.message?.includes("network")) {
        errorMessage = "Network error - please try again";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };


  useEffect(() => {
    if (isPending) {
      toast.loading("Processing distribution...", { id: "distributeTxStatus" });
    } else if (isConfirming) {
      toast.loading("Waiting for confirmation...", { id: "distributeTxStatus" });
    } else if (isConfirmed && !hasShownSuccessRef.current) {
      toast.success("Royalty distributed successfully!", { id: "distributeTxStatus" });
      hasShownSuccessRef.current = true;
      window.location.reload(); 
    } else if (error) {
      toast.error(`Transaction failed: ${error.message || error}`, { id: "distributeTxStatus" });
    } else if (!isPending && !isConfirming && !isConfirmed && !error) {
      toast.dismiss("distributeTxStatus");
    }
  }, [isPending, isConfirming, isConfirmed, error]);

  return {
    distributeRoyalty,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAssetPlatformContract } from "@/services/contract/ethereum/UniversalAssetTokenizationPlatform";

export const useDepositServices = () => {
  const {
    depositRoyalties,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useAssetPlatformContract();

  // Track if we've already shown success toast
  const hasShownSuccessRef = useRef(false);

  const depositRoyalty = async (
    assetId: bigint,
    amount: bigint
  ) => {
    try {
      if (amount <= BigInt(0)) {
        throw new Error("Amount must be greater than 0");
      }

      hasShownSuccessRef.current = false;
      
      const result = await depositRoyalties(assetId, amount);
      return result;
    } catch (err: any) {
      console.error("Deposit royalty error:", err);

      let errorMessage = "Failed to deposit royalty";

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

  // Show toast based on transaction status
  useEffect(() => {
    if (isPending) {
      toast.loading("Processing transaction...", { id: "depositTxStatus" });
    } else if (isConfirming) {
      toast.loading("Waiting for confirmation...", { id: "depositTxStatus" });
    } else if (isConfirmed && !hasShownSuccessRef.current) {
      toast.success("Royalty deposited successfully!", { id: "depositTxStatus" });
      hasShownSuccessRef.current = true;
      window.location.reload(); // Reload to reflect changes
    } else if (error) {
      toast.error(`Transaction failed: ${error.message || error}`, { id: "depositTxStatus" });
    } else if (!isPending && !isConfirming && !isConfirmed && !error) {
      // Clean up toast when all states are false (idle state)
      toast.dismiss("depositTxStatus");
    }
  }, [isPending, isConfirming, isConfirmed, error]);

  return {
    depositRoyalty,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
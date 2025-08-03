import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAssetPlatformContract } from "@/services/contract/ethereum/UniversalAssetTokenizationPlatform";

export const useAssetServices = () => {
  const {
    buyAssetShares: contractBuyAssetShares,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useAssetPlatformContract();

  // Track if we've already shown success toast
  const hasShownSuccessRef = useRef(false);

  const buyShares = async (
    assetId: bigint,
    shareAmount: bigint,
    pricePerShare: bigint
  ) => {
    try {
      const totalPrice = pricePerShare * shareAmount;

      if (shareAmount <= BigInt(0)) {
        throw new Error("Share amount must be greater than 0");
      }

      if (pricePerShare <= BigInt(0)) {
        throw new Error("Invalid price per share");
      }
      hasShownSuccessRef.current = false;
      
      const result = await contractBuyAssetShares(assetId, shareAmount, totalPrice);
      return result;
    } catch (err: any) {
      console.error("Buy shares error:", err);

      let errorMessage = "Failed to buy shares";

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
      toast.loading("Processing transaction...", { id: "txStatus" });
    } else if (isConfirming) {
      toast.loading("Waiting for confirmation...", { id: "txStatus" });
    } else if (isConfirmed && !hasShownSuccessRef.current) {
      toast.success("Transaction confirmed! Shares purchased successfully.", { id: "txStatus" });
      hasShownSuccessRef.current = true;
      window.location.reload(); // Reload to update UI after purchase
    } else if (error) {
      toast.error(`Transaction failed: ${error.message || error}`, { id: "txStatus" });
    } else if (!isPending && !isConfirming && !isConfirmed && !error) {
      toast.dismiss("txStatus");
    }
  }, [isPending, isConfirming, isConfirmed, error]);

  return {
    buyShares,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};
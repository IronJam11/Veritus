// import { useState } from "react";
// import { useAssetServices } from "@/hooks/useAssetServices";
// import { Modal } from "@/components/ui/Modal"; // Assuming you have a modal component
// import { Button } from "@/components/ui/Button"; // Assuming you have a button component
// import { Input } from "@/components/ui/input"; // Assuming you have an input component

// interface BuySharesModalProps {
//   assetId: bigint;
//   currentPricePerShare: bigint;
//   onClose: () => void;
// }

// export const BuySharesModal = ({
//   assetId,
//   currentPricePerShare,
//   onClose,
// }: BuySharesModalProps) => {
//   const [shareAmount, setShareAmount] = useState<string>("1");
//   const { buyShares, isPending } = useAssetServices();

//   const handleBuyShares = async () => {
//     try {
//       await buyShares(
//         assetId,
//         BigInt(shareAmount),
//         currentPricePerShare
//       );
//       onClose();
//     } catch (error) {
//       console.error("Failed to buy shares:", error);
//     }
//   };

//   return (
//     <Modal isOpen={true} onClose={onClose} title="Buy Shares">
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Number of Shares
//           </label>
//           <Input
//             type="number"
//             min="1"
//             value={shareAmount}
//             onChange={(e) => setShareAmount(e.target.value)}
//             disabled={isPending}
//           />
//         </div>
        
//         <div className="text-sm">
//           <p>Price per share: {currentPricePerShare.toString()} ETH</p>
//           <p className="font-semibold mt-1">
//             Total price: {(BigInt(shareAmount) * currentPricePerShare).toString()} ETH
//           </p>
//         </div>
        
//         <div className="flex justify-end gap-2 pt-4">
//           <Button variant="outline" onClick={onClose} disabled={isPending}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleBuyShares}
//             disabled={isPending || !shareAmount || shareAmount === "0"}
//             isLoading={isPending}
//           >
//             {isPending ? "Processing..." : "Confirm Purchase"}
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };
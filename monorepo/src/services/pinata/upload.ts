import { pinata } from "@/utils/ipfs/config";
import toast from "react-hot-toast";

export const uploadToIPFS = async (file: File) => {
  try {
    const keyRequest = await fetch("/api/key");
    const keyData = await keyRequest.json();
    const upload = await pinata.upload.file(file).key(keyData.JWT);
    
    // Use Pinata's gateway instead of generic IPFS gateway for better reliability
    const url = `${process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud"}/ipfs/${upload.IpfsHash}`;
    console.log("Uploaded to IPFS:", url); // Debug log
    return url;
  } catch (error) {
    console.error("IPFS upload error:", error);
    toast.error("Failed to upload file");
    throw error;
  }
};
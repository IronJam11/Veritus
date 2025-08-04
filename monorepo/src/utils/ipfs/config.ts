import { PinataSDK } from "pinata-web3";

// Initialize Pinata with fallback values to prevent crashes
export const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT || "dummy_jwt_token",
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud",
});
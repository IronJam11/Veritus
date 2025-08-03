import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UniversalAssetTokenizationModule = buildModule("UniversalAssetTokenizationModule", (m) => {
  const UniversalAssetTokenizationPlatform = m.contract("UniversalAssetTokenizationPlatform", []);

  // Fetch AssetNFT address after deployment
  const assetNFTAddress = m.call(UniversalAssetTokenizationPlatform, "ASSET_NFT");
  console.log(assetNFTAddress);

  // You can use assetNFTAddress for sequencing, but only return contract futures
  return { 
    UniversalAssetTokenizationPlatform
  };
});

export default UniversalAssetTokenizationModule;
export const PLATFORM_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "CreatorAlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidInput",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoClaimableRoyalties",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NoRoyaltiesToDistribute",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotCreatorOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "OnlyPlatformOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TransferFailed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ASSET_NFT",
      "outputs": [
        {
          "internalType": "contract AssetNFT",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_PLATFORM_FEE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "assetRoyaltyBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "assetToVerifiers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "assets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "nftTokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "ipId",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "licenseTermsId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "enum AssetType",
          "name": "assetType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "shareTokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalRoyaltiesCollected",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        },
        {
          "internalType": "enum VerificationStatus",
          "name": "verificationStatus",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "yes_votes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "no_votes",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "shareAmount",
          "type": "uint256"
        }
      ],
      "name": "buyAssetShares",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "name": "claimAllRoyalties",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "distributionIndex",
          "type": "uint256"
        }
      ],
      "name": "claimRoyalties",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum AssetType",
          "name": "assetType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataURI",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "creatorSharesPercent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pricePerShare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "commercialRevSharePercent",
          "type": "uint256"
        }
      ],
      "name": "createAsset",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "creators",
      "outputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "assetsCreated",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        },
        {
          "internalType": "enum VerificationStatus",
          "name": "verificationStatus",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "profilephotoIPFS",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "bio",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "platformName",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "name": "depositRoyalties",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "name": "distributeRoyalties",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "distributionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllAssetShares",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "nftTokenId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "ipId",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "licenseTermsId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "creator",
                  "type": "address"
                },
                {
                  "internalType": "enum AssetType",
                  "name": "assetType",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "title",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "metadataURI",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "shareTokenAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "totalRoyaltiesCollected",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "exists",
                  "type": "bool"
                },
                {
                  "internalType": "enum VerificationStatus",
                  "name": "verificationStatus",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "yes_votes",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "no_votes",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Asset",
              "name": "asset",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "balance",
              "type": "uint256"
            }
          ],
          "internalType": "struct UserAssets[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllAssets",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "nftTokenId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "ipId",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "licenseTermsId",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "creator",
                  "type": "address"
                },
                {
                  "internalType": "enum AssetType",
                  "name": "assetType",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "title",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "metadataURI",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "shareTokenAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "totalRoyaltiesCollected",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "exists",
                  "type": "bool"
                },
                {
                  "internalType": "enum VerificationStatus",
                  "name": "verificationStatus",
                  "type": "uint8"
                },
                {
                  "internalType": "uint256",
                  "name": "yes_votes",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "no_votes",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Asset",
              "name": "asset",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "vote",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "verifiers",
              "type": "address[]"
            }
          ],
          "internalType": "struct AssetWithVote[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "name": "getAllDistributions",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "totalAmounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "timestamps",
          "type": "uint256[]"
        },
        {
          "internalType": "bool[]",
          "name": "claimed",
          "type": "bool[]"
        },
        {
          "internalType": "uint256[]",
          "name": "claimableAmounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "totalClaimable",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllUserAssets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "nftTokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "ipId",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "licenseTermsId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "enum AssetType",
              "name": "assetType",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "metadataURI",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "shareTokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "totalRoyaltiesCollected",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            },
            {
              "internalType": "enum VerificationStatus",
              "name": "verificationStatus",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "yes_votes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "no_votes",
              "type": "uint256"
            }
          ],
          "internalType": "struct Asset[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "name": "getAsset",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "nftTokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "ipId",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "licenseTermsId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "creator",
              "type": "address"
            },
            {
              "internalType": "enum AssetType",
              "name": "assetType",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "metadataURI",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "shareTokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "totalRoyaltiesCollected",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            },
            {
              "internalType": "enum VerificationStatus",
              "name": "verificationStatus",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "yes_votes",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "no_votes",
              "type": "uint256"
            }
          ],
          "internalType": "struct Asset",
          "name": "",
          "type": "tuple"
        },
        {
          "internalType": "address[]",
          "name": "verifiers",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAssetNFTAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "getCreatorBasicInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "photo",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "bio",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isVerified",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserDepositions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct Deposition[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        }
      ],
      "name": "getUserShares",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC721Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platformFeePercent",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platformOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_profilephotoIPFS",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_bio",
          "type": "string"
        }
      ],
      "name": "registerCreator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "royaltyDistributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "totalAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalSharesAtDistribution",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_profilephotoIPFS",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_bio",
          "type": "string"
        }
      ],
      "name": "updateCreatorProfileDetails",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userDistributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userOwnsAssetShares",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userToDepositions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userToOwnedAssets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userToOwnedAssetsNFTIds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "assetId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "vote",
          "type": "bool"
        }
      ],
      "name": "voteOnAsset",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
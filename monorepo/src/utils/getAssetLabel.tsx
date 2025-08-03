import React from "react";


export const getAssetTypeLabel = (assetType: number) => {
    const types = ['Digital Art', 'Music', 'Video', 'Document', 'Software', 'Other'];
    return types[assetType] || 'Unknown';
  };
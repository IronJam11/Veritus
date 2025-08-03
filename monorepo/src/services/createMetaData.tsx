import react from 'react';
import { uploadToIPFS } from './pinata/upload';

export const createMetadata = async (imageUrl: string, formData: any, metadataAttributes: { key: string; value: string; }[]) => {
    const metadata = {
      name: formData.title,
      description: formData.description,
      image: imageUrl,
      attributes: metadataAttributes
        .filter((attr: { key: string; value: string; }) => attr.key.trim() && attr.value.trim())
        .map((attr: { key: string; value: string; }) => ({
          trait_type: attr.key.trim(),
          value: attr.value.trim()
        }))
    };
    const metadataJson = JSON.stringify(metadata, null, 2);
    const metadataBlob = new File([metadataJson], "metadata.json", {
      type: "application/json"
    });

    // Upload metadata to IPFS
    const metadataUrl = await uploadToIPFS(metadataBlob);
    return metadataUrl;
  };

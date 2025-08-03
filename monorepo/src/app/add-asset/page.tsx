"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAssetPlatformContract } from "@/services/contract/ethereum/UniversalAssetTokenizationPlatform";
import { uploadToIPFS } from "@/services/pinata/upload";
import toast from "react-hot-toast";
import { createMetadata } from "@/services/createMetaData";

enum AssetType {
  MUSIC = 0,
  POETRY = 1,
  DANCE = 2,
  ART = 3,
  VIDEO = 4,
  WRITING = 5,
  CODE = 6,
  OTHER = 7
}

interface MetadataAttribute {
  key: string;
  value: string;
}

const assetTypeIcons = {
  [AssetType.ART]: "🎨",
  [AssetType.MUSIC]: "🎵",
  [AssetType.VIDEO]: "🎬",
  [AssetType.CODE]: "📄",
  [AssetType.POETRY]: "📝",
  [AssetType.DANCE]: "💃",
  [AssetType.WRITING]: "✍️",
  [AssetType.OTHER]: "📦"
};

const assetTypeLabels = {
  [AssetType.ART]: "Digital Art",
  [AssetType.MUSIC]: "Music",
  [AssetType.VIDEO]: "Video",
  [AssetType.CODE]: "Document",
  [AssetType.POETRY]: "Poetry",
  [AssetType.DANCE]: "Dance",
  [AssetType.WRITING]: "Writing",
  [AssetType.OTHER]: "Other"
};

export default function AddAssetPage() {
  const { themeClasses } = useTheme();
  const { createAsset,hash,
        isPending,
        isConfirming,
        isConfirmed,
        error } = useAssetPlatformContract();
        
  const [formData, setFormData] = useState({
    assetType: AssetType.MUSIC,
    title: "",
    description: "",
    creatorSharesPercent: "",
    pricePerShare: "",
    commercialRevSharePercent: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [metadataAttributes, setMetadataAttributes] = useState<MetadataAttribute[]>([
    { key: "", value: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const newAttributes = [...metadataAttributes];
    newAttributes[index][field] = value;
    setMetadataAttributes(newAttributes);
  };

  const addAttribute = () => {
    setMetadataAttributes(prev => [...prev, { key: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    if (metadataAttributes.length > 1) {
      setMetadataAttributes(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsLoading(true);
    let loadingToast: string | undefined;

    try {
      setCurrentStep(1);
      loadingToast = toast.loading("Uploading file to IPFS...");
      const imageUrl = await uploadToIPFS(selectedFile);
      
      setCurrentStep(2);
      toast.dismiss(loadingToast);
      loadingToast = toast.loading("Creating metadata...");
      const metadataURI = await createMetadata(imageUrl, formData, metadataAttributes);
      
      setCurrentStep(3);
      toast.dismiss(loadingToast);
      loadingToast = toast.loading("Please confirm transaction in your wallet...");
      
      await createAsset(
        formData.assetType,
        formData.title,
        formData.description,
        metadataURI,
        BigInt(formData.creatorSharesPercent)*BigInt(100),
        BigInt(formData.pricePerShare),
        BigInt(formData.commercialRevSharePercent)
      );

      toast.dismiss(loadingToast);
      
    } catch (error) {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      console.error("Error creating asset:", error);
      toast.error("Failed to create asset");
      setIsLoading(false);
    }
  };

    useEffect(() => {
    let loadingToast: string | undefined;
    
    if (isPending) {
      loadingToast = toast.loading("Please confirm transaction in your wallet...");
    } else if (isConfirming && hash) {
      toast.dismiss(loadingToast);
      loadingToast = toast.loading("Transaction submitted! Waiting for confirmation...");
    } else if (isConfirmed && hash) {
      toast.dismiss(loadingToast);
      toast.success("Asset created successfully!");
      
      // Reset form
      setFormData({
        assetType: AssetType.MUSIC,
        title: "",
        description: "",
        creatorSharesPercent: "",
        pricePerShare: "",
        commercialRevSharePercent: ""
      });
      setSelectedFile(null);
      setFilePreview("");
      setMetadataAttributes([{ key: "", value: "" }]);
      setCurrentStep(1);
      setIsLoading(false);
    } else if (error) {
      toast.dismiss(loadingToast);
      toast.error("Transaction failed");
      setIsLoading(false);
    }
    
    return () => {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    };
}, [isPending, isConfirming, isConfirmed, hash, error]);


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${themeClasses.primary}20 0%, transparent 70%)`
          }}
        />
        <div className="relative px-6 pt-12 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className={`text-5xl font-bold ${themeClasses.text} mb-4`}>
                Create New Asset
              </h1>
              <p className={`text-xl ${themeClasses.textMuted} max-w-2xl mx-auto`}>
                Transform your digital creations into tokenized assets on the blockchain
              </p>
            </div>
            
            {/* Progress Steps */}
            {isLoading && (
              <div className="flex justify-center items-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step <= currentStep 
                        ? themeClasses.walletConnected 
                        : `border-2 ${themeClasses.textMuted} border-current`
                    }`}>
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        step < currentStep ? themeClasses.bg : themeClasses.textMuted
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Asset Type Selection */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Asset Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(assetTypeLabels).map(([key, label]) => {
                  const assetKey = parseInt(key) as AssetType;
                  const isSelected = formData.assetType === assetKey;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, assetType: assetKey }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? themeClasses.walletConnected
                          : themeClasses.walletDisconnected
                      }`}
                    >
                      <div className="text-3xl mb-2">{assetTypeIcons[assetKey]}</div>
                      <div className="text-sm font-medium">{label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Upload Asset</h2>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                  dragActive
                    ? `border-current ${themeClasses.text} bg-opacity-10`
                    : `${themeClasses.textMuted} hover:border-current hover:${themeClasses.text}`
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  required
                />
                
                {selectedFile ? (
                  <div className="text-center">
                    {filePreview ? (
                      <div className="space-y-4">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <div className={`${themeClasses.text} font-medium`}>
                          {selectedFile.name}
                        </div>
                        <div className={`${themeClasses.textMuted} text-sm`}>
                          {formatFileSize(selectedFile.size)}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl mb-4">📄</div>
                        <div className={`${themeClasses.text} font-medium`}>
                          {selectedFile.name}
                        </div>
                        <div className={`${themeClasses.textMuted} text-sm`}>
                          {formatFileSize(selectedFile.size)}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview("");
                      }}
                      className={`mt-4 px-4 py-2 rounded-lg border ${themeClasses.walletDisconnected} hover:scale-105 transition-transform`}
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-4">☁️</div>
                    <div className={`${themeClasses.text} text-lg font-medium mb-2`}>
                      Drop your file here or click to browse
                    </div>
                    <div className={`${themeClasses.textMuted} text-sm`}>
                      Supports images, videos, audio, and documents
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-xl border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200`}
                      placeholder="Enter a captivating title"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full p-4 rounded-xl border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200 resize-none`}
                      placeholder="Describe your asset in detail..."
                    />
                  </div>
                </div>
              </div>

              {/* Tokenization Settings */}
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Tokenization Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                      Creator Shares (%) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="creatorSharesPercent"
                        value={formData.creatorSharesPercent}
                        onChange={handleInputChange}
                        className={`w-full p-4 pr-12 rounded-xl border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200`}
                        placeholder="0"
                        min="0"
                        max="100"
                        required
                      />
                      <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`}>
                        %
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                      Price Per Share (Wei) *
                    </label>
                    <input
                      type="number"
                      name="pricePerShare"
                      value={formData.pricePerShare}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-xl border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200`}
                      placeholder="1000000000000000000"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                      Commercial Revenue Share (%) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="commercialRevSharePercent"
                        value={formData.commercialRevSharePercent}
                        onChange={handleInputChange}
                        className={`w-full p-4 pr-12 rounded-xl border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200`}
                        placeholder="0"
                        min="0"
                        max="100"
                        required
                      />
                      <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`}>
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Attributes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Metadata Attributes</h2>
                <button
                  type="button"
                  onClick={addAttribute}
                  className={`px-4 py-2 rounded-lg ${themeClasses.walletConnected} hover:scale-105 transition-transform`}
                >
                  + Add Attribute
                </button>
              </div>
              
              <div className="space-y-3">
                {metadataAttributes.map((attr, index) => (
                  <div key={index} className="flex gap-3 items-center p-4 rounded-xl border-2 border-dashed border-opacity-30 border-current">
                    <input
                      type="text"
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                      placeholder="Attribute name (e.g., Social Media)"
                      className={`flex-1 p-3 rounded-lg border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200`}
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., https://twitter.com/...)"
                      className={`flex-1 p-3 rounded-lg border-2 ${themeClasses.walletDisconnected} focus:scale-[1.02] transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                      disabled={metadataAttributes.length === 1}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : `${themeClasses.walletConnected} hover:scale-[1.02] active:scale-[0.98]`
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Creating Asset...</span>
                  </div>
                ) : (
                  "🚀 Create Asset"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
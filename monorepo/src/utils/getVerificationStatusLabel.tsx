import React from "react";

export const getVerificationStatusLabel = (status: number) => {
    const statuses: { [key: number]: { label: string, color: string } } = {
      0: { label: 'Pending', color: 'text-yellow-500' },
      1: { label: 'Verified', color: 'text-green-500' },
      2: { label: 'Rejected', color: 'text-red-500' }
    };
    return statuses[status] || { label: 'Unknown', color: 'text-gray-500' };
  };
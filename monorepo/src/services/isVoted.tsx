import react from "react";

export function addressExists(addresses: string[], userAddress: string): boolean {
  if (!Array.isArray(addresses) || typeof userAddress !== 'string') {
    console.error('Invalid input');
    return false;
  }

  const normalizedAddresses = addresses.map(addr => addr.toLowerCase());
  const normalizedUserAddress = userAddress.toLowerCase();

  return normalizedAddresses.includes(normalizedUserAddress);
}
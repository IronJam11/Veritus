'use client';

import '@rainbow-me/rainbowkit/styles.css';
import type { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, sepolia, baseSepolia, etherlinkTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const chains = [mainnet, polygon, optimism, arbitrum, base, sepolia, baseSepolia, etherlinkTestnet] as const;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'My Next.js Tomo App',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  }
);

const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [etherlinkTestnet.id]: http()
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: '#3b82f6',
              accentColorForeground: 'white',
              borderRadius: 'medium',
            })}
            modalSize="compact"
            initialChain={baseSepolia}
            showRecentTransactions={true}
            coolMode={true}
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontSize: '16px',
                  padding: '16px 20px',
                  minWidth: '300px',
                  maxWidth: '500px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4aed88',
                    secondary: '#fff',
                  },
                  style: {
                    fontSize: '16px',
                    padding: '16px 20px',
                    minWidth: '300px',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ff4b4b',
                    secondary: '#fff',
                  },
                  style: {
                    fontSize: '16px',
                    padding: '16px 20px',
                    minWidth: '300px',
                  },
                },
                loading: {
                  style: {
                    fontSize: '16px',
                    padding: '16px 20px',
                    minWidth: '300px',
                  },
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
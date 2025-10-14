"use client";

import {
    getDefaultConfig,
    lightTheme,
    RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
    holesky
} from 'wagmi/chains';

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: "881158e3bf98bbbdd4173f93aa3148e7",
    chains: [holesky],
    ssr: true,
});

const customTheme = lightTheme({
    accentColor: '#10b981',
    accentColorForeground: 'white',
    borderRadius: 'large',
});

const queryClient = new QueryClient();

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize="compact" theme={customTheme}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default Web3Provider

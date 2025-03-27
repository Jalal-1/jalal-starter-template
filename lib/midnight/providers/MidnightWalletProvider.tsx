'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { connectToWallet } from '@/lib/midnight/wallet/connectToWallet';
import type { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
import logger from '@/lib/logger';

interface WalletContextState {
    walletApi: DAppConnectorWalletAPI | null;
    address: string | null;
    uris: ServiceUriConfig | null;
    connecting: boolean;
    error: string | null;
    connectWallet: () => Promise<void>;
}

export const MidnightWalletContext = createContext<WalletContextState | undefined>(undefined);

export const MidnightWalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [walletApi, setWalletApi] = useState<DAppConnectorWalletAPI | null>(null);
    const [uris, setUris] = useState<ServiceUriConfig | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [connecting, setConnecting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const connectWallet = useCallback(async () => {
        setConnecting(true);
        setError(null);
        try {
            const { wallet, uris } = await connectToWallet(logger);
            const state = await wallet.state();

            setWalletApi(wallet);
            setUris(uris);
            setAddress(state.address);

            logger.info(`Wallet connected: ${state.address}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error connecting wallet';
            setError(errorMessage);
            setWalletApi(null);
            setUris(null);
            setAddress(null);
            logger.error(err, 'Error connecting wallet');
        } finally {
            setConnecting(false);
        }
    }, []);

    // Periodically check if the wallet is still connected
    useEffect(() => {
        intervalRef.current = setInterval(async () => {
            if (walletApi) {
                try {
                    const state = await walletApi.state();
                    if (state.address !== address) {
                        setAddress(state.address);
                        logger.info('Wallet state updated:', state.address);
                    }
                } catch {
                    setAddress(null);
                    setWalletApi(null);
                    logger.info('Wallet disconnected');
                }
            }
        }, 2000); // check every 2 seconds

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [walletApi, address]);

    useEffect(() => {
        connectWallet().catch((e) => logger.warn(e, 'Auto-connect failed'));
    }, [connectWallet]);

    return (
        <MidnightWalletContext.Provider
            value={{
                walletApi,
                uris,
                address,
                connecting,
                error,
                connectWallet,
            }}
        >
            {children}
        </MidnightWalletContext.Provider>
    );
};

export const useMidnightWallet = () => {
    const context = useContext(MidnightWalletContext);
    if (!context) {
        throw new Error('useMidnightWallet must be used within a MidnightWalletProvider');
    }
    return context;
};

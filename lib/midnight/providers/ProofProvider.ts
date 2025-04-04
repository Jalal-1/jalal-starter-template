// lib/midnight/providers/proofProvider.ts

import type { ProofProvider, UnbalancedTransaction } from '@midnight-ntwrk/midnight-js-types';
import type { UnprovenTransaction } from '@midnight-ntwrk/ledger';
import type { ProveTxConfig } from '@midnight-ntwrk/midnight-js-types';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';

export const createProofProvider = <K extends string>(
  url: string,
  callback: (status: 'proveTxStarted' | 'proveTxDone') => void,
): ProofProvider<K> => {
  const httpClientProvider = httpClientProofProvider(url.trim());
  return {
    proveTx(tx: UnprovenTransaction, proveTxConfig?: ProveTxConfig<K>): Promise<UnbalancedTransaction> {
      callback('proveTxStarted');
      return httpClientProvider.proveTx(tx, proveTxConfig).finally(() => {
        callback('proveTxDone');
      });
    },
  };
};

export const noopProofProvider = <K extends string>(): ProofProvider<K> => {
  return {
    proveTx(): Promise<UnbalancedTransaction> {
      return Promise.reject(new Error('Proof server not available'));
    },
  };
};

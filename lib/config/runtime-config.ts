export interface RuntimeConfiguration {
    LOGGING_LEVEL: string;
    NETWORK_ID: string;
    INDEXER_URI: string;
    INDEXER_WS_URI: string;
    PROVER_SERVER_URI: string;
    PUBLIC_URL: string;
  }
  
  export const loadRuntimeConfiguration = (): RuntimeConfiguration => ({
    LOGGING_LEVEL: process.env.NEXT_PUBLIC_LOGGING_LEVEL || 'info',
    NETWORK_ID: process.env.NEXT_PUBLIC_NETWORK_ID || 'testnet',
    INDEXER_URI: process.env.NEXT_PUBLIC_INDEXER_URI || '',
    INDEXER_WS_URI: process.env.NEXT_PUBLIC_INDEXER_WS_URI || '',
    PROVER_SERVER_URI: process.env.NEXT_PUBLIC_PROVER_SERVER_URI || '',
    PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL || '',
  });
  
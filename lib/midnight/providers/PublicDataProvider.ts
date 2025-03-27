// lib/midnight/providers/publicDataProvider.ts

import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import type { PublicDataProvider } from '@midnight-ntwrk/midnight-js-types';
import { loadRuntimeConfiguration } from '@/lib/config/runtime-config';

export function createPublicDataProvider(): PublicDataProvider {
  const { INDEXER_URI, INDEXER_WS_URI } = loadRuntimeConfiguration();
  return indexerPublicDataProvider(INDEXER_URI, INDEXER_WS_URI);
}

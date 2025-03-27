import { createPublicDataProvider } from '@/lib/midnight/providers/PublicDataProvider';
import { createWrappedPrivateStateProvider } from '@/lib/midnight/providers/PrivateStateProvider';
import { CachedFetchZkConfigProvider } from '@/lib/midnight/providers/ZkConfigProvider';
import { createProofProvider } from '@/lib/midnight/providers/ProofProvider';
import { loadRuntimeConfiguration } from '@/lib/config/runtime-config';
import logger from '@/lib/logger';

export function initializeMidnightProviders<PSS extends Record<string, unknown>>(privateStateStoreName: string) {
    const config = loadRuntimeConfiguration();

    const publicDataProvider = createPublicDataProvider();

    const privateDataProvider = createWrappedPrivateStateProvider<PSS>(privateStateStoreName);

    const zkConfigProvider = new CachedFetchZkConfigProvider(
        config.PUBLIC_URL,
        fetch.bind(window),
        (status) => logger.info(`ZK Config Provider action: ${status}`),
    );

    const proofProvider = createProofProvider(config.PROVER_SERVER_URI, (status) =>
        logger.info(`Proof Provider action: ${status}`),
    );

    return {
        publicDataProvider,
        privateDataProvider,
        zkConfigProvider,
        proofProvider,
    };
}

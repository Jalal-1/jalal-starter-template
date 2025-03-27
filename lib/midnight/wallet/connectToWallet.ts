// lib/midnight/wallet/connectToWallet.ts

import type { Logger } from 'pino';
import type { DAppConnectorAPI, DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
import { interval, map, filter, concatMap, of, throwError, timeout, firstValueFrom } from 'rxjs';
import { pipe as fnPipe } from 'fp-ts/function';
import semver from 'semver';

export const connectToWallet = (
  logger: Logger,
): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
  const COMPATIBLE_CONNECTOR_API_VERSION = '1.x';

  return firstValueFrom(
    fnPipe(
      interval(100),
      map(() => window.midnight?.mnLace),
      filter((connectorAPI): connectorAPI is DAppConnectorAPI => !!connectorAPI),
      concatMap((connectorAPI) =>
        semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION)
          ? of(connectorAPI)
          : throwError(() => {
              logger.error(
                {
                  expected: COMPATIBLE_CONNECTOR_API_VERSION,
                  actual: connectorAPI.apiVersion,
                },
                'Incompatible wallet connector API',
              );
              return new Error(
                `Incompatible Midnight Lace wallet. Required '${COMPATIBLE_CONNECTOR_API_VERSION}', found '${connectorAPI.apiVersion}'.`,
              );
            }),
      ),
      timeout({
        first: 1000,
        with: () => {
          logger.error('Could not find wallet connector API');
          return throwError(() => new Error('Could not find Midnight Lace wallet. Extension installed?'));
        },
      }),
      concatMap(async (connectorAPI) => {
        const walletConnectorAPI = await connectorAPI.enable();
        const uris = await connectorAPI.serviceUriConfig();
        logger.info('Wallet connector API enabled successfully');
        return { wallet: walletConnectorAPI, uris };
      }),
    ),
  );
};

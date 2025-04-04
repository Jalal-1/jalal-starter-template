// lib/midnight/providers/privateDataProvider.ts

import { type SigningKey } from '@midnight-ntwrk/compact-runtime';
import type { PrivateStateProvider, PrivateStateSchema } from '@midnight-ntwrk/midnight-js-types';
import type { Logger } from 'pino';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import logger from '@/lib/logger';

export class WrappedPrivateStateProvider<PSS extends PrivateStateSchema = PrivateStateSchema>
  implements PrivateStateProvider<PSS>
{
  constructor(
    private readonly privateDataProvider: PrivateStateProvider<PSS>,
    private readonly logger: Logger,
  ) {}

  set<PSK extends string>(key: PSK, state: PSS[PSK]): Promise<void> {
    this.logger.trace(`Setting private state for key: ${key}`);
    return this.privateDataProvider.set(key, state);
  }

  get<PSK extends string>(key: PSK): Promise<PSS[PSK] | null> {
    this.logger.trace(`Getting private state for key: ${key}`);
    return this.privateDataProvider.get(key);
  }

  remove<PSK extends string>(key: PSK): Promise<void> {
    this.logger.trace(`Removing private state for key: ${key}`);
    return this.privateDataProvider.remove(key);
  }

  clear(): Promise<void> {
    this.logger.trace('Clearing private state');
    return this.privateDataProvider.clear();
  }

  setSigningKey<PSK extends string>(key: PSK, signingKey: SigningKey): Promise<void> {
    this.logger.trace(`Setting signing key for key: ${key}`);
    return this.privateDataProvider.setSigningKey(key, signingKey);
  }

  getSigningKey<PSK extends string>(key: PSK): Promise<SigningKey | null> {
    this.logger.trace(`Getting signing key for key: ${key}`);
    return this.privateDataProvider.getSigningKey(key);
  }

  removeSigningKey<PSK extends string>(key: PSK): Promise<void> {
    this.logger.trace(`Removing signing key for key: ${key}`);
    return this.privateDataProvider.removeSigningKey(key);
  }

  clearSigningKeys(): Promise<void> {
    this.logger.trace('Clearing signing keys');
    return this.privateDataProvider.clearSigningKeys();
  }
}

// Initialization helper function for convenience
export function createWrappedPrivateStateProvider<PSS extends PrivateStateSchema>(
  privateStateStoreName: string,
): WrappedPrivateStateProvider<PSS> {
  const privateStateProvider = levelPrivateStateProvider<PSS>({ privateStateStoreName });
  return new WrappedPrivateStateProvider(privateStateProvider, logger);
}

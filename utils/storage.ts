import { EphemeralStore } from 'ephemeral-data-store';
import { convertToMilliseconds, Unit } from 'espera';

const config = useRuntimeConfig();

export const dataStore = new EphemeralStore({
  redis: {
    url: config.redisUrl,
    db: 5,
    password: config.redisPass,
  },
  namespace: 'yip',
  encryptionPassword: config.encryptPass,
  expirationMs: convertToMilliseconds(1, Unit.days),
  idLength: 6,
});

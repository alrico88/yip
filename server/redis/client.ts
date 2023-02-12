import Keyv from "@keyvhq/core";
import KeyvRedis from "@keyvhq/redis";

const config = useRuntimeConfig();

const cache = new KeyvRedis(config.redisUrl, {
  password: config.redisPass,
  db: 5,
});

export const keyv = new Keyv({
  store: cache,
  namespace: "yip",
});

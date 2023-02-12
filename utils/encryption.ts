import StringCrypto from "string-crypto";

const cryptor = new StringCrypto();

const config = useRuntimeConfig();

const pass = config.encryptPass;

export function encryptString(str: string): string {
  return cryptor.encryptString(str, pass);
}

export function decryptString(str: string): string {
  return cryptor.decryptString(str, pass);
}

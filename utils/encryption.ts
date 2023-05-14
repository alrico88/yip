import { encrypt, decrypt } from "crypto-js/aes";
import utf8enc from "crypto-js/enc-utf8";

export class Encryptor {
  private password: string;

  public constructor(password: string) {
    this.password = password;
  }

  encryptString(str: string): string {
    return encrypt(str, this.password).toString();
  }

  decryptString(str: string): string {
    const bytes = decrypt(str, this.password);

    return bytes.toString(utf8enc);
  }
}

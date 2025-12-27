import * as Crypto from 'expo-crypto';

export class CryptoService {
  private static async deriveKey(pin: string, salt: string): Promise<string> {
    const combined = `${pin}:${salt}`;
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined
    );
  }

  static async hashPIN(pin: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin
    );
  }

  static async encrypt(data: string, pin: string): Promise<string> {
    const salt = await Crypto.getRandomBytesAsync(16);
    const saltHex = Array.from(salt)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const key = await this.deriveKey(pin, saltHex);

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    const iv = await Crypto.getRandomBytesAsync(16);
    const ivHex = Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const combined = `${saltHex}:${ivHex}:${btoa(
      String.fromCharCode(...dataBytes)
    )}:${key.substring(0, 8)}`;

    return combined;
  }

  static async decrypt(encryptedData: string, pin: string): Promise<string> {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 4) {
        throw new Error('Invalid encrypted data format');
      }

      const [saltHex, ivHex, encodedData] = parts;

      const key = await this.deriveKey(pin, saltHex);

      const decodedData = atob(encodedData);
      const bytes = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        bytes[i] = decodedData.charCodeAt(i);
      }

      const decoder = new TextDecoder();
      return decoder.decode(bytes);
    } catch (error) {
      throw new Error('Decryption failed. Incorrect PIN or corrupted data.');
    }
  }

  static async encryptFile(
    base64Data: string,
    pin: string
  ): Promise<string> {
    return await this.encrypt(base64Data, pin);
  }

  static async decryptFile(
    encryptedData: string,
    pin: string
  ): Promise<string> {
    return await this.decrypt(encryptedData, pin);
  }

  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

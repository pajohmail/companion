import { IEncryptionService } from './EncryptionService';
import CryptoJS from 'crypto-js';

export class AESEncryptionService implements IEncryptionService {
    async encrypt(data: string, key: string): Promise<string> {
        try {
            const encrypted = CryptoJS.AES.encrypt(data, key).toString();
            return Promise.resolve(encrypted);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async decrypt(encryptedData: string, key: string): Promise<string> {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, key);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                // If wrong key, decrypted might be empty or valid utf8 might fail
                throw new Error('Decryption failed or resulted in empty string');
            }
            return Promise.resolve(decrypted);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async generateKey(salt: string, passphrase: string): Promise<string> {
        // PBKDF2
        const key = CryptoJS.PBKDF2(passphrase, salt, {
            keySize: 256 / 32,
            iterations: 1000
        });
        return Promise.resolve(key.toString());
    }

    generateRandomKey(): string {
        return CryptoJS.lib.WordArray.random(256 / 8).toString();
    }
}

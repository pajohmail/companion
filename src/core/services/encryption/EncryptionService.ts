export interface IEncryptionService {
    encrypt(data: string, key: string): Promise<string>;
    decrypt(encryptedData: string, key: string): Promise<string>;
    generateKey(salt: string, passphrase: string): Promise<string>;
    generateRandomKey(): string;
}

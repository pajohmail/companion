import { AESEncryptionService } from '@core/services/encryption/AESEncryptionService';

// Mocking react-native-crypto-js behavior isn't trivial since it's a direct import.
// For unit tests, we ideally want to test the wrapper logic.
// However, since AESEncryptionService is mostly a wrapper, integration-style unit test
// using the actual library (which runs in Node/Jest) is often better if the lib supports it.
// crypto-js usually works in Node.

describe('AESEncryptionService', () => {
    let service: AESEncryptionService;
    const testKey = 'secret-key';
    const testData = 'Sensitive Data';

    beforeEach(() => {
        service = new AESEncryptionService();
    });

    it('should encrypt and decrypt data correctly', async () => {
        const encrypted = await service.encrypt(testData, testKey);
        expect(encrypted).not.toBe(testData);
        expect(typeof encrypted).toBe('string');

        const decrypted = await service.decrypt(encrypted, testKey);
        expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with wrong key', async () => {
        const encrypted = await service.encrypt(testData, testKey);
        await expect(service.decrypt(encrypted, 'wrong-key')).rejects.toThrow();
    });

    it('should generate a derived key', async () => {
        const key1 = await service.generateKey('salt', 'pass');
        const key2 = await service.generateKey('salt', 'pass');
        expect(key1).toBe(key2);
        expect(key1.length).toBeGreaterThan(0);
    });

    it('should generate random key', () => {
        const key = service.generateRandomKey();
        expect(key).toBeDefined();
        expect(key.length).toBeGreaterThan(0);
    });
});

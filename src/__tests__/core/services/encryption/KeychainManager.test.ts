import { KeychainManager } from '@core/services/encryption/KeychainManager';
import * as Keychain from 'react-native-keychain';

describe('KeychainManager', () => {
    let keychainManager: KeychainManager;

    beforeEach(() => {
        keychainManager = new KeychainManager();
        jest.clearAllMocks();
    });

    it('should save master key', async () => {
        (Keychain.setGenericPassword as jest.Mock).mockResolvedValue(true);
        const result = await keychainManager.saveMasterKey('secret');
        expect(result).toBe(true);
        expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
            'master-key-user',
            'secret',
            expect.objectContaining({ service: KeychainManager.SERVICE })
        );
    });

    it('should retrieve master key', async () => {
        (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({ password: 'secret' });
        const key = await keychainManager.getMasterKey();
        expect(key).toBe('secret');
    });

    it('should return null if no master key found', async () => {
        (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
        const key = await keychainManager.getMasterKey();
        expect(key).toBeNull();
    });

    it('should delete master key', async () => {
        (Keychain.resetGenericPassword as jest.Mock).mockResolvedValue(true);
        const result = await keychainManager.deleteMasterKey();
        expect(result).toBe(true);
    });
});

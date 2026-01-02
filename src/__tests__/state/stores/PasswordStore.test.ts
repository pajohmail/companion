import { PasswordStore } from '@state/stores/PasswordStore';
import { CreatePasswordUseCase, GetPasswordsUseCase } from '@core/use-cases/password/PasswordUseCases';
import { KeychainManager } from '@core/services/encryption/KeychainManager';

// Mock dependencies
const mockCreateUseCase = {
    execute: jest.fn(),
} as unknown as CreatePasswordUseCase;

const mockGetUseCase = {
    execute: jest.fn(),
} as unknown as GetPasswordsUseCase;

const mockKeychain = {
    getMasterKey: jest.fn(),
} as unknown as KeychainManager;

describe('PasswordStore', () => {
    let store: PasswordStore;

    beforeEach(() => {
        store = new PasswordStore(mockCreateUseCase, mockGetUseCase, mockKeychain);
        jest.clearAllMocks();
    });

    it('should initialize locked', () => {
        expect(store.isLocked).toBe(true);
        expect(store.passwords).toEqual([]);
    });

    it('should quick unlock with keychain', async () => {
        (mockKeychain.getMasterKey as jest.Mock).mockResolvedValue('secret-key');
        (mockGetUseCase.execute as jest.Mock).mockResolvedValue([]);

        const success = await store.quickUnlock();

        expect(success).toBe(true);
        expect(store.isLocked).toBe(false);
        expect(store.hasMasterKey).toBe(true);
        expect(mockGetUseCase.execute).toHaveBeenCalledWith('secret-key');
    });

    it('should fail quick unlock if no key', async () => {
        (mockKeychain.getMasterKey as jest.Mock).mockResolvedValue(null);

        const success = await store.quickUnlock();

        expect(success).toBe(false);
        expect(store.isLocked).toBe(true);
    });

    it('should unlock with password', async () => {
        (mockGetUseCase.execute as jest.Mock).mockResolvedValue([]);

        const success = await store.unlock('my-password');

        expect(success).toBe(true);
        expect(store.isLocked).toBe(false);
        expect(mockGetUseCase.execute).toHaveBeenCalledWith('my-password');
    });

    it('should add password', async () => {
        await store.unlock('key');
        (mockGetUseCase.execute as jest.Mock).mockResolvedValue([{ title: 'New' }]);

        await store.addPassword({ title: 'New', username: 'u', password: 'p' });

        expect(mockCreateUseCase.execute).toHaveBeenCalled();
        expect(store.passwords).toHaveLength(1);
    });

    it('should lock', async () => {
        await store.unlock('key');
        store.lock();
        expect(store.isLocked).toBe(true);
        expect(store.passwords).toEqual([]);
        expect(store.hasMasterKey).toBe(false);
    });
});

import { SettingsStore } from '@state/stores/SettingsStore';
import { KeychainManager } from '@core/services/encryption/KeychainManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const mockKeychain = {
    hasItem: jest.fn(),
    setItem: jest.fn(),
    getItem: jest.fn(),
    deleteItem: jest.fn(),
} as unknown as KeychainManager;

describe('SettingsStore', () => {
    let store: SettingsStore;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should load settings from storage', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({ useOwnKey: true }));
        (mockKeychain.hasItem as jest.Mock).mockResolvedValue(true);

        store = new SettingsStore(mockKeychain);
        await store.loadSettings();

        expect(store.useOwnKey).toBe(true);
        expect(store.hasApiKey).toBe(true);
    });

    it('should set useOwnKey and persist', async () => {
        store = new SettingsStore(mockKeychain);
        await store.setUseOwnKey(true);

        expect(store.useOwnKey).toBe(true);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            expect.stringContaining('settings'),
            JSON.stringify({ useOwnKey: true })
        );
    });

    it('should set api key and update hasApiKey', async () => {
        store = new SettingsStore(mockKeychain);

        await store.setApiKey('new-key');

        expect(mockKeychain.setItem).toHaveBeenCalledWith(
            expect.stringContaining('gemini'),
            'gemini_user',
            'new-key'
        );
        expect(store.hasApiKey).toBe(true);
        expect(store.useOwnKey).toBe(true); // Auto-enable
    });

    it('should clear api key', async () => {
        store = new SettingsStore(mockKeychain);

        await store.setApiKey('');

        expect(mockKeychain.deleteItem).toHaveBeenCalled();
        expect(store.hasApiKey).toBe(false);
        expect(store.useOwnKey).toBe(false); // Auto-disable
    });
});

import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeychainManager } from '../../core/services/encryption/KeychainManager';
import { Logger } from '../../infrastructure/utils/Logger';

const SETTINGS_KEY = 'companion_settings';
const API_KEY_SERVICE = 'companion_gemini_api_key';

export class SettingsStore {
    useOwnKey: boolean = false;
    hasApiKey: boolean = false; // To show in UI without revealing key
    isLoading: boolean = true;

    constructor(private keychainManager: KeychainManager) {
        makeAutoObservable(this);
    }

    async loadSettings() {
        this.isLoading = true;
        try {
            // Load preferences
            const json = await AsyncStorage.getItem(SETTINGS_KEY);
            if (json) {
                const data = JSON.parse(json);
                runInAction(() => {
                    this.useOwnKey = !!data.useOwnKey;
                });
            }

            // Check if key exists (we don't load it into memory unless needed, 
            // but here we might need it for the service? 
            // Actually, better to just check IF it exists for UI state).
            // For the service usage, the service will ask the store (or keychain directly via store)

            // For now, let's verify if a key exists in Keychain
            // We reuse KeychainManager but we need a distinct service/account for this API key 
            // vs the Master Key. 
            // The KeychainManager implemented earlier used specific service name constants.
            // We might need to extend KeychainManager or just use the raw lib or add method.
            // Let's assume we add a method to KeychainManager for generic items or use a separate svc.
            // For simplicity, I'll update KeychainManager to support generic set/get if possible, 
            // or just use the library directly here if I inject the functionality? 
            // Retaining clean architecture: Update KeychainManager.

            const hasKey = await this.keychainManager.hasItem(API_KEY_SERVICE);
            runInAction(() => {
                this.hasApiKey = hasKey;
            });

        } catch (e) {
            Logger.error('Failed to load settings', e);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async setUseOwnKey(value: boolean) {
        this.useOwnKey = value;
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ useOwnKey: value }));
    }

    async setApiKey(key: string) {
        try {
            if (key) {
                await this.keychainManager.setItem(API_KEY_SERVICE, 'gemini_user', key);
                runInAction(() => {
                    this.hasApiKey = true;
                    // Auto switch to use own key if they set it?
                    this.useOwnKey = true;
                });
                await this.setUseOwnKey(true);
            } else {
                // Clear it
                await this.keychainManager.deleteItem(API_KEY_SERVICE);
                runInAction(() => {
                    this.hasApiKey = false;
                    this.useOwnKey = false;
                });
                await this.setUseOwnKey(false);
            }
        } catch (e) {
            Logger.error('Failed to save API key', e);
            throw e;
        }
    }

    async getApiKey(): Promise<string | null> {
        return this.keychainManager.getItem(API_KEY_SERVICE);
    }
}

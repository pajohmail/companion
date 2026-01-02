import * as Keychain from 'react-native-keychain';
import { Logger } from '../../../infrastructure/utils/Logger';

export class KeychainManager {
    static readonly SERVICE = 'com.companion.app.masterkey';

    async saveMasterKey(key: string): Promise<boolean> {
        try {
            await Keychain.setGenericPassword('master-key-user', key, {
                service: KeychainManager.SERVICE,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            });
            return true;
        } catch (error) {
            Logger.error('Failed to save master key to keychain', error);
            return false;
        }
    }

    async getMasterKey(): Promise<string | null> {
        try {
            const result = await Keychain.getGenericPassword({
                service: KeychainManager.SERVICE,
            });
            if (result) {
                return result.password;
            }
            return null;
        } catch (error) {
            Logger.warn('Failed to retrieve master key from keychain', error);
            // It might not exist, or user cancelled auth
            return null;
        }
    }

    async deleteMasterKey(): Promise<boolean> {
        try {
            return await Keychain.resetGenericPassword({
                service: KeychainManager.SERVICE,
            });
        } catch (error) {
            Logger.error('Failed to reset master key in keychain', error);
            return false;
        }
    }
    async hasItem(service: string): Promise<boolean> {
        return !!(await this.getItem(service));
    }

    async setItem(service: string, username: string, value: string): Promise<boolean> {
        try {
            await Keychain.setGenericPassword(username, value, {
                service: service,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            });
            return true;
        } catch (error) {
            Logger.error(`Failed to save item to keychain (${service})`, error);
            return false;
        }
    }

    async getItem(service: string): Promise<string | null> {
        try {
            const result = await Keychain.getGenericPassword({
                service: service,
            });
            if (result) {
                return result.password;
            }
            return null;
        } catch (error) {
            Logger.warn(`Failed to retrieve item from keychain (${service})`, error);
            return null;
        }
    }

    async deleteItem(service: string): Promise<boolean> {
        try {
            return await Keychain.resetGenericPassword({
                service: service,
            });
        } catch (error) {
            Logger.error(`Failed to delete item from keychain (${service})`, error);
            return false;
        }
    }
}

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
}

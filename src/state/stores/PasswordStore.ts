import { makeAutoObservable, runInAction } from 'mobx';
import { CreatePasswordUseCase, GetPasswordsUseCase } from '../../core/use-cases/password/PasswordUseCases';
import { KeychainManager } from '../../core/services/encryption/KeychainManager';
import { PasswordProps } from '../../core/entities/Password'; // Or a DTO
import { Logger } from '../../infrastructure/utils/Logger';

// DTO for UI
export interface PasswordUI extends PasswordProps {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class PasswordStore {
    passwords: PasswordUI[] = [];
    isLoading: boolean = false;
    error: string | null = null;
    isLocked: boolean = true;
    private masterKey: string | null = null;

    constructor(
        private createPasswordUseCase: CreatePasswordUseCase,
        private getPasswordsUseCase: GetPasswordsUseCase,
        private keychainManager: KeychainManager
    ) {
        makeAutoObservable(this);
    }

    get hasMasterKey(): boolean {
        return !!this.masterKey;
    }

    async unlock(password: string): Promise<boolean> {
        this.isLoading = true;
        this.error = null;
        try {
            // Validate password against Keychain or Hash?
            // If first time, we might set it.
            // For now, let's assume valid if we can derive/decrypt something (integration)
            // OR checks against stored hash.
            // Since we implement "Master Key stored in Keychain", we:
            // 1. Try to get Key from Keychain (biometric).
            // 2. If fail/null, we need to DERIVE key from input password.

            // Simplified flow:
            // Input password IS the master key (or derived from it).
            // We should verify it.

            // For this phase:
            // We accept the password as "Master Key Source".
            // We check if it matches stored check?
            // Let's assume seamless for now: User unlocks -> Key set.

            this.masterKey = password;
            this.isLocked = false;
            await this.loadPasswords();
            return true;
        } catch (e) {
            Logger.error('Failed to unlock', e);
            runInAction(() => {
                this.error = 'Failed to unlock';
            });
            return false;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    // Attempt biometric/keychain unlock
    async quickUnlock(): Promise<boolean> {
        this.isLoading = true;
        try {
            const key = await this.keychainManager.getMasterKey();
            if (key) {
                runInAction(() => {
                    this.masterKey = key;
                    this.isLocked = false;
                });
                await this.loadPasswords();
                return true;
            }
            return false;
        } catch (e) {
            Logger.warn('Quick unlock failed', e);
            return false;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async loadPasswords() {
        if (!this.masterKey) return;
        this.isLoading = true;
        try {
            const list = await this.getPasswordsUseCase.execute(this.masterKey);
            runInAction(() => {
                this.passwords = list as PasswordUI[];
            });
        } catch (e) {
            Logger.error('Failed to load passwords', e);
            runInAction(() => {
                this.error = 'Failed to load passwords';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async addPassword(props: PasswordProps) {
        if (!this.masterKey) {
            this.error = 'Vault is locked';
            return;
        }
        this.isLoading = true;
        try {
            await this.createPasswordUseCase.execute(props, this.masterKey);
            await this.loadPasswords(); // Refresh list
        } catch (e) {
            Logger.error('Failed to add password', e);
            runInAction(() => {
                this.error = 'Failed to save password';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    lock() {
        this.masterKey = null;
        this.passwords = [];
        this.isLocked = true;
    }
}

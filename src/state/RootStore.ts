import { AuthStore } from './stores/AuthStore';
import { PasswordStore } from './stores/PasswordStore';
import { Container } from '../core/di/Container';
import { GoogleAuthService } from '../core/services/auth/GoogleAuthService';
import { AESEncryptionService } from '../core/services/encryption/AESEncryptionService';
import { KeychainManager } from '../core/services/encryption/KeychainManager';
import { GoogleDriveService } from '../core/services/storage/GoogleDriveService';
import { PasswordRepository } from '../core/repositories/PasswordRepository';
import { CreatePasswordUseCase, GetPasswordsUseCase } from '../core/use-cases/password/PasswordUseCases';
import { GeminiOCRService } from '../core/services/ocr/GeminiOCRService';

export class RootStore {
    authStore: AuthStore;
    passwordStore: PasswordStore;

    constructor() {
        const container = Container.getInstance();

        // Core Services
        container.register('AuthService', new GoogleAuthService());
        container.register('EncryptionService', new AESEncryptionService());
        container.register('KeychainManager', new KeychainManager());

        // Dependent Services
        container.registerFactory('GoogleDriveService', c => new GoogleDriveService(c.resolve('AuthService')));
        container.registerFactory('PasswordRepository', c => new PasswordRepository(c.resolve('GoogleDriveService')));
        container.register('OCRService', new GeminiOCRService());

        // Use Cases
        const passwordRepo = container.resolve<PasswordRepository>('PasswordRepository');
        const encryptionService = container.resolve<AESEncryptionService>('EncryptionService');
        const createPasswordUseCase = new CreatePasswordUseCase(passwordRepo, encryptionService);
        const getPasswordsUseCase = new GetPasswordsUseCase(passwordRepo, encryptionService);

        // Stores
        this.authStore = new AuthStore(container.resolve<GoogleAuthService>('AuthService'));
        this.passwordStore = new PasswordStore(
            createPasswordUseCase,
            getPasswordsUseCase,
            container.resolve<KeychainManager>('KeychainManager')
        );
    }
}

import { AuthStore } from './stores/AuthStore';
import { PasswordStore } from './stores/PasswordStore';
import { SettingsStore } from './stores/SettingsStore';
import { DocumentStore } from './stores/DocumentStore';
import { Container } from '../core/di/Container';
import { GoogleAuthService } from '../core/services/auth/GoogleAuthService';
import { AESEncryptionService } from '../core/services/encryption/AESEncryptionService';
import { KeychainManager } from '../core/services/encryption/KeychainManager';
import { GoogleDriveService } from '../core/services/storage/GoogleDriveService';
import { PasswordRepository } from '../core/repositories/PasswordRepository';
import { DocumentRepository } from '../core/repositories/DocumentRepository';
import { CreatePasswordUseCase, GetPasswordsUseCase } from '../core/use-cases/password/PasswordUseCases';
import { GeminiOCRService } from '../core/services/ocr/GeminiOCRService';
import { GeminiChatService } from '../core/services/ai/GeminiChatService';
import { AddDocumentUseCase, ChatWithDocumentUseCase } from '../core/use-cases/document/DocumentUseCases';
import { VoiceNoteUseCase } from '../core/use-cases/document/VoiceNoteUseCases';
import { GeminiTranscriptionService } from '../core/services/ai/GeminiTranscriptionService';
import { AudioRecorderService, IAudioRecorderService } from '../core/services/audio/AudioRecorderService';

export class RootStore {
    authStore: AuthStore;
    passwordStore: PasswordStore;
    settingsStore: SettingsStore;
    documentStore: DocumentStore;
    // documentStore will be added here

    constructor() {
        const container = Container.getInstance();

        // Core Services
        container.register('AuthService', new GoogleAuthService());
        container.register('EncryptionService', new AESEncryptionService());
        container.register('KeychainManager', new KeychainManager());

        // Settings Store (Early init for config)
        const keychainManager = container.resolve<KeychainManager>('KeychainManager');
        this.settingsStore = new SettingsStore(keychainManager);
        this.settingsStore.loadSettings();

        // Dependent Services
        container.registerFactory('GoogleDriveService', c => new GoogleDriveService(c.resolve('AuthService')));
        container.registerFactory('PasswordRepository', c => new PasswordRepository(c.resolve('GoogleDriveService')));
        container.registerFactory('DocumentRepository', c => new DocumentRepository(c.resolve('GoogleDriveService')));

        // AI Services
        container.registerFactory('OCRService', c => new GeminiOCRService(this.settingsStore, c.resolve('AuthService')));
        container.registerFactory('ChatService', c => new GeminiChatService(this.settingsStore, c.resolve('AuthService')));
        container.registerFactory('TranscriptionService', c => new GeminiTranscriptionService(this.settingsStore, c.resolve('AuthService')));

        // Native Services
        container.register('AudioRecorderService', new AudioRecorderService());

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
        this.documentStore = new DocumentStore(
            container.resolve<DocumentRepository>('DocumentRepository'),
            new AddDocumentUseCase(
                container.resolve<DocumentRepository>('DocumentRepository'),
                container.resolve<GeminiOCRService>('OCRService')
            ),
            new ChatWithDocumentUseCase(
                container.resolve<DocumentRepository>('DocumentRepository'),
                container.resolve<GeminiChatService>('ChatService')
            ),
            new VoiceNoteUseCase(
                container.resolve<IAudioRecorderService>('AudioRecorderService'),
                container.resolve<GeminiTranscriptionService>('TranscriptionService')
            )
        );
    }
}

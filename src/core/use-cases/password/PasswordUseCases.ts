import { IPasswordRepository } from '../../repositories/PasswordRepository';
import { IEncryptionService } from '../../services/encryption/EncryptionService';
import { Password, PasswordProps } from '../../entities/Password';

export class CreatePasswordUseCase {
    constructor(
        private repository: IPasswordRepository,
        private encryptionService: IEncryptionService
    ) { }

    async execute(props: PasswordProps, masterKey: string): Promise<Password> {
        // Encrypt sensitive fields
        const encryptedUsername = await this.encryptionService.encrypt(props.username, masterKey);
        const encryptedPassword = await this.encryptionService.encrypt(props.password, masterKey);
        const encryptedNotes = props.notes ? await this.encryptionService.encrypt(props.notes, masterKey) : null;

        const newPassword = new Password({
            ...props,
            username: encryptedUsername,
            password: encryptedPassword,
            notes: encryptedNotes,
        });

        await this.repository.save(newPassword);
        return newPassword;
    }
}

export class GetPasswordsUseCase {
    constructor(
        private repository: IPasswordRepository,
        private encryptionService: IEncryptionService
    ) { }

    async execute(masterKey: string): Promise<PasswordProps[]> {
        const passwords = await this.repository.findAll();

        // Decrypt all (for simple list view, usually we might decrypt on demand or only titles, 
        // but here we want to show/use them. 
        // NOTE: Decrypting 100 items might be slow with PBKDF derivation if key is derived per item, 
        // but here we use the SAME masterKey for AES. AES is fast.

        return Promise.all(passwords.map(async (p) => {
            try {
                const username = await this.encryptionService.decrypt(p.username, masterKey);
                const password = await this.encryptionService.decrypt(p.password, masterKey);
                const notes = p.notes ? await this.encryptionService.decrypt(p.notes, masterKey) : null;

                return {
                    ...p, // includes id, etc if we cast to any or mapped properly. 
                    // Wait, PasswordProps doesn't have ID. We should probably return a DecryptedPassword DTO.
                    // For now returning props + id.
                    id: p.id,
                    title: p.title,
                    username,
                    password,
                    notes,
                    website: p.website,
                    category: p.category,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt
                } as any; // simplifies for now
            } catch (e) {
                // If decryption fails (e.g. key change?), return raw or error.
                // For now return raw with error flag?
                console.warn(`Failed to decrypt password ${p.id}`, e);
                return {
                    ...p,
                    error: 'Decryption failed'
                } as any;
            }
        }));
    }
}

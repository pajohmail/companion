import { BaseRepository } from './base/Repository';
import { Password } from '../entities/Password';
import { GoogleDriveService } from '../services/storage/GoogleDriveService';
import { Logger } from '../../infrastructure/utils/Logger';

export interface IPasswordRepository extends BaseRepository<Password> {
    findByCategory(category: string): Promise<Password[]>;
}

export class PasswordRepository implements IPasswordRepository {
    private readonly DB_FILENAME = 'companion_passwords.json';
    private cache: Password[] | null = null;

    constructor(private driveService: GoogleDriveService) { }

    private async loadDatabase(): Promise<Password[]> {
        if (this.cache) return this.cache;

        try {
            const file = await this.driveService.findFileByName(this.DB_FILENAME);
            if (!file) {
                this.cache = [];
                return [];
            }
            const content = await this.driveService.downloadFile(file.id);
            // content should be an array of serialized passwords
            // We need to re-instantiate Password entities
            const rawList = Array.isArray(content) ? content : [];
            this.cache = rawList.map((props: any) => {
                const { id, createdAt, updatedAt, ...rest } = props;
                return new Password(rest, id, new Date(createdAt), new Date(updatedAt));
            });
            return this.cache;
        } catch (error) {
            Logger.error('Failed to load password database', error);
            // Fallback to empty if error? Or throw? 
            // For now throw to alert user, but if file missing (404 handled above) it's fine.
            throw error;
        }
    }

    private async saveDatabase(passwords: Password[]): Promise<void> {
        try {
            const content = JSON.stringify(passwords);
            const file = await this.driveService.findFileByName(this.DB_FILENAME);
            if (file) {
                await this.driveService.updateFile(file.id, content);
            } else {
                await this.driveService.uploadFile(this.DB_FILENAME, content);
            }
            this.cache = passwords;
        } catch (error) {
            Logger.error('Failed to save password database', error);
            throw error;
        }
    }

    async findById(id: string): Promise<Password | null> {
        const all = await this.loadDatabase();
        return all.find(p => p.id === id) || null;
    }

    async save(entity: Password): Promise<void> {
        const all = await this.loadDatabase();
        const index = all.findIndex(p => p.id === entity.id);
        if (index >= 0) {
            all[index] = entity;
        } else {
            all.push(entity);
        }
        await this.saveDatabase(all);
    }

    async delete(id: string): Promise<void> {
        let all = await this.loadDatabase();
        all = all.filter(p => p.id !== id);
        await this.saveDatabase(all);
    }

    async findAll(): Promise<Password[]> {
        return this.loadDatabase();
    }

    async findByCategory(category: string): Promise<Password[]> {
        const all = await this.findAll();
        return all.filter(p => p.category === category);
    }
}

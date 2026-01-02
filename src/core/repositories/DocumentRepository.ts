import { BaseRepository } from './base/Repository';
import { Document, DocumentProps } from '../entities/Document';
import { GoogleDriveService } from '../services/storage/GoogleDriveService';
import { Logger } from '../../infrastructure/utils/Logger';

export interface IDocumentRepository extends BaseRepository<Document> {
    search(query: string): Promise<Document[]>;
}

export class DocumentRepository implements IDocumentRepository {
    private readonly DB_FILENAME = 'companion_documents.json';
    private cache: Document[] | null = null;

    constructor(private driveService: GoogleDriveService) { }

    private async loadDatabase(): Promise<Document[]> {
        if (this.cache) return this.cache;

        try {
            const file = await this.driveService.findFileByName(this.DB_FILENAME);
            if (!file) {
                this.cache = [];
                return [];
            }
            const content = await this.driveService.downloadFile(file.id);
            const rawList = Array.isArray(content) ? content : [];
            this.cache = rawList.map((props: any) => {
                const { id, createdAt, updatedAt, ...rest } = props;
                return new Document(rest, id, new Date(createdAt), new Date(updatedAt));
            });
            return this.cache;
        } catch (error) {
            Logger.error('Failed to load document database', error);
            throw error;
        }
    }

    private async saveDatabase(documents: Document[]): Promise<void> {
        try {
            const content = JSON.stringify(documents);
            const file = await this.driveService.findFileByName(this.DB_FILENAME);
            if (file) {
                await this.driveService.updateFile(file.id, content);
            } else {
                await this.driveService.uploadFile(this.DB_FILENAME, content);
            }
            this.cache = documents;
        } catch (error) {
            Logger.error('Failed to save document database', error);
            throw error;
        }
    }

    async findById(id: string): Promise<Document | null> {
        const all = await this.loadDatabase();
        return all.find(d => d.id === id) || null;
    }

    async save(entity: Document): Promise<void> {
        const all = await this.loadDatabase();
        const index = all.findIndex(d => d.id === entity.id);
        if (index >= 0) {
            all[index] = entity;
        } else {
            all.push(entity);
        }
        await this.saveDatabase(all);
    }

    async delete(id: string): Promise<void> {
        let all = await this.loadDatabase();
        all = all.filter(d => d.id !== id);
        await this.saveDatabase(all);
    }

    async findAll(): Promise<Document[]> {
        return this.loadDatabase();
    }

    async search(query: string): Promise<Document[]> {
        const all = await this.findAll();
        const lowerQ = query.toLowerCase();
        return all.filter(d =>
            d.title.toLowerCase().includes(lowerQ) ||
            d.content.toLowerCase().includes(lowerQ) ||
            d.tags.some(t => t.toLowerCase().includes(lowerQ))
        );
    }
}

import { DocumentRepository } from '@core/repositories/DocumentRepository';
import { GoogleDriveService } from '@core/services/storage/GoogleDriveService';
import { Document } from '@core/entities/Document';

const mockDrive = {
    findFileByName: jest.fn(),
    downloadFile: jest.fn(),
    uploadFile: jest.fn(),
    updateFile: jest.fn(),
} as unknown as GoogleDriveService;

describe('DocumentRepository', () => {
    let repo: DocumentRepository;

    beforeEach(() => {
        repo = new DocumentRepository(mockDrive);
        jest.clearAllMocks();
    });

    it('should load empty list if file missing', async () => {
        (mockDrive.findFileByName as jest.Mock).mockResolvedValue(null);
        const docs = await repo.findAll();
        expect(docs).toEqual([]);
    });

    it('should serialize/deserialize correctly', async () => {
        const dummyDate = new Date().toISOString();
        const data = [{
            id: '1', title: 'Doc',
            createdAt: dummyDate, updatedAt: dummyDate,
            originalPath: 'path', mimeType: 'application/pdf',
            content: 'text', summary: 'sum', tags: ['t']
        }];

        (mockDrive.findFileByName as jest.Mock).mockResolvedValue({ id: 'f1', name: 'db.json' });
        (mockDrive.downloadFile as jest.Mock).mockResolvedValue(data);

        const docs = await repo.findAll();
        expect(docs[0]).toBeInstanceOf(Document);
        expect(docs[0].title).toBe('Doc');
        expect(docs[0].tags).toContain('t');
        expect(docs[0].createdAt).toBeInstanceOf(Date);
    });

    it('should search documents', async () => {
        const dummyDate = new Date().toISOString();
        const data = [
            { id: '1', title: 'Invoice', content: 'Payment', tags: [], createdAt: dummyDate, updatedAt: dummyDate },
            { id: '2', title: 'Notes', content: 'Meeting', tags: ['work'], createdAt: dummyDate, updatedAt: dummyDate },
        ];
        (mockDrive.findFileByName as jest.Mock).mockResolvedValue({ id: 'f1' });
        (mockDrive.downloadFile as jest.Mock).mockResolvedValue(data);

        const results = await repo.search('payment');
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('Invoice');

        const results2 = await repo.search('work');
        expect(results2).toHaveLength(1);
        expect(results2[0].title).toBe('Notes');
    });
});

import { PasswordRepository } from '@core/repositories/PasswordRepository';
import { GoogleDriveService } from '@core/services/storage/GoogleDriveService';
import { Password } from '@core/entities/Password';

// Mock Drive Service
const mockDriveService = {
    findFileByName: jest.fn(),
    downloadFile: jest.fn(),
    uploadFile: jest.fn(),
    updateFile: jest.fn(),
} as unknown as jest.Mocked<GoogleDriveService>;

describe('PasswordRepository', () => {
    let repository: PasswordRepository;

    beforeEach(() => {
        repository = new PasswordRepository(mockDriveService);
        jest.clearAllMocks();
    });

    it('should load empty database if file not found', async () => {
        mockDriveService.findFileByName.mockResolvedValue(null);
        const passwords = await repository.findAll();
        expect(passwords).toEqual([]);
    });

    it('should load passwords from file', async () => {
        mockDriveService.findFileByName.mockResolvedValue({ id: '1', name: 'db.json', mimeType: 'application/json' });
        const mockData = [{
            id: 'p1', title: 'Test', username: 'u', password: 'p', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        }];
        mockDriveService.downloadFile.mockResolvedValue(mockData);

        const passwords = await repository.findAll();
        expect(passwords).toHaveLength(1);
        expect(passwords[0].title).toBe('Test');
        expect(passwords[0].createdAt).toBeInstanceOf(Date);
    });

    it('should save new password by uploading if db missing', async () => {
        mockDriveService.findFileByName.mockResolvedValue(null);
        mockDriveService.uploadFile.mockResolvedValue({ id: 'new', name: 'db', mimeType: 'json' });

        const p = new Password({ title: 'New', username: 'u', password: 'p' });
        await repository.save(p);

        expect(mockDriveService.uploadFile).toHaveBeenCalledWith(
            expect.stringContaining('passwords.json'),
            expect.stringContaining('New')
        );
    });

    it('should update password by updating file', async () => {
        mockDriveService.findFileByName.mockResolvedValue({ id: '1', name: 'db', mimeType: 'json' });
        mockDriveService.downloadFile.mockResolvedValue([]);

        const p = new Password({ title: 'New', username: 'u', password: 'p' });
        await repository.save(p);

        expect(mockDriveService.updateFile).toHaveBeenCalledWith(
            '1',
            expect.stringContaining('New')
        );
    });
});

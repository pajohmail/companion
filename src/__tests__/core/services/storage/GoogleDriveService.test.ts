import axios from 'axios';
import { GoogleDriveService } from '@core/services/storage/GoogleDriveService';
import { IAuthService } from '@core/services/auth/AuthService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleDriveService', () => {
    let service: GoogleDriveService;
    let mockAuthService: jest.Mocked<IAuthService>;

    beforeEach(() => {
        mockAuthService = {
            login: jest.fn(),
            logout: jest.fn(),
            getCurrentUser: jest.fn(),
            getAccessToken: jest.fn().mockResolvedValue('mock-token'),
        };
        service = new GoogleDriveService(mockAuthService);
        jest.clearAllMocks();
    });

    it('should list files', async () => {
        mockedAxios.get.mockResolvedValue({ data: { files: [{ id: '1', name: 'test.json' }] } });
        const files = await service.listFiles();
        expect(files).toHaveLength(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/files'), expect.objectContaining({
            params: expect.objectContaining({ spaces: 'appDataFolder' })
        }));
    });

    it('should upload file', async () => {
        mockedAxios.post.mockResolvedValue({ data: { id: '1', name: 'test.json' } });
        const file = await service.uploadFile('test.json', '{"a":1}');
        expect(file.id).toBe('1');
        expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should download file', async () => {
        mockedAxios.get.mockResolvedValue({ data: { a: 1 } });
        const content = await service.downloadFile('1');
        expect(content).toEqual({ a: 1 });
    });

    it('should update file', async () => {
        mockedAxios.patch.mockResolvedValue({ data: { id: '1' } });
        await service.updateFile('1', 'new content');
        expect(mockedAxios.patch).toHaveBeenCalled();
    });

    it('should delete file', async () => {
        mockedAxios.delete.mockResolvedValue({});
        await service.deleteFile('1');
        expect(mockedAxios.delete).toHaveBeenCalled();
    });
});

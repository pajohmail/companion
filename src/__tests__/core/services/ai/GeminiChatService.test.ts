import axios from 'axios';
import { GeminiChatService } from '@core/services/ai/GeminiChatService';
import { SettingsStore } from '@state/stores/SettingsStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockSettingsStore = {
    useOwnKey: false,
    getApiKey: jest.fn(),
} as unknown as SettingsStore;

const mockAuthService = {
    getAccessToken: jest.fn(),
} as any;

describe('GeminiChatService', () => {
    let service: GeminiChatService;

    beforeEach(() => {
        service = new GeminiChatService(mockSettingsStore, mockAuthService);
        jest.clearAllMocks();
    });

    it('should chat using Account Quota', async () => {
        mockSettingsStore.useOwnKey = false;
        mockAuthService.getAccessToken.mockResolvedValue('token');
        mockedAxios.post.mockResolvedValue({
            data: { candidates: [{ content: { parts: [{ text: 'Response' }] } }] }
        });

        const reply = await service.chat([], 'Hello');
        expect(reply).toBe('Response');
        expect(mockAuthService.getAccessToken).toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('generateContent'),
            expect.anything(),
            expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token' }) })
        );
    });

    it('should chat using API Key', async () => {
        mockSettingsStore.useOwnKey = true;
        (mockSettingsStore.getApiKey as jest.Mock).mockResolvedValue('key123');
        mockedAxios.post.mockResolvedValue({
            data: { candidates: [{ content: { parts: [{ text: 'Response' }] } }] }
        });

        const reply = await service.chat([], 'Hello');
        expect(reply).toBe('Response');
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('key=key123'),
            expect.anything(),
            expect.anything()
        );
    });
});

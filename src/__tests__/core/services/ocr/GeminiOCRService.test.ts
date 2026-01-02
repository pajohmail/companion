import axios from 'axios';
import { GeminiOCRService } from '@core/services/ocr/GeminiOCRService';
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

describe('GeminiOCRService', () => {
    let service: GeminiOCRService;

    beforeEach(() => {
        service = new GeminiOCRService(mockSettingsStore, mockAuthService);
        jest.clearAllMocks();
    });

    it('should use Account Quota (OAuth) when useOwnKey is false', async () => {
        mockSettingsStore.useOwnKey = false;
        mockAuthService.getAccessToken.mockResolvedValue('mock-token');

        const mockResponse = { data: { candidates: [{ content: { parts: [{ text: '{"username": "u"}' }] } }] } };
        mockedAxios.post.mockResolvedValue(mockResponse);

        await service.extractCredentials('img');

        expect(mockAuthService.getAccessToken).toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.not.stringContaining('key='), // Should not have API key param
            expect.anything(),
            expect.objectContaining({
                headers: expect.objectContaining({ 'Authorization': 'Bearer mock-token' })
            })
        );
    });

    it('should use API Key when useOwnKey is true', async () => {
        mockSettingsStore.useOwnKey = true;
        (mockSettingsStore.getApiKey as jest.Mock).mockResolvedValue('my-api-key');

        const mockResponse = { data: { candidates: [{ content: { parts: [{ text: '{"username": "u"}' }] } }] } };
        mockedAxios.post.mockResolvedValue(mockResponse);

        await service.extractCredentials('img');

        expect(mockAuthService.getAccessToken).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('key=my-api-key'),
            expect.anything(),
            expect.anything()
        );
    });

    it('should throw if API Key missing in own-key mode', async () => {
        mockSettingsStore.useOwnKey = true;
        (mockSettingsStore.getApiKey as jest.Mock).mockResolvedValue(null);

        await expect(service.extractCredentials('img')).rejects.toThrow('Gemini API Key is missing');
    });
});

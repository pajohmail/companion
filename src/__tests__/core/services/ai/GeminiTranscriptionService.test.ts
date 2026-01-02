import axios from 'axios';
import { GeminiTranscriptionService } from '@core/services/ai/GeminiTranscriptionService';
import { SettingsStore } from '@state/stores/SettingsStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockSettingsStore = {
    useOwnKey: true,
    getApiKey: jest.fn().mockResolvedValue('key123'),
} as unknown as SettingsStore;

const mockAuthService = {
    getAccessToken: jest.fn(),
} as any;

describe('GeminiTranscriptionService', () => {
    let service: GeminiTranscriptionService;

    beforeEach(() => {
        service = new GeminiTranscriptionService(mockSettingsStore, mockAuthService);
        jest.clearAllMocks();
    });

    it('should transcribe audio', async () => {
        mockedAxios.post.mockResolvedValue({
            data: { candidates: [{ content: { parts: [{ text: 'Transcription' }] } }] }
        });

        const result = await service.transcribe('base64audio', 'audio/mp4');

        expect(result).toBe('Transcription');
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('key=key123'),
            expect.objectContaining({
                contents: [
                    expect.objectContaining({
                        parts: expect.arrayContaining([
                            expect.objectContaining({ inline_data: { mime_type: 'audio/mp4', data: 'base64audio' } })
                        ])
                    })
                ]
            }),
            expect.anything()
        );
    });
});

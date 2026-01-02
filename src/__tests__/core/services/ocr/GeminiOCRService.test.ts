import axios from 'axios';
import { GeminiOCRService } from '@core/services/ocr/GeminiOCRService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeminiOCRService', () => {
    let service: GeminiOCRService;

    beforeEach(() => {
        service = new GeminiOCRService();
        jest.clearAllMocks();
    });

    it('should extract credentials from image', async () => {
        const mockResponse = {
            data: {
                candidates: [{
                    content: {
                        parts: [{
                            text: '{"username": "user", "password": "pass"}'
                        }]
                    }
                }]
            }
        };
        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await service.extractCredentials('base64data');

        expect(result.username).toBe('user');
        expect(result.password).toBe('pass');
        expect(mockedAxios.post).toHaveBeenCalled();
    });

    it('should handle markdown formatted json', async () => {
        const mockResponse = {
            data: {
                candidates: [{
                    content: {
                        parts: [{
                            text: '```json\n{"username": "user"}\n```'
                        }]
                    }
                }]
            }
        };
        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await service.extractCredentials('base64data');

        expect(result.username).toBe('user');
    });

    it('should throw error on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('API Error'));
        await expect(service.extractCredentials('d')).rejects.toThrow('API Error');
    });
});

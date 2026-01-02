import axios from 'axios';
import { SettingsStore } from '../../../state/stores/SettingsStore';
import { IAuthService } from '../auth/AuthService';
import { Logger } from '../../../infrastructure/utils/Logger';

// Note: For audio processing, we'll need to read the file into base64.
// Usually this is done at the UseCase level or UI level to keep service pure.
// But for convenience, let's assume we pass the base64 string here.
// Valid MIME types: 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/aac'.
// Expo AV typical output: 'audio/m4a' or 'audio/mp4'.

export class GeminiTranscriptionService {
    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    constructor(
        private settingsStore: SettingsStore,
        private authService: IAuthService
    ) { }

    private async getHeaders(): Promise<Record<string, string>> {
        if (this.settingsStore.useOwnKey) {
            return { 'Content-Type': 'application/json' };
        } else {
            const token = await this.authService.getAccessToken();
            if (!token) throw new Error('No access token available for Gemini');
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        }
    }

    private async getUrl(): Promise<string> {
        if (this.settingsStore.useOwnKey) {
            const key = await this.settingsStore.getApiKey();
            if (!key) throw new Error('Gemini API Key is missing');
            return `${this.API_URL}?key=${key}`;
        }
        return this.API_URL;
    }

    async transcribe(audioBase64: string, mimeType: string = 'audio/mp4'): Promise<string> {
        try {
            const headers = await this.getHeaders();
            const url = await this.getUrl();

            const prompt = `Transcribe the audio accurately. Return only the transcription text.`;

            const payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: audioBase64
                            }
                        }
                    ]
                }]
            };

            const response = await axios.post(url, payload, { headers });
            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error('No transcription returned from Gemini');

            return text.trim();
        } catch (error) {
            Logger.error('Gemini Transcription failed', error);
            throw error;
        }
    }
}

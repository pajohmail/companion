import axios from 'axios';
import { IOCRService, ExtractedCredentials } from './OCRService';
import { SettingsStore } from '../../../state/stores/SettingsStore';
import { IAuthService } from '../auth/AuthService';
import { Logger } from '../../../infrastructure/utils/Logger';

export class GeminiOCRService implements IOCRService {
    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    constructor(
        private settingsStore: SettingsStore,
        private authService: IAuthService
    ) { }

    private async getHeaders(): Promise<Record<string, string>> {
        if (this.settingsStore.useOwnKey) {
            // Using API Key doesn't need Bearer token usually, passing key in query param is standard for Gemini.
            // But we can also pass it in header 'x-goog-api-key'.
            // However, the standard is query param ?key=API_KEY.
            // If we use headers, we don't need auth token.
            return {
                'Content-Type': 'application/json'
            };
        } else {
            // Use Account Quota -> Needs OAuth Token
            const token = await this.authService.getAccessToken();
            if (!token) {
                throw new Error('No access token available for Gemini Account Quota');
            }
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                // Does Gemini API support standard Google Auth for free quota? 
                // Yes, via Vertex AI or simply generativelanguage scope.
                // We added the scope earlier? No, we added drive.appdata.
                // We need to ensure we have the right scope: 'https://www.googleapis.com/auth/generative-language.retriever' or similar?
                // Actually 'https://www.googleapis.com/auth/generative-language.retriever' is for semantic retrieval.
                // For generateContent, commonly it's fine if the project is enabled.
                // But typically for "USER QUOTA" via OAuth, we need a scope.
                // Let's assume 'email profile' + Cloud Platform project link is enough OR we need to add scope.
                // NOTE: 'https://www.googleapis.com/auth/cloud-platform' is too broad.
                // Let's stick to trying with existing scopes or we might need to add one.
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

    async extractCredentials(imageBase64: string): Promise<ExtractedCredentials> {
        try {
            const headers = await this.getHeaders();
            const url = await this.getUrl();

            const prompt = `
                Extract valid credentials from this image. 
                Return ONLY a JSON object with keys: title, username, password, website. 
                If a field is not found, omit it.
                Do not include markdown formatting (like \`\`\`json).
            `;

            const payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: imageBase64
                            }
                        }
                    ]
                }]
            };

            const response = await axios.post(url, payload, { headers });

            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error('No text returned from Gemini');
            }

            // Cleanup markdown if present (e.g. ```json ... ```)
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(cleanText) as ExtractedCredentials;

        } catch (error) {
            Logger.error('Gemini OCR failed', error);
            throw error;
        }
    }
    async extractText(imageBase64: string): Promise<string> {
        try {
            const headers = await this.getHeaders();
            const url = await this.getUrl();

            const prompt = `Extract all text from this image. Return only the raw text, no markdown.`;

            const payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: imageBase64
                            }
                        }
                    ]
                }]
            };

            const response = await axios.post(url, payload, { headers });
            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error('No text returned from Gemini');

            return text.trim();
        } catch (error) {
            Logger.error('Gemini OCR Text Extraction failed', error);
            throw error;
        }
    }
}

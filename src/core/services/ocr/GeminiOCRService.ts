import axios from 'axios';
import { IOCRService, ExtractedCredentials } from './OCRService';
import { AppConfig } from '../../../infrastructure/config/AppConfig';
import { Logger } from '../../../infrastructure/utils/Logger';

export class GeminiOCRService implements IOCRService {
    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    async extractCredentials(imageBase64: string): Promise<ExtractedCredentials> {
        try {
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

            const response = await axios.post(
                `${this.API_URL}?key=${AppConfig.api.geminiApiKey}`,
                payload
            );

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
}

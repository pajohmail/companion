import axios from 'axios';
import { SettingsStore } from '../../../state/stores/SettingsStore';
import { IAuthService } from '../auth/AuthService';
import { Logger } from '../../../infrastructure/utils/Logger';

/**
 * Structure of a chat message.
 */
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

/**
 * Service for interacting with Gemini AI for Chat and Summarization.
 * Supports dual authentication (User API Key or Account Quota).
 */
export class GeminiChatService {
    private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    constructor(
        private settingsStore: SettingsStore,
        private authService: IAuthService
    ) { }

    /**
     * Determines headers based on authentication mode.
     */
    private async getHeaders(): Promise<Record<string, string>> {
        if (this.settingsStore.useOwnKey) {
            return {
                'Content-Type': 'application/json'
            };
        } else {
            const token = await this.authService.getAccessToken();
            if (!token) {
                throw new Error('No access token available for Gemini Account Quota');
            }
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

    /**
     * Sends a message to the Gemini Chat model, including history and optional context.
     * @param history - Array of previous messages.
     * @param newMessage - The user's new message.
     * @param context - (Optional) Additional context (e.g., document content).
     * @returns The AI's response text.
     */
    async chat(history: ChatMessage[], newMessage: string, context?: string): Promise<string> {
        try {
            const headers = await this.getHeaders();
            const url = await this.getUrl();

            const contents = [];

            // Add system instruction / context if needed
            // Gemini 1.5 supports system_instruction, but via API it's a separate field.
            // For simple chat, we can prepend context to first message or use history.

            if (context) {
                // Prepend context to the conversation or treat as system prompt?
                // Let's add it as the first user part or dedicated logic.
                // Ideally: system_instruction field.
                // But strictly, let's just stick to messages for now.
            }

            // Convert format
            const formattedHistory = history.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            // Add new message
            const currentMessage = {
                role: 'user',
                parts: [{ text: context ? `Context:\n${context}\n\nUser Question: ${newMessage}` : newMessage }]
            };

            const payload = {
                contents: [...formattedHistory, currentMessage],
                generationConfig: {
                    maxOutputTokens: 1000,
                }
            };

            const response = await axios.post(url, payload, { headers });

            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error('No response from Gemini');
            }

            return text;

        } catch (error) {
            Logger.error('Gemini Chat failed', error);
            throw error;
        }
    }

    /**
     * Summarizes the provided text using Gemini.
     * @param text - The text content to summarize.
     * @returns A concise summary.
     */
    async summarize(text: string): Promise<string> {
        return this.chat([], "Summarize the following document content concisely:", text);
    }
}

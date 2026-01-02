import { IAudioRecorderService } from '../../services/audio/AudioRecorderService';
import { GeminiTranscriptionService } from '../../services/ai/GeminiTranscriptionService';
import * as FileSystem from 'expo-file-system';

export class VoiceNoteUseCase {
    constructor(
        private recorderService: IAudioRecorderService,
        private transcriptionService: GeminiTranscriptionService
    ) { }

    async startRecording(): Promise<void> {
        await this.recorderService.startRecording();
    }

    async stopRecording(): Promise<string | null> {
        return this.recorderService.stopRecording();
    }

    async transcribeAudio(uri: string): Promise<string> {
        // Read file as base64
        const fileContent = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64',
        });

        // Determine mime type (simplified)
        const mimeType = uri.endsWith('.m4a') ? 'audio/m4a' : 'audio/mp4';

        return this.transcriptionService.transcribe(fileContent, mimeType);
    }
}

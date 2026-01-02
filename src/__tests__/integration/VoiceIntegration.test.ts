import { DocumentStore } from '@state/stores/DocumentStore';
import { AddDocumentUseCase } from '@core/use-cases/document/DocumentUseCases';
import { VoiceNoteUseCase } from '@core/use-cases/document/VoiceNoteUseCases';
import { DocumentRepository } from '@core/repositories/DocumentRepository';
import { GeminiOCRService } from '@core/services/ocr/GeminiOCRService';
import { GeminiTranscriptionService } from '@core/services/ai/GeminiTranscriptionService';
import { AudioRecorderService } from '@core/services/audio/AudioRecorderService';
import * as FileSystem from 'expo-file-system';

// Mock dependencies
const mockRepo = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
} as unknown as DocumentRepository;

const mockOCR = {
    extractText: jest.fn(),
} as unknown as GeminiOCRService;

const mockAudioRecorder = {
    startRecording: jest.fn(),
    stopRecording: jest.fn().mockResolvedValue('file://audio.m4a'),
    requestPermissions: jest.fn().mockResolvedValue(true),
} as unknown as AudioRecorderService;

const mockTranscription = {
    transcribe: jest.fn().mockResolvedValue('Transcribed Text'),
} as unknown as GeminiTranscriptionService;

describe('Voice Integration', () => {
    let store: DocumentStore;
    let addUseCase: AddDocumentUseCase;
    let voiceUseCase: VoiceNoteUseCase;

    beforeEach(() => {
        addUseCase = new AddDocumentUseCase(mockRepo, mockOCR);
        voiceUseCase = new VoiceNoteUseCase(mockAudioRecorder, mockTranscription);
        store = new DocumentStore(mockRepo, addUseCase, {} as any, voiceUseCase);
        jest.clearAllMocks();
        (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('base64audio');
    });

    it('should record, transcribe, and add document', async () => {
        // 1. Start Recording
        await store.startRecording();
        expect(store.isRecording).toBe(true);
        expect(mockAudioRecorder.startRecording).toHaveBeenCalled();

        // 2. Stop Recording & Transcribe
        const text = await store.stopRecordingAndTranscribe();
        expect(store.isRecording).toBe(false);
        expect(mockAudioRecorder.stopRecording).toHaveBeenCalled();
        expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith('file://audio.m4a', expect.anything());
        expect(mockTranscription.transcribe).toHaveBeenCalledWith('base64audio', 'audio/m4a');
        expect(text).toBe('Transcribed Text');

        // 3. Add Document
        await store.addDocument('Voice Note', undefined, text!);
        expect(mockRepo.save).toHaveBeenCalled();
        expect(store.documents[0].content).toBe('Transcribed Text');
    });
});

import { DocumentStore } from '@state/stores/DocumentStore';
import { AddDocumentUseCase } from '@core/use-cases/document/DocumentUseCases';
import { DocumentRepository } from '@core/repositories/DocumentRepository';
import { GeminiOCRService } from '@core/services/ocr/GeminiOCRService';
import { Document } from '@core/entities/Document';

// Mock dependencies
const mockRepo = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
} as unknown as DocumentRepository;

const mockOCR = {
    extractText: jest.fn(),
} as unknown as GeminiOCRService;

const mockChat = {
    chat: jest.fn(),
} as any;

describe('Document Integration', () => {
    let store: DocumentStore;
    let addUseCase: AddDocumentUseCase;

    beforeEach(() => {
        addUseCase = new AddDocumentUseCase(mockRepo, mockOCR);
        store = new DocumentStore(mockRepo, addUseCase, {} as any, {} as any); // mock ChatUseCase & VoiceNoteUseCase
        jest.clearAllMocks();
    });

    it('should add a text document', async () => {
        const doc = await store.addDocument('My Doc', undefined, 'Hello World');

        expect(mockRepo.save).toHaveBeenCalled();
        expect(store.documents).toHaveLength(1);
        expect(store.documents[0].title).toBe('My Doc');
        expect(store.documents[0].content).toBe('Hello World');
    });

    it('should add an image document with OCR', async () => {
        (mockOCR.extractText as jest.Mock).mockResolvedValue('Extracted Text');

        const doc = await store.addDocument('Scan', 'base64img', undefined);

        expect(mockOCR.extractText).toHaveBeenCalledWith('base64img');
        expect(store.documents[0].content).toBe('Extracted Text');
        expect(store.documents[0].mimeType).toBe('image/jpeg');
    });
});

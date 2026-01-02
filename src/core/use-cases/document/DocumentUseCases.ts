import { IDocumentRepository } from '../../repositories/DocumentRepository';
import { IOCRService } from '../../services/ocr/OCRService';
import { GeminiChatService } from '../../services/ai/GeminiChatService';
import { Document } from '../../entities/Document';

export class AddDocumentUseCase {
    constructor(
        private repository: IDocumentRepository,
        private ocrService: IOCRService
    ) { }

    async execute(props: { title: string, imageBase64?: string, text?: string, tags?: string[] }): Promise<Document> {
        let content = props.text || '';

        if (props.imageBase64 && !content) {
            content = await this.ocrService.extractText(props.imageBase64);
        }

        const doc = new Document({
            title: props.title,
            mimeType: props.imageBase64 ? 'image/jpeg' : 'text/plain', // Simplification
            content,
            tags: props.tags
        });

        // Optional: Summarize content using ChatService? 
        // We can do that later or separately.

        await this.repository.save(doc);
        return doc;
    }
}

export class ChatWithDocumentUseCase {
    constructor(
        private repository: IDocumentRepository,
        private chatService: GeminiChatService
    ) { }

    async execute(documentId: string, message: string, history: any[]): Promise<string> {
        const doc = await this.repository.findById(documentId);
        if (!doc) throw new Error('Document not found');

        // We pass document content as context
        return this.chatService.chat(history, message, doc.content);
    }
}

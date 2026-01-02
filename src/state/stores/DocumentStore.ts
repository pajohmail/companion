import { makeAutoObservable, runInAction } from 'mobx';
import { Document } from '../../core/entities/Document';
import { AddDocumentUseCase, ChatWithDocumentUseCase } from '../../core/use-cases/document/DocumentUseCases';
import { IDocumentRepository } from '../../core/repositories/DocumentRepository';
import { Logger } from '../../infrastructure/utils/Logger';

export class DocumentStore {
    documents: Document[] = [];
    selectedDocument: Document | null = null;
    isLoading = false;
    error: string | null = null;
    chatHistory: { role: 'user' | 'model', text: string }[] = [];

    constructor(
        private repository: IDocumentRepository,
        private addDocumentUseCase: AddDocumentUseCase,
        private chatWithDocumentUseCase: ChatWithDocumentUseCase
    ) {
        makeAutoObservable(this);
    }

    async loadDocuments() {
        this.isLoading = true;
        try {
            const docs = await this.repository.findAll();
            runInAction(() => {
                this.documents = docs;
                this.error = null;
            });
        } catch (e) {
            Logger.error('Failed to load documents', e);
            runInAction(() => {
                this.error = 'Failed to load documents';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async addDocument(title: string, imageBase64?: string, text?: string, tags?: string[]) {
        this.isLoading = true;
        try {
            const doc = await this.addDocumentUseCase.execute({ title, imageBase64, text, tags });
            runInAction(() => {
                this.documents.push(doc);
                this.error = null;
            });
            return doc;
        } catch (e) {
            Logger.error('Failed to add document', e);
            runInAction(() => {
                this.error = 'Failed to add document';
            });
            return null;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async selectDocument(id: string) {
        const doc = this.documents.find(d => d.id === id);
        if (doc) {
            this.selectedDocument = doc;
            this.chatHistory = []; // Reset chat
        }
    }

    async sendMessage(message: string) {
        if (!this.selectedDocument) return;

        this.chatHistory.push({ role: 'user', text: message });

        try {
            // Optimistic update done, now fetch response
            const response = await this.chatWithDocumentUseCase.execute(
                this.selectedDocument.id,
                message,
                this.chatHistory.slice(0, -1) // Exclude current message? implementation relies on history excluding current?
                // ChatService expects history BEFORE current.
                // But AddDocumentUseCase uses ChatService.chat(history, msg).
                // check ChatService.chat signature: (history[], newMessage, context)
                // So passing history excluding new message is correct.
            );

            runInAction(() => {
                this.chatHistory.push({ role: 'model', text: response });
            });
        } catch (e) {
            Logger.error('Chat failed', e);
            runInAction(() => {
                this.chatHistory.push({ role: 'model', text: 'Error: Failed to get response.' });
            });
        }
    }
}

import { Entity, EntityProps } from './base/Entity';

/**
 * Properties required to create a Document entity.
 */
export interface DocumentProps extends EntityProps {
    title: string;
    originalPath?: string; // e.g. Drive ID or local path
    mimeType: string;
    content?: string; // Extracted text content
    summary?: string; // AI Summary
    tags?: string[];
}

/**
 * Represents a digital document or note.
 * Can contain extracted text from images or Voice transcripts.
 * Supports AI-generated summaries.
 */
export class Document extends Entity<DocumentProps> {
    public title: string;
    public originalPath: string;
    public mimeType: string;
    public content: string;
    public summary: string;
    public tags: string[];

    constructor(props: DocumentProps, id?: string, createdAt?: Date, updatedAt?: Date) {
        super(props, id, createdAt, updatedAt);
        this.title = props.title;
        this.originalPath = props.originalPath || '';
        this.mimeType = props.mimeType;
        this.content = props.content || '';
        this.summary = props.summary || '';
        this.tags = props.tags || [];
    }

    /**
     * Updates the content and optionally the summary of the document.
     * Automatically updates the `updatedAt` timestamp.
     * @param content - The new text content.
     * @param summary - (Optional) The new summary.
     */
    updateContent(content: string, summary?: string) {
        this.content = content;
        if (summary) this.summary = summary;
        this.updateTimestamp();
    }
}

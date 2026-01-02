import { Entity } from './base/Entity';

/**
 * Properties required to create a Password entity.
 */
export interface PasswordProps {
    title: string;
    username: string; // Encrypted
    password: string; // Encrypted
    website?: string | null;
    notes?: string | null; // Encrypted
    category?: string | null;
}

/**
 * Represents a stored password credential.
 * Contains fields for authentication (username, password) and metadata (title, website).
 * Sensitive fields (username, password, notes) are intended to be encrypted before storage.
 */
export class Password extends Entity<PasswordProps> {
    public title: string;
    public username: string;
    public password: string;
    public website: string | null;
    public notes: string | null;
    public category: string | null;

    /**
     * Creates a new Password entity.
     * @param props - The properties of the password.
     * @param id - Optional ID (if refreshing from storage).
     * @param createdAt - Optional creation date.
     * @param updatedAt - Optional update date.
     */
    constructor(props: PasswordProps, id?: string, createdAt?: Date, updatedAt?: Date) {
        super(props, id, createdAt, updatedAt);
        this.title = props.title;
        this.username = props.username;
        this.password = props.password;
        this.website = props.website || null;
        this.notes = props.notes || null;
        this.category = props.category || null;
    }
}

import { Entity } from './base/Entity';

export interface PasswordProps {
    title: string;
    username: string; // Encrypted
    password: string; // Encrypted
    website?: string | null;
    notes?: string | null; // Encrypted
    category?: string | null;
}

export class Password extends Entity<PasswordProps> {
    public title: string;
    public username: string;
    public password: string;
    public website: string | null;
    public notes: string | null;
    public category: string | null;

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

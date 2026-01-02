export interface ExtractedCredentials {
    title?: string;
    username?: string;
    password?: string;
    website?: string;
}

export interface IOCRService {
    extractCredentials(imageBase64: string): Promise<ExtractedCredentials>;
    extractText(imageBase64: string): Promise<string>;
}

import axios from 'axios';
import { IAuthService } from '../auth/AuthService';
import { Logger } from '../../../infrastructure/utils/Logger';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
}

export class GoogleDriveService {
    private readonly BASE_URL = 'https://www.googleapis.com/drive/v3/files';
    private readonly UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

    constructor(private authService: IAuthService) { }

    private async getHeaders() {
        const token = await this.authService.getAccessToken();
        if (!token) {
            throw new Error('No access token available');
        }
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    async listFiles(query?: string): Promise<DriveFile[]> {
        try {
            const headers = await this.getHeaders();
            const q = query ? `${query} and trashed = false` : 'trashed = false';
            const response = await axios.get(this.BASE_URL, {
                headers,
                params: {
                    q,
                    spaces: 'appDataFolder',
                    fields: 'files(id, name, mimeType)',
                },
            });
            return response.data.files || [];
        } catch (error) {
            Logger.error('Drive listFiles failed', error);
            throw error;
        }
    }

    async uploadFile(name: string, content: string, mimeType: string = 'application/json'): Promise<DriveFile> {
        try {
            const token = await this.authService.getAccessToken(); // Manual header construction for multipart if needed, but simple upload for small files:
            // For simple upload (metadata + content), strictly multipart is needed or verify if simple upload works for appData.
            // Let's use multipart/related for metadata + content.

            if (!token) throw new Error('No token');

            const metadata = {
                name,
                mimeType,
                parents: ['appDataFolder'],
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', new Blob([content], { type: mimeType }));

            // Note: React Native FormData is tricky with Blob. 
            // Often simplier to use 2-step: create metadata -> update media, OR verify if library supports simple body for text.
            // Let's implement a simpler "Create empty then update" or use strict multipart if RN allows.
            // Standard JSON body upload solely creates metadata. 
            // Upload endpoint: POST /upload/drive/v3/files?uploadType=multipart

            // To simplify for this phase, let's try the metadata-only create first (if we were just folder), but we need content.
            // Let's use the 'multipart' approach with a helper or manual body construction.

            // Manual body construction for RN:
            const boundary = 'foo_bar_baz';
            const delimiter = `\r\n--${boundary}\r\n`;
            const closeDelim = `\r\n--${boundary}--`;

            const body =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                `Content-Type: ${mimeType}\r\n\r\n` +
                content +
                closeDelim;

            const response = await axios.post(`${this.UPLOAD_URL}?uploadType=multipart`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`,
                },
            });
            return response.data;

        } catch (error) {
            Logger.error('Drive uploadFile failed', error);
            throw error;
        }
    }

    // Helper to find a file by name in appDataFolder
    async findFileByName(name: string): Promise<DriveFile | null> {
        const files = await this.listFiles(`name = '${name}' and 'appDataFolder' in parents`);
        return files.length > 0 ? files[0] : null;
    }

    async downloadFile(fileId: string): Promise<any> {
        try {
            const headers = await this.getHeaders();
            const response = await axios.get(`${this.BASE_URL}/${fileId}`, {
                headers,
                params: { alt: 'media' },
            });
            return response.data;
        } catch (error) {
            Logger.error('Drive downloadFile failed', error);
            throw error;
        }
    }

    async updateFile(fileId: string, content: string, mimeType: string = 'application/json'): Promise<DriveFile> {
        try {
            // PATCH https://www.googleapis.com/upload/drive/v3/files/fileId?uploadType=media
            // Note: using upload endpoint for content update
            const token = await this.authService.getAccessToken();
            if (!token) throw new Error("No token");

            const response = await axios.patch(`${this.UPLOAD_URL}/${fileId}?uploadType=media`, content, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': mimeType
                }
            });
            return response.data;
        } catch (error) {
            Logger.error('Drive updateFile failed', error);
            throw error;
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        try {
            const headers = await this.getHeaders();
            await axios.delete(`${this.BASE_URL}/${fileId}`, { headers });
        } catch (error) {
            Logger.error('Drive deleteFile failed', error);
            throw error;
        }
    }
}

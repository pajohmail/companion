import { Logger } from './Logger';

export class AppError extends Error {
    constructor(public message: string, public code: string, public originalError?: any) {
        super(message);
    }
}

export class ErrorHandler {
    static handle(error: any): void {
        if (error instanceof AppError) {
            Logger.error(`AppError: ${error.code} - ${error.message}`, error);
        } else if (error instanceof Error) {
            Logger.error(`Unexpected Error: ${error.message}`, error);
        } else {
            Logger.error('Unknown Error', error);
        }
    }
}

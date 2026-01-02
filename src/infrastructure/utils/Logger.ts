export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export class Logger {
    static debug(message: string, ...args: any[]): void {
        if (__DEV__) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    static info(message: string, ...args: any[]): void {
        if (__DEV__) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    static warn(message: string, ...args: any[]): void {
        if (__DEV__) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    static error(message: string, error?: any, ...args: any[]): void {
        console.error(`[ERROR] ${message}`, error, ...args);
    }
}

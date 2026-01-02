import { Logger, LogLevel } from '../../../infrastructure/utils/Logger';

describe('Logger', () => {
    let consoleDebugSpy: jest.SpyInstance;
    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should log debug messages', () => {
        Logger.debug('test debug', { data: 123 });
        expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('[DEBUG] test debug'), { data: 123 });
    });

    it('should log info messages', () => {
        Logger.info('test info');
        expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO] test info'));
    });

    it('should log warn messages', () => {
        Logger.warn('test warn');
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN] test warn'));
    });

    it('should log error messages', () => {
        const error = new Error('oops');
        Logger.error('test error', error);
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR] test error'), error);
    });
});

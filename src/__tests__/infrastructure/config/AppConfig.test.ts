import { AppConfig } from '../../../infrastructure/config/AppConfig';

describe('AppConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should have default values', () => {
        // Re-require to pick up "empty" env
        const Config = require('../../../infrastructure/config/AppConfig').AppConfig;
        expect(Config.env).toBe('development');
        expect(Config.logLevel).toBe('debug');
    });

    it('should read from environment variables', () => {
        process.env.EXPO_PUBLIC_APP_ENV = 'production';
        process.env.EXPO_PUBLIC_LOG_LEVEL = 'error';

        const Config = require('../../../infrastructure/config/AppConfig').AppConfig;
        expect(Config.env).toBe('production');
        expect(Config.logLevel).toBe('error');
    });
});

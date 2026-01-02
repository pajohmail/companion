import { ErrorHandler, AppError } from '../../../infrastructure/utils/ErrorHandler';
import { Logger } from '../../../infrastructure/utils/Logger';

jest.mock('../../../infrastructure/utils/Logger');

describe('ErrorHandler', () => {
    it('should log AppError using Logger', () => {
        const error = new AppError('Something went wrong', 'TEST_ERROR');
        ErrorHandler.handle(error);
        expect(Logger.error).toHaveBeenCalledWith('AppError: TEST_ERROR - Something went wrong', error);
    });

    it('should log generic Error using Logger', () => {
        const error = new Error('Generic error');
        ErrorHandler.handle(error);
        expect(Logger.error).toHaveBeenCalledWith('Unexpected Error: Generic error', error);
    });

    it('should log unknown error types correctly', () => {
        ErrorHandler.handle('string error');
        expect(Logger.error).toHaveBeenCalledWith('Unknown Error', 'string error');
    });
});

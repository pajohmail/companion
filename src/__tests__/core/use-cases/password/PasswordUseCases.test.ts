import { CreatePasswordUseCase, GetPasswordsUseCase } from '@core/use-cases/password/PasswordUseCases';
import { Password } from '@core/entities/Password';

const mockRepo = {
    save: jest.fn(),
    findAll: jest.fn(),
} as any;

const mockEncryption = {
    encrypt: jest.fn((data) => Promise.resolve(`enc_${data}`)),
    decrypt: jest.fn((data) => Promise.resolve(data.replace('enc_', ''))),
} as any;

describe('PasswordUseCases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('CreatePasswordUseCase', () => {
        it('should encrypt fields and save password', async () => {
            const useCase = new CreatePasswordUseCase(mockRepo, mockEncryption);
            const props = { title: 'T', username: 'u', password: 'p', notes: 'n' };

            await useCase.execute(props, 'key');

            expect(mockEncryption.encrypt).toHaveBeenCalledTimes(3); // user, pass, notes
            expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
                username: 'enc_u',
                password: 'enc_p',
                notes: 'enc_n'
            }));
        });
    });

    describe('GetPasswordsUseCase', () => {
        it('should fetch and decrypt passwords', async () => {
            const useCase = new GetPasswordsUseCase(mockRepo, mockEncryption);
            mockRepo.findAll.mockResolvedValue([
                new Password({ title: 'T', username: 'enc_u', password: 'enc_p' })
            ]);

            const results = await useCase.execute('key');

            expect(results).toHaveLength(1);
            expect(results[0].username).toBe('u');
            expect(results[0].password).toBe('p');
        });
    });
});

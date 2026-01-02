import { Password } from '@core/entities/Password';

describe('Password Entity', () => {
    it('should create a Password instance', () => {
        const props = {
            title: 'Google',
            username: 'encrypted_user',
            password: 'encrypted_pass',
            website: 'google.com',
        };
        const password = new Password(props);

        expect(password.id).toBeDefined();
        expect(password.title).toBe('Google');
        expect(password.username).toBe('encrypted_user');
        expect(password.password).toBe('encrypted_pass');
        expect(password.website).toBe('google.com');
        expect(password.createdAt).toBeInstanceOf(Date);
    });
});

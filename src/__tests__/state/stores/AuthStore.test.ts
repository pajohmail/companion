import { AuthStore } from '@state/stores/AuthStore';
import { IAuthService, User } from '@core/services/auth/AuthService';

describe('AuthStore', () => {
    let authStore: AuthStore;
    let mockAuthService: jest.Mocked<IAuthService>;

    beforeEach(() => {
        mockAuthService = {
            login: jest.fn(),
            logout: jest.fn(),
            getCurrentUser: jest.fn(),
            getAccessToken: jest.fn(),
        };
        authStore = new AuthStore(mockAuthService);
    });

    it('should handle successful login', async () => {
        const mockUser: User = { id: '1', email: 'test', name: 'Test', photo: null };
        mockAuthService.login.mockResolvedValue(mockUser);

        await authStore.login();

        expect(authStore.user).toEqual(mockUser);
        expect(authStore.isLoading).toBe(false);
        expect(authStore.error).toBeNull();
    });

    it('should handle failed login', async () => {
        mockAuthService.login.mockRejectedValue(new Error('Login error'));

        await authStore.login();

        expect(authStore.user).toBeNull();
        expect(authStore.isLoading).toBe(false);
        expect(authStore.error).toBe('Login error');
    });

    it('should handle successful logout', async () => {
        authStore.user = { id: '1', email: 'test', name: 'Test', photo: null };

        await authStore.logout();

        expect(authStore.user).toBeNull();
    });
});

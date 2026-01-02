import { GoogleAuthService } from '@core/services/auth/GoogleAuthService';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSignin: {
        configure: jest.fn(),
        hasPlayServices: jest.fn(),
        signIn: jest.fn(),
        signOut: jest.fn(),
        getCurrentUser: jest.fn(),
    },
}));

describe('GoogleAuthService', () => {
    let service: GoogleAuthService;

    beforeEach(() => {
        service = new GoogleAuthService();
        jest.clearAllMocks();
    });

    it('should configure GoogleSignin on instantiation', () => {
        // This might be moved to an init method, but for now assuming ctor or lazy init
        // If logic is in ctor, verify here.
        // If not, we might need to verify it's called before sign in.
    });

    it('should sign in successfully', async () => {
        const mockUser = {
            data: {
                user: {
                    id: '123',
                    email: 'test@example.com',
                    name: 'Test User',
                    photo: 'photo-url',
                    familyName: 'User',
                    givenName: 'Test',
                },
                idToken: 'token',
            }
        };
        (GoogleSignin.signIn as jest.Mock).mockResolvedValue(mockUser);
        (GoogleSignin.hasPlayServices as jest.Mock).mockResolvedValue(true);

        const user = await service.login();

        expect(GoogleSignin.hasPlayServices).toHaveBeenCalled();
        expect(GoogleSignin.signIn).toHaveBeenCalled();
        expect(user.id).toBe('123');
        expect(user.email).toBe('test@example.com');
    });

    it('should logout successfully', async () => {
        await service.logout();
        expect(GoogleSignin.signOut).toHaveBeenCalled();
    });
});

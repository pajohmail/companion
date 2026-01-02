import { IAuthService, User } from './AuthService';
import { GoogleSignin, User as GoogleUser } from '@react-native-google-signin/google-signin';
import { Logger } from '../../../infrastructure/utils/Logger';
import { AppConfig } from '../../../infrastructure/config/AppConfig';

export class GoogleAuthService implements IAuthService {
    async getAccessToken(): Promise<string | null> {
        try {
            const tokens = await GoogleSignin.getTokens();
            return tokens.accessToken;
        } catch (error) {
            Logger.warn('Failed to get access token', error);
            return null;
        }
    }

    constructor() {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata'],
            webClientId: AppConfig.api.googleClientId.web,
            iosClientId: AppConfig.api.googleClientId.ios,
            offlineAccess: true,
        });
    }

    async login(): Promise<User> {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();

            if (response.data) {
                return this.mapGoogleUserToUser(response.data.user);
            } else {
                throw new Error('No user data returned from Google Sign-In');
            }
        } catch (error) {
            Logger.error('Google Sign-In failed', error);
            throw error;
        }
    }

    async logout(): Promise<void> {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            Logger.error('Google Sign-Out failed', error);
            throw error;
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const currentUser = await GoogleSignin.getCurrentUser();
            return currentUser ? this.mapGoogleUserToUser(currentUser.user) : null;
        } catch (error) {
            Logger.warn('Failed to get current user', error);
            return null;
        }
    }

    private mapGoogleUserToUser(googleUser: GoogleUser['user']): User {
        return {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            photo: googleUser.photo,
        };
    }
}

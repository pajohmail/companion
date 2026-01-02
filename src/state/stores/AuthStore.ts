import { makeAutoObservable, runInAction } from 'mobx';
import { IAuthService, User } from '../../core/services/auth/AuthService';
import { Logger } from '../../infrastructure/utils/Logger';

export class AuthStore {
    user: User | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    constructor(private authService: IAuthService) {
        makeAutoObservable(this);
    }

    async login() {
        this.isLoading = true;
        this.error = null;
        try {
            const user = await this.authService.login();
            runInAction(() => {
                this.user = user;
                this.isLoading = false;
            });
        } catch (error: any) {
            runInAction(() => {
                this.error = error.message || 'Login failed';
                this.isLoading = false;
            });
            Logger.error('Login action failed', error);
        }
    }

    async logout() {
        this.isLoading = true;
        try {
            await this.authService.logout();
            runInAction(() => {
                this.user = null;
                this.isLoading = false;
            });
        } catch (error: any) {
            runInAction(() => {
                this.error = error.message || 'Logout failed';
                this.isLoading = false;
            });
            Logger.error('Logout action failed', error);
        }
    }
}

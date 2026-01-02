export interface User {
    id: string;
    email: string;
    name: string | null;
    photo: string | null;
}

export interface IAuthService {
    login(): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    getAccessToken(): Promise<string | null>;
}

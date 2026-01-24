export type AuthProvider = 'google' | 'facebook' | 'github' | 'password' | 'microsoft' | 'twitter';

export interface AuthResponse {
    token: string;
    user: IUser;
}

export interface IUser {
    id?: string,
    email: string;
    providers: Partial<Record<AuthProvider, string>>; // Partial để không bắt buộc tất cả providers
    customerConfigId?: string;
    [key: string]: any;
}
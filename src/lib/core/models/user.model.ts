export type AuthProvider = 'google' | 'facebook' | 'github' | 'password' | 'microsoft' | 'twitter';

export interface AuthResponse {
    token: string;
    user: IUser;
}

export interface IUser {
    id?: string,
    email: string;
    providers: AuthProvider[];
    customerConfigId?: string;
    [key: string]: any;
}
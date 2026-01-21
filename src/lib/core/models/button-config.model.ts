export type SocialProvider = 'google' | 'facebook' | 'github' | 'twitter' | 'linkedin' | 'microsoft' | 'apple' | 'amazon' | 'gitlab' | 'bitbucket' | 'slack' | 'twitch' | 'youtube' | 'discord' | 'spotify' | 'tiktok' | 'pinterest' | 'reddit' | 'instagram';
export interface NzIconConfig {
    nzType: string;
    nzTheme: 'outline' | 'fill' | 'twotone';
}

export interface ButtonConfig {
    provider: SocialProvider;
    label?: string;
    icon?: NzIconConfig;
    color?: string;
    backgroundColor?: string;
    hoverColor?: string;
    disabled?: boolean;
    onClick?: () => void;
    class?: string;
    size?: 'small' | 'medium' | 'large';
}
export interface SocialButtonConfig extends ButtonConfig {
    scopes?: string[];
    redirectUri?: string;
}

import { SocialProvider, ButtonConfig } from '../models/button-config.model';

export const SOCIAL_BUTTON_REGISTRY: Record<SocialProvider, Partial<ButtonConfig>> = {
  google: {
    label: 'Continue with Google',
    backgroundColor: '#ffffff',
    color: '#3c4043',
    hoverColor: '#f8f9fa',
    icon: { nzType: 'google', nzTheme: 'outline' }
  },
  facebook: {
    label: 'Continue with Facebook',
    backgroundColor: '#1877f2',
    color: '#ffffff',
    hoverColor: '#166fe5',
    icon: { nzType: 'facebook', nzTheme: 'fill' }
  },
  spotify: {
    label: 'Continue with Spotify',
    backgroundColor: '#1db954',
    color: '#ffffff',
    hoverColor: '#1ed760',
    icon: { nzType: 'spotify', nzTheme: 'outline' }
  },
  github: {
    label: 'Continue with GitHub',
    backgroundColor: '#24292e',
    color: '#ffffff',
    hoverColor: '#2f363d',
    icon: { nzType: 'github', nzTheme: 'fill' }
  },
  apple: {
    label: 'Continue with Apple',
    backgroundColor: '#000000',
    color: '#ffffff',
    hoverColor: '#1a1a1a',
    icon: { nzType: 'apple', nzTheme: 'outline' }
  },
  microsoft: {
    label: 'Continue with Microsoft',
    backgroundColor: '#0078d4',
    color: '#ffffff',
    hoverColor: '#106ebe',
    icon: { nzType: 'windows', nzTheme: 'outline' }
  },
  twitter: {
    label: 'Continue with Twitter',
    backgroundColor: '#1da1f2',
    color: '#ffffff',
    hoverColor: '#1a91da',
    icon: { nzType: 'twitter', nzTheme: 'outline' }
  },
  linkedin: {
    label: 'Continue with LinkedIn',
    backgroundColor: '#0077b5',
    color: '#ffffff',
    hoverColor: '#006399',
    icon: { nzType: 'linkedin', nzTheme: 'fill' }
  },
  instagram: {
    label: 'Continue with Instagram',
    backgroundColor: '#e4405f',
    color: '#ffffff',
    hoverColor: '#d32e4a',
    icon: { nzType: 'instagram', nzTheme: 'outline' }
  },
  discord: {
    label: 'Continue with Discord',
    backgroundColor: '#5865f2',
    color: '#ffffff',
    hoverColor: '#4752c4',
    icon: { nzType: 'discord', nzTheme: 'outline' }
  },
  twitch: {
    label: 'Continue with Twitch',
    backgroundColor: '#9146ff',
    color: '#ffffff',
    hoverColor: '#772ce8',
    icon: { nzType: 'twitch', nzTheme: 'outline' }
  },
  // Default configs for providers not yet configured
  amazon: {
    label: 'Continue with Amazon',
    backgroundColor: '#ff9900',
    color: '#ffffff',
    hoverColor: '#e68900',
    icon: { nzType: 'amazon', nzTheme: 'outline' }
  },
  gitlab: {
    label: 'Continue with GitLab',
    backgroundColor: '#fc6d26',
    color: '#ffffff',
    hoverColor: '#e55a1a',
    icon: { nzType: 'gitlab', nzTheme: 'fill' }
  },
  bitbucket: {
    label: 'Continue with Bitbucket',
    backgroundColor: '#0052cc',
    color: '#ffffff',
    hoverColor: '#004099',
    icon: { nzType: 'bitbucket', nzTheme: 'fill' }
  },
  slack: {
    label: 'Continue with Slack',
    backgroundColor: '#4a154b',
    color: '#ffffff',
    hoverColor: '#3d0f3e',
    icon: { nzType: 'slack', nzTheme: 'fill' }
  },
  youtube: {
    label: 'Continue with YouTube',
    backgroundColor: '#ff0000',
    color: '#ffffff',
    hoverColor: '#cc0000',
    icon: { nzType: 'youtube', nzTheme: 'fill' }
  },
  tiktok: {
    label: 'Continue with TikTok',
    backgroundColor: '#000000',
    color: '#ffffff',
    hoverColor: '#1a1a1a',
    icon: { nzType: 'tiktok', nzTheme: 'outline' }
  },
  pinterest: {
    label: 'Continue with Pinterest',
    backgroundColor: '#bd081c',
    color: '#ffffff',
    hoverColor: '#9a0717',
    icon: { nzType: 'pinterest', nzTheme: 'fill' }
  },
  reddit: {
    label: 'Continue with Reddit',
    backgroundColor: '#ff4500',
    color: '#ffffff',
    hoverColor: '#cc3700',
    icon: { nzType: 'reddit', nzTheme: 'fill' }
  }
};
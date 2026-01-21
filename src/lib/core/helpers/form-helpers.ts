import { FormField, FormConfig } from '../models/form-config.model';
import { InputConfig } from '../models/input-config.model';
import { ButtonConfig, SocialProvider } from '../models/button-config.model';
import { NzIconModule } from 'ng-zorro-antd/icon';


export function input(id: string, type: string, label: string, placeholder: string, opts: Partial<InputConfig>): FormField {
    return {
        id,
        type: 'input',
        config: {
            type,
            label,
            placeholder,
            id,
            value: '',
            required: true,
            disabled: false,
            size: 'large',
            ...opts
          },
          label,
          required: true,
          grid: {cols: 2, span: 1},
          options: []
    }
}
export function checkbox(id: string, label: string, required: false): FormField {
    return {id, type: 'checkbox', label, required};
}
export function divider(label: string): FormField {
    return {id: 'divider', type: 'divider', label};
}
export function socialButton(
    provider: SocialProvider, 
    opts?: Partial<ButtonConfig>
  ): ButtonConfig {
    const defaultConfigs: Partial<Record<SocialProvider, Partial<ButtonConfig>>> = {
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
      }
    };
  
    return {
      provider,
      ...defaultConfigs[provider],
      disabled: false,
      size: 'large',
      ...opts
    };
  }
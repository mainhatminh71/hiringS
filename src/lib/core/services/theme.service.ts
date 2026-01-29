import {Injectable, signal, computed} from '@angular/core';
import  {SurveyThemeKey} from '../helpers/theme-helper';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly themes: SurveyThemeKey[] = [
        'default',
        'default-dark',
        'borderless',
        'borderless-dark',
        'flat',
        'flat-dark',
        'contrast',
        'contrast-dark',
        'sharp',
        'sharp-dark',
        'layered',
        'layered-dark',
        'plain',
        'plain-dark',
        'solid-dark',
        'doubleborder',
        'doubleborder-dark',
        'threedimensional',
        'threedimensional-dark',
      ];

    // Theme color mapping - màu primary của mỗi theme
    private readonly themeColors: Record<SurveyThemeKey, string> = {
    'default': '#19b394',
    'default-dark': '#fbbf24', // Vàng đen
    'borderless': '#3b82f6',
    'borderless-dark': '#3b82f6',
    'flat': '#22c55e', // Xanh lá trắng
    'flat-dark': '#16a34a', // Xanh lá đen
    'contrast': '#fbbf24', // Vàng đen, vàng background, đen font chữ
    'contrast-dark': '#374151', // Vàng đen, đen background, vàng font chữ (#fbbf24)
    'sharp': '#7c3aed', // Tím đậm trắng
    'sharp-dark': '#1e3a8a', // Đen xanh biển
    'layered': '#a855f7', // Tím nhạt trắng
    'layered-dark': '#581c87', // Tím đậm đen
    'plain': '#3b82f6', // Trắng xanh biển
    'plain-dark': '#1e40af', // Xanh biển đen
    'solid-dark': '#14b8a6',
    'doubleborder': '#6b7280', // Tím xám
    'doubleborder-dark': '#0ea5e9', // Xanh nhạt đen
    'threedimensional': '#ec4899', // Trắng hồng đậm
    'threedimensional-dark': '#be185d', // Đen hồng đậm
};
private readonly themeBackgroundColors: Record<SurveyThemeKey, { 
    sidebar: string; 
    main: string; 
    border: string;
  }> = {
    'default': { sidebar: '#f8f9fa', main: '#ffffff', border: '#19b394' },
    'default-dark': { sidebar: '#1f2937', main: '#111827', border: '#fbbf24' },
    'borderless': { sidebar: '#f8f9fa', main: '#ffffff', border: '#3b82f6' },
    'borderless-dark': { sidebar: '#1e293b', main: '#0f172a', border: '#3b82f6' },
    'flat': { sidebar: '#f0fdf4', main: '#ffffff', border: '#22c55e' },
    'flat-dark': { sidebar: '#14532d', main: '#052e16', border: '#16a34a' },
    'contrast': { sidebar: '#fef3c7', main: '#fffbeb', border: '#fbbf24' },
    'contrast-dark': { sidebar: '#1f2937', main: '#111827', border: '#fbbf24' },
    'sharp': { sidebar: '#f3e8ff', main: '#ffffff', border: '#7c3aed' },
    'sharp-dark': { sidebar: '#1e1b4b', main: '#0f172a', border: '#1e3a8a' },
    'layered': { sidebar: '#faf5ff', main: '#ffffff', border: '#a855f7' },
    'layered-dark': { sidebar: '#3b0764', main: '#1e1b4b', border: '#581c87' },
    'plain': { sidebar: '#eff6ff', main: '#ffffff', border: '#3b82f6' },
    'plain-dark': { sidebar: '#1e3a8a', main: '#1e40af', border: '#1e40af' },
    'solid-dark': { sidebar: '#0f766e', main: '#134e4a', border: '#14b8a6' },
    'doubleborder': { sidebar: '#f3f4f6', main: '#ffffff', border: '#6b7280' },
    'doubleborder-dark': { sidebar: '#0c4a6e', main: '#075985', border: '#0ea5e9' },
    'threedimensional': { sidebar: '#fdf2f8', main: '#ffffff', border: '#ec4899' },
    'threedimensional-dark': { sidebar: '#831843', main: '#9f1239', border: '#be185d' },
  };
  
  // Thêm computed signal
  currentThemeBackgrounds = computed(() => {
    return this.themeBackgroundColors[this.currentTheme()] || {
      sidebar: '#f8f9fa',
      main: '#ffffff',
      border: '#14b8a6'
    };
  });

    currentTheme = signal<SurveyThemeKey>('default-dark');
    themesList = signal<SurveyThemeKey[]>(this.themes);
    
    // Computed signal để lấy màu của theme hiện tại
    currentThemeColor = computed(() => {
        return this.themeColors[this.currentTheme()] || '#14b8a6';
    });

    setTheme(theme: SurveyThemeKey) {
        this.currentTheme.set(theme);
    }
    
    toggleTheme(): void {
        const currentIndex = this.themes.indexOf(this.currentTheme());
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }
    
    getThemeDisplayName(theme: SurveyThemeKey): string {
        return theme.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    getThemeColor(theme: SurveyThemeKey): string {
        return this.themeColors[theme] || '#14b8a6';
    }
}
import {Injectable, signal, computed} from '@angular/core';
import  {SurveyThemeKey, getThemeColorsForUI} from '../helpers/theme-helper';

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

    // Màu chữ cứng cho mỗi theme
    private readonly themeTextColors: Record<SurveyThemeKey, string> = {
    'default': '#1f2937', // Chữ tối cho nền sáng
    'default-dark': '#ffffff', // Chữ sáng cho nền tối
    'borderless': '#1f2937',
    'borderless-dark': '#ffffff',
    'flat': '#1f2937',
    'flat-dark': '#ffffff',
    'contrast': '#1f2937', // Chữ tối cho nền vàng sáng
    'contrast-dark': '#1f2937', // Chữ vàng cho nền đen
    'sharp': '#1f2937',
    'sharp-dark': '#ffffff',
    'layered': '#1f2937',
    'layered-dark': '#ffffff',
    'plain': '#1f2937',
    'plain-dark': '#ffffff',
    'solid-dark': '#ffffff',
    'doubleborder': '#1f2937',
    'doubleborder-dark': '#ffffff',
    'threedimensional': '#1f2937',
    'threedimensional-dark': '#ffffff',
};
private getThemeBackgroundColors(): Record<SurveyThemeKey, { 
    sidebar: string; 
    main: string; 
    border: string;
    text: string;
    primary: string;
  }> {
    const result: Record<SurveyThemeKey, { 
      sidebar: string; 
      main: string; 
      border: string;
      text: string;
      primary: string;
    }> = {} as any;
    
    for (const theme of this.themes) {
      const baseColors = getThemeColorsForUI(theme);
      result[theme] = {
        ...baseColors,
        text: this.themeTextColors[theme]
      };
    }
    
    return result;
  }
  
  private readonly themeBackgroundColors = this.getThemeBackgroundColors();
  
  // Thêm computed signal
  currentThemeBackgrounds = computed(() => {
    return this.themeBackgroundColors[this.currentTheme()] || {
      sidebar: '#f8f9fa',
      main: '#ffffff',
      border: '#14b8a6',
      text: '#1f2937',
      primary: '#14b8a6'
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
    getThemeColors(theme: SurveyThemeKey) {
      const colors = this.themeBackgroundColors[theme];
      if (colors) {
        return colors;
      }
      // Fallback với màu text cứng
      const baseColors = getThemeColorsForUI(theme);
      return {
        ...baseColors,
        text: this.themeTextColors[theme] || '#1f2937'
      };
  }
}
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
getPaginationContainerColors(theme: SurveyThemeKey): {
  background: string;
  border: string;
  text: string;
} {
  const colors: Record<SurveyThemeKey, { background: string; border: string; text: string }> = {
    'default': { background: '#f8f9fa', border: '#19b394', text: '#1f2937' },
    'default-dark': { background: '#1f2937', border: '#fbbf24', text: '#ffffff' },
    'borderless': { background: '#f3f4f6', border: '#3b82f6', text: '#1f2937' },
    'borderless-dark': { background: '#1f2937', border: '#3b82f6', text: '#ffffff' },
    'flat': { background: '#f0fdf4', border: '#22c55e', text: '#1f2937' },
    'flat-dark': { background: '#1f2937', border: '#16a34a', text: '#ffffff' },
    'contrast': { background: '#fcd34d', border: '#fbbf24', text: '#1f2937' },
    'contrast-dark': { background: '#1f2937', border: '#fbbf24', text: '#fbbf24' },
    'sharp': { background: '#f5f3ff', border: '#7c3aed', text: '#1f2937' },
    'sharp-dark': { background: '#1f2937', border: '#1e3a8a', text: '#ffffff' },
    'layered': { background: '#faf5ff', border: '#a855f7', text: '#1f2937' },
    'layered-dark': { background: '#1f2937', border: '#581c87', text: '#ffffff' },
    'plain': { background: '#eff6ff', border: '#3b82f6', text: '#1f2937' },
    'plain-dark': { background: '#1f2937', border: '#1e40af', text: '#ffffff' },
    'solid-dark': { background: '#1f2937', border: '#14b8a6', text: '#ffffff' },
    'doubleborder': { background: '#f9fafb', border: '#6b7280', text: '#1f2937' },
    'doubleborder-dark': { background: '#1f2937', border: '#0ea5e9', text: '#ffffff' },
    'threedimensional': { background: '#fdf2f8', border: '#ec4899', text: '#1f2937' },
    'threedimensional-dark': { background: '#1f2937', border: '#be185d', text: '#ffffff' }
  };
  
  return colors[theme] || colors['default-dark'];
}
getDescriptionAreaColors(theme: SurveyThemeKey): {
  background: string;
  border: string;
  labelColor: string;
  contentColor: string;
} {
  const colors: Record<SurveyThemeKey, { background: string; border: string; labelColor: string; contentColor: string }> = {
    'default': { 
      background: '#f0fdfa', 
      border: '#19b394', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'default-dark': { 
      background: 'rgba(251, 191, 36, 0.1)', 
      border: '#fbbf24', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'borderless': { 
      background: '#eff6ff', 
      border: '#3b82f6', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'borderless-dark': { 
      background: 'rgba(59, 130, 246, 0.1)', 
      border: '#3b82f6', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'flat': { 
      background: '#f0fdf4', 
      border: '#22c55e', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'flat-dark': { 
      background: 'rgba(34, 197, 94, 0.1)', 
      border: '#16a34a', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'contrast': { 
      background: '#fef3c7', 
      border: '#fbbf24', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'contrast-dark': { 
      background: 'rgba(251, 191, 36, 0.15)', 
      border: '#fbbf24', 
      labelColor: '#fbbf24', 
      contentColor: 'rgba(251, 191, 36, 0.9)' 
    },
    'sharp': { 
      background: '#f5f3ff', 
      border: '#7c3aed', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'sharp-dark': { 
      background: 'rgba(30, 58, 138, 0.2)', 
      border: '#1e3a8a', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'layered': { 
      background: '#faf5ff', 
      border: '#a855f7', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'layered-dark': { 
      background: 'rgba(88, 28, 135, 0.2)', 
      border: '#581c87', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'plain': { 
      background: '#eff6ff', 
      border: '#3b82f6', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'plain-dark': { 
      background: 'rgba(30, 64, 175, 0.2)', 
      border: '#1e40af', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'solid-dark': { 
      background: 'rgba(20, 184, 166, 0.1)', 
      border: '#14b8a6', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'doubleborder': { 
      background: '#f9fafb', 
      border: '#6b7280', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'doubleborder-dark': { 
      background: 'rgba(14, 165, 233, 0.1)', 
      border: '#0ea5e9', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    },
    'threedimensional': { 
      background: '#fdf2f8', 
      border: '#ec4899', 
      labelColor: '#1f2937', 
      contentColor: '#374151' 
    },
    'threedimensional-dark': { 
      background: 'rgba(190, 24, 93, 0.2)', 
      border: '#be185d', 
      labelColor: '#ffffff', 
      contentColor: 'rgba(255, 255, 255, 0.8)' 
    }
  };
  
  return colors[theme] || colors['default-dark'];
}
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

    currentTheme = signal<SurveyThemeKey>('default');
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
import { Model as SurveyModel } from 'survey-core';
import {
  DefaultLight,
  DefaultDark,
  BorderlessLight,
  BorderlessDark,
  FlatLight,
  FlatDark,
  ContrastLight,
  ContrastDark,
  SolidDark,
  SharpLight,
  SharpDark,
  LayeredLight,
  LayeredDark,
  PlainLight,
  PlainDark,
  DoubleBorderLight,
  DoubleBorderDark,
  ThreeDimensionalLight,
  ThreeDimensionalDark,
} from 'survey-core/themes';

export type SurveyThemeKey =
  | 'default'
  | 'default-dark'
  | 'borderless'
  | 'borderless-dark'
  | 'flat'
  | 'flat-dark'
  | 'contrast'
  | 'contrast-dark'
  | 'solid-dark'
  | 'sharp'
  | 'sharp-dark'
  | 'layered'
  | 'layered-dark'
  | 'plain'
  | 'plain-dark'
  | 'doubleborder'
  | 'doubleborder-dark'
  | 'threedimensional'
  | 'threedimensional-dark';

export const SURVEY_THEMES: Record<SurveyThemeKey, any> = {
  default: DefaultLight,
  'default-dark': DefaultDark,
  borderless: BorderlessLight,
  'borderless-dark': BorderlessDark,
  flat: FlatLight,
  'flat-dark': FlatDark,
  contrast: ContrastLight,
  'contrast-dark': ContrastDark,
  'solid-dark': SolidDark,
  sharp: SharpLight,
  'sharp-dark': SharpDark,
  layered: LayeredLight,
  'layered-dark': LayeredDark,
  plain: PlainLight,
  'plain-dark': PlainDark,
  doubleborder: DoubleBorderLight,
  'doubleborder-dark': DoubleBorderDark,
  threedimensional: ThreeDimensionalLight,
  'threedimensional-dark': ThreeDimensionalDark,
};

export function applySurveyTheme(model: SurveyModel, themeKey: SurveyThemeKey): void {
  const theme = SURVEY_THEMES[themeKey];
  if (theme) {
    model.applyTheme(theme);
  }
}

// Helper function để extract colors từ SurveyJS theme
export interface ThemeColors {
  primary: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  border: string;
}

export function extractThemeColors(themeKey: SurveyThemeKey): ThemeColors {
  const theme = SURVEY_THEMES[themeKey];
  if (!theme) {
    return getDefaultColors();
  }

  // SurveyJS themes có colorPalette với các màu
  const colorPalette = theme.colorPalette || {};
  
  // Lấy primary color từ colorPalette hoặc cssVariables
  const primary = colorPalette.primary || 
                  getCSSVariableValue(theme, '--sjs-primary-color') ||
                  getCSSVariableValue(theme, '--primary') ||
                  '#14b8a6';

  // Lấy background colors
  const background = colorPalette.background || 
                     getCSSVariableValue(theme, '--sjs-general-backcolor') ||
                     getCSSVariableValue(theme, '--background') ||
                     '#ffffff';

  const backgroundSecondary = colorPalette.backgroundSecondary ||
                              getCSSVariableValue(theme, '--sjs-general-backcolor-dim') ||
                              '#f8f9fa';

  // Lấy text color từ theme (sẽ được override bởi theme service với màu cứng)
  const text = colorPalette.text || 
               getCSSVariableValue(theme, '--sjs-font-color') ||
               getCSSVariableValue(theme, '--text') ||
               '#1f2937';

  // Lấy border color
  const border = colorPalette.border ||
                 getCSSVariableValue(theme, '--sjs-border-default') ||
                 primary;

  return {
    primary,
    background,
    backgroundSecondary,
    text,
    border,
  };
}

// Helper để lấy giá trị từ CSS variables trong theme
function getCSSVariableValue(theme: any, varName: string): string | null {
  if (!theme || !theme.cssVariables) return null;
  
  // SurveyJS có thể lưu CSS variables trong cssVariables object
  const cssVars = theme.cssVariables;
  if (typeof cssVars === 'object' && cssVars[varName]) {
    return cssVars[varName];
  }

  // Hoặc trong colorPalette
  if (theme.colorPalette) {
    const palette = theme.colorPalette;
    // Map các CSS variable names sang colorPalette properties
    const varMap: Record<string, string> = {
      '--sjs-primary-color': palette.primary,
      '--sjs-general-backcolor': palette.background,
      '--sjs-font-color': palette.text,
      '--sjs-border-default': palette.border,
    };
    return varMap[varName] || null;
  }

  return null;
}

function getDefaultColors(): ThemeColors {
  return {
    primary: '#14b8a6',
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    text: '#1f2937',
    border: '#14b8a6',
  };
}

// Function để lấy theme colors cho sidebar và header
export function getThemeColorsForUI(themeKey: SurveyThemeKey): {
  sidebar: string;
  main: string;
  border: string;
  text: string;
  primary: string;
} {
  const colors = extractThemeColors(themeKey);
  
  return {
    sidebar: colors.backgroundSecondary,
    main: colors.background,
    border: colors.border,
    text: colors.text,
    primary: colors.primary,
  };
}
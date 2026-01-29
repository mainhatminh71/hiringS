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
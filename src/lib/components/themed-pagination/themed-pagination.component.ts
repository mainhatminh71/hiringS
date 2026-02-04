import { Component, Input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { SurveyThemeKey } from '../../core/helpers/theme-helper';
import { ThemeService } from '../../core/services/theme.service';
@Component({
  selector: 'app-themed-pagination',
  imports: [CommonModule, NzPaginationModule],
  templateUrl: './themed-pagination.component.html',
  styleUrl: './themed-pagination.component.scss',
  standalone: true
})
export class ThemedPaginationComponent {
  @Input() pageIndex: number = 1;
  @Input() total: number = 1;
  @Input() pageSize: number = 1;
  @Input() showSizeChanger: boolean = false;
  @Input() showQuickJumper: boolean = false;
  @Input() showTotal: boolean = false;
  @Input() themeKey?: SurveyThemeKey;

  @Output() pageIndexChange = new EventEmitter<number>();
  private themeService = inject(ThemeService);

  get currentTheme(): SurveyThemeKey {
    return this.themeKey || this.themeService.currentTheme();
  }
  get themeColors() {
    return this.getThemeColors(this.currentTheme);
  }
  private getThemeColors(theme: SurveyThemeKey) {
    const colors: Record<SurveyThemeKey, {
      primary: string;
      primaryHover: string;
      activeBg: string;
      activeText: string;
      border: string;
      text: string;
      background: string;
    }> = {
      'default': {
        primary: '#19b394',
        primaryHover: '#16a085',
        activeBg: '#19b394',
        activeText: '#ffffff',
        border: '#19b394',
        text: '#1f2937',
        background: '#ffffff'
      },
      'default-dark': {
        primary: '#fbbf24',
        primaryHover: '#f59e0b',
        activeBg: '#fbbf24',
        activeText: '#1f2937',
        border: '#fbbf24',
        text: '#ffffff',
        background: '#1f2937'
      },
      'borderless': {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        activeBg: '#3b82f6',
        activeText: '#ffffff',
        border: '#3b82f6',
        text: '#1f2937',
        background: '#ffffff'
      },
      'borderless-dark': {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        activeBg: '#3b82f6',
        activeText: '#ffffff',
        border: '#3b82f6',
        text: '#ffffff',
        background: '#1f2937'
      },
      'flat': {
        primary: '#22c55e',
        primaryHover: '#16a34a',
        activeBg: '#22c55e',
        activeText: '#ffffff',
        border: '#22c55e',
        text: '#1f2937',
        background: '#ffffff'
      },
      'flat-dark': {
        primary: '#16a34a',
        primaryHover: '#15803d',
        activeBg: '#16a34a',
        activeText: '#ffffff',
        border: '#16a34a',
        text: '#ffffff',
        background: '#1f2937'
      },
      'contrast': {
        primary: '#fbbf24',
        primaryHover: '#f59e0b',
        activeBg: '#fbbf24',
        activeText: '#1f2937',
        border: '#fbbf24',
        text: '#1f2937',
        background: '#ffffff'
      },
      'contrast-dark': {
        primary: '#fbbf24',
        primaryHover: '#f59e0b',
        activeBg: '#fbbf24',
        activeText: '#1f2937',
        border: '#fbbf24',
        text: '#fbbf24',
        background: '#1f2937'
      },
      'sharp': {
        primary: '#7c3aed',
        primaryHover: '#6d28d9',
        activeBg: '#7c3aed',
        activeText: '#ffffff',
        border: '#7c3aed',
        text: '#1f2937',
        background: '#ffffff'
      },
      'sharp-dark': {
        primary: '#1e3a8a',
        primaryHover: '#1e40af',
        activeBg: '#1e3a8a',
        activeText: '#ffffff',
        border: '#1e3a8a',
        text: '#ffffff',
        background: '#1f2937'
      },
      'layered': {
        primary: '#a855f7',
        primaryHover: '#9333ea',
        activeBg: '#a855f7',
        activeText: '#ffffff',
        border: '#a855f7',
        text: '#1f2937',
        background: '#ffffff'
      },
      'layered-dark': {
        primary: '#581c87',
        primaryHover: '#6b21a8',
        activeBg: '#581c87',
        activeText: '#ffffff',
        border: '#581c87',
        text: '#ffffff',
        background: '#1f2937'
      },
      'plain': {
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        activeBg: '#3b82f6',
        activeText: '#ffffff',
        border: '#3b82f6',
        text: '#1f2937',
        background: '#ffffff'
      },
      'plain-dark': {
        primary: '#1e40af',
        primaryHover: '#1d4ed8',
        activeBg: '#1e40af',
        activeText: '#ffffff',
        border: '#1e40af',
        text: '#ffffff',
        background: '#1f2937'
      },
      'solid-dark': {
        primary: '#14b8a6',
        primaryHover: '#0d9488',
        activeBg: '#14b8a6',
        activeText: '#ffffff',
        border: '#14b8a6',
        text: '#ffffff',
        background: '#1f2937'
      },
      'doubleborder': {
        primary: '#6b7280',
        primaryHover: '#4b5563',
        activeBg: '#6b7280',
        activeText: '#ffffff',
        border: '#6b7280',
        text: '#1f2937',
        background: '#ffffff'
      },
      'doubleborder-dark': {
        primary: '#0ea5e9',
        primaryHover: '#0284c7',
        activeBg: '#0ea5e9',
        activeText: '#ffffff',
        border: '#0ea5e9',
        text: '#ffffff',
        background: '#1f2937'
      },
      'threedimensional': {
        primary: '#ec4899',
        primaryHover: '#db2777',
        activeBg: '#ec4899',
        activeText: '#ffffff',
        border: '#ec4899',
        text: '#1f2937',
        background: '#ffffff'
      },
      'threedimensional-dark': {
        primary: '#be185d',
        primaryHover: '#9f1239',
        activeBg: '#be185d',
        activeText: '#ffffff',
        border: '#be185d',
        text: '#ffffff',
        background: '#1f2937'
      }
    };
    
    return colors[theme] || colors['default-dark'];
  }
  onPageChange(page: number) {
    this.pageIndexChange.emit(page);
  }
}

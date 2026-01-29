import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {DragDropModule, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { UIBlockService } from '../../../core/services/ui-block.service';
import { UIBlock } from '../../../core/models/ui-block.model';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { UIBlockInstance } from '../../../core/models/ui-block-instance.model';
@Component({
  selector: 'app-component-palette',
  imports: [CommonModule, DragDropModule],
  templateUrl: './component-palette.component.html',
  styleUrl: './component-palette.component.scss',
  standalone: true
})
export class ComponentPaletteComponent implements OnInit {
  private uiBlockService = inject(UIBlockService);
  private platformId = inject(PLATFORM_ID);
  themeService = inject(ThemeService);

  @Input() selectedInstanceId?: string;
  @Input() selectedInstance?: UIBlockInstance;
  @Output() deleteSelected = new EventEmitter<string>();
  @Output() labelUpdated = new EventEmitter<{id: string, label: string}>();
  labelInput = '';

  blocks: UIBlock[] = [];
  blocksByCategory: { [key: string]: UIBlock[] } = {};

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBlocks();
    }
  }
  loadBlocks() {
    this.uiBlockService.getAllBlocks().subscribe(blocks => {
      this.blocks = blocks;
      this.groupByCategory();
    });
  }
  groupByCategory() {
    this.blocksByCategory = {
      basic: this.blocks.filter(block => block.category === 'basic'),
      advanced: this.blocks.filter(block => block.category === 'advanced'),
      layout: this.blocks.filter(block => block.category === 'layout'),
    }
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  onDeleteSelected() {
    if (this.selectedInstanceId) {
      this.deleteSelected.emit(this.selectedInstanceId);
    }
  }
  get currentThemeName(): string {
    return this.themeService.getThemeDisplayName(this.themeService.currentTheme());
  }
  get currentThemeColor(): string {
    return this.themeService.currentThemeColor();
  }
  get themePrimaryRgba(): string {
    return this.hexToRgba(this.currentThemeColor, 0.35);
  }
  get currentThemeBackgrounds() {
    return this.themeService.currentThemeBackgrounds();
  }

  private hexToRgba(hex: string, alpha: number): string {
    let normalized = hex.trim();
    if (!normalized.startsWith('#')) {
      return `rgba(20, 184, 166, ${alpha})`;
    }
    normalized = normalized.slice(1);
    if (normalized.length === 3) {
      normalized = normalized
        .split('')
        .map((char) => char + char)
        .join('');
    }
    if (normalized.length !== 6) {
      return `rgba(20, 184, 166, ${alpha})`;
    }
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  onLabelInput(value: string) {
    this.labelInput = value;
    if (this.selectedInstanceId) {
      this.labelUpdated.emit({ id: this.selectedInstanceId, label: value });
    }
  }
}

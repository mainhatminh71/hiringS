import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ThemedPaginationComponent } from '../../themed-pagination/themed-pagination.component';
import { FormPage } from '../../../core/models/form-page.model';
import { ThemeService } from '../../../core/services/theme.service';
import { SurveyThemeKey } from '../../../core/helpers/theme-helper';
import { inject } from '@angular/core';

@Component({
  selector: 'app-form-page-pagination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    ThemedPaginationComponent
  ],
  templateUrl: './form-page-pagination.component.html',
  styleUrl: './form-page-pagination.component.scss'
})
export class FormPagePaginationComponent {
  @Input() pages: FormPage[] = [];
  @Input() currentPageId: string = '';
  @Input() themeKey: SurveyThemeKey = 'default-dark';

  @Output() pageSelectChange = new EventEmitter<string>();
  @Output() paginationChange = new EventEmitter<number>();
  @Output() addPage = new EventEmitter<void>();
  @Output() removePage = new EventEmitter<string>();

  themeService = inject(ThemeService);

  get currentPageIndex(): number {
    const index = this.pages.findIndex(p => p.id === this.currentPageId);
    return index >= 0 ? index + 1 : 1;
  }

  onPageSelectChange(pageId: string): void {
    this.pageSelectChange.emit(pageId);
  }

  onPaginationChange(page: number): void {
    this.paginationChange.emit(page);
  }

  onAddPage(): void {
    this.addPage.emit();
  }

  onRemovePage(): void {
    this.removePage.emit(this.currentPageId);
  }
}


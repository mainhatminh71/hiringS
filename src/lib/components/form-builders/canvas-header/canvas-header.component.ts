import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { SurveyThemeKey } from '../../../core/helpers/theme-helper';
import { inject } from '@angular/core';

@Component({
  selector: 'app-canvas-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas-header.component.html',
  styleUrl: './canvas-header.component.scss'
})
export class CanvasHeaderComponent {
  @Input() formName: string = 'Application Form';
  @Input() department: string = '';
  @Input() location: string = '';
  @Input() employmentType: string = '';
  @Input() postedDate: string = '';
  @Input() themeKey: SurveyThemeKey = 'default-dark';

  @Output() departmentUpdated = new EventEmitter<string>();
  @Output() locationUpdated = new EventEmitter<string>();
  @Output() employmentTypeUpdated = new EventEmitter<string>();
  @Output() postedDateUpdated = new EventEmitter<string>();

  themeService = inject(ThemeService);

  get themeColors() {
    return this.themeService.getThemeColors(this.themeKey);
  }

  onDepartmentChange(value: string): void {
    this.departmentUpdated.emit(value);
  }

  onLocationChange(value: string): void {
    this.locationUpdated.emit(value);
  }

  onEmploymentTypeChange(value: string): void {
    this.employmentTypeUpdated.emit(value);
  }

  onPostedDateChange(value: string): void {
    this.postedDateUpdated.emit(value);
  }
}


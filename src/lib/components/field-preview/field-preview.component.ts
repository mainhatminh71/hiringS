import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormFieldWithGrid } from '../../core/models/grid-config.model';
import { Input } from '@angular/core';
@Component({
  selector: 'app-field-preview',
  imports: [CommonModule],
  templateUrl: './field-preview.component.html',
  styleUrl: './field-preview.component.scss'
})
export class FieldPreviewComponent {
  @Input() field!: FormFieldWithGrid;

  getFieldId(prefix: string): string {
    return `${prefix}-${this.field.id}`;
  }
  getConfig(key: string): any {
    return this.field.config[key];
  }

  getLabel(): string {
    return this.getConfig('label') || 'Field';
  }
}

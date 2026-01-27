import { Component, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField } from '../../core/models/field-template.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import { ConfigurableProp } from '../../core/models/field-template.model';
import {FormFieldWithGrid} from '../../core/models/grid-config.model';
import {Input} from '@angular/core';
import {Output} from '@angular/core';
import {EventEmitter} from '@angular/core';
import { OnInit } from '@angular/core';
import { OnChanges } from '@angular/core';
@Component({
  selector: 'app-property-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.scss'
})
export class PropertyEditorComponent implements OnInit, OnChanges {
  @Input() prop!: ConfigurableProp;
  @Input() field!: FormFieldWithGrid;
  @Output() valueChange = new EventEmitter<any>();
  
  private options: any[] = [];
  
  getValue(): any {
    return this.field.config[this.prop.name] ?? this.prop.default;
  }
  
  onValueChange(value: any) {
    this.valueChange.emit({ propName: this.prop.name, value });
  }
  ngOnInit() {
    this.syncOptions();
  } 
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['field'] || changes['prop']) {
      this.syncOptions();
    }
  }
  getOptions() : any[] {
    if (this.prop.type === 'array-of-objects') {
      return this.options;
    }
    return [];
  }
  addOption() {
    this.options = [...this.options, { value: '', label: '' }];
    this.emitOptionsChange();
  }

  removeOption(index: number) {
    this.options = this.options.filter((_, i) => i !== index);
    this.emitOptionsChange();
  }

  private syncOptions() {
    if (this.prop.type === 'array-of-objects') {
      this.options = [...(this.field.config[this.prop.name] || [])];
    }
  }

  updateOption(index: number, key: 'value' | 'label', value: string) {
    this.options = this.options.map((opt, i) => 
      i === index ? { ...opt, [key]: value } : opt
    );
    this.emitOptionsChange();
  }
  
  private emitOptionsChange() {
    this.valueChange.emit({ propName: this.prop.name, value: [...this.options] });
  }

  
  getInputId(): string {
    return `prop-${this.prop.name}-${this.field.id || 'default'}`;
  }
  
  getOptionInputId(index: number, key: string): string {
    return `option-${this.prop.name}-${index}-${key}`;
  }
}

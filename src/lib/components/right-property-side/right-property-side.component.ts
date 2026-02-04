import { Component, SimpleChanges } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {UIBlockInstance} from '../../core/models/ui-block-instance.model';
import {Input, Output, EventEmitter} from '@angular/core';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
@Component({
  selector: 'app-right-property-side',
  imports: [CommonModule, FormsModule, NzDrawerModule, NzButtonModule, NzIconModule, NzInputModule, NzCheckboxModule],
  templateUrl: './right-property-side.component.html',
  styleUrl: './right-property-side.component.scss',
  standalone: true
})
export class RightPropertySideComponent {
  @Input() visible = false;
  @Input() instance?: UIBlockInstance;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() optionsUpdated = new EventEmitter<{instanceId: string, options: Array<{label: string, value: string}>}>();
  @Output() labelUpdated = new EventEmitter<{id: string, label: string}>();
  @Output() requiredUpdated = new EventEmitter<{id: string, required: boolean}>();

  labelInput = '';
  requiredInput = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instance'] && this.instance) {
      this.labelInput = (this.instance.config?.['label'] as string) || '';
      this.requiredInput = !!(this.instance.config?.['required'] as boolean);
    }
  }
  get options(): Array<{label: string, value: string}> {
    return (this.instance?.config['options'] as Array<{label: string, value: string}>) || [];
  }

  get hasOptions(): boolean {
    const componentTypes = ['select', 'radio', 'checkbox'];
    return componentTypes.includes(this.instance?.componentType || '');
  }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  updateRequired(required: boolean) {
    if (!this.instance) return;
    this.requiredUpdated.emit({
      id: this.instance.id,
      required: required
    })
  }

  addOption(): void {
    if (!this.instance) return;
    
    const currentOptions = [...this.options];
    const newOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option${currentOptions.length + 1}`
    };
    
    this.updateOptions([...currentOptions, newOption]);
  }

  removeOption(index: number): void {
    if (!this.instance) return;
    
    const currentOptions = [...this.options];
    currentOptions.splice(index, 1);
    this.updateOptions(currentOptions);
  }

  updateOptionLabel(index: number, label: string): void {
    if (!this.instance) return;
    
    const currentOptions = [...this.options];
    if (currentOptions[index]) {
      currentOptions[index] = {
        ...currentOptions[index],
        label: label.trim() || currentOptions[index].label
      };
      this.updateOptions(currentOptions);
    }
  }

  updateOptionValue(index: number, value: string): void {
    if (!this.instance) return;
    
    const currentOptions = [...this.options];
    if (currentOptions[index]) {
      currentOptions[index] = {
        ...currentOptions[index],
        value: value.trim() || currentOptions[index].value
      };
      this.updateOptions(currentOptions);
    }
  }

  private updateOptions(options: Array<{label: string, value: string}>): void {
    if (!this.instance) return;
    
    this.optionsUpdated.emit({
      instanceId: this.instance.id,
      options
    });
  }
  updateLabel(label: string) {
    if (!this.instance) return;
    const trimmed = label.trim();
    const current = (this.instance.config?.['label'] as string) || '';
    const finalLabel = trimmed || current;

    this.labelInput = finalLabel;
    if (finalLabel && finalLabel !== current) {
      this.labelUpdated.emit({id: this.instance.id, label: finalLabel});
    }
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import { InputConfig } from '../../core/models/input-config.model';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule, NzInputModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  standalone: true,
})
export class InputComponent {
  @Input() config: InputConfig = {
    type: 'text',
    label: '',
    placeholder: '',
    id: '',
    value: '',
    required: false,
    disabled: false,
    size: 'default',
  };

  @Output() valueChange = new EventEmitter<any>();

  get value(): any {
    return this.config.value;
  }

  set value(val: any) {
    if (this.config.value !== val) {
      this.config.value = val;
      this.valueChange.emit(val);
    }
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-application-form-card',
  imports: [CommonModule, NzCardModule, RouterLink, FormsModule, NzCheckboxModule],
  templateUrl: './application-form-card.component.html',
  styleUrl: './application-form-card.component.scss',
  standalone: true
})
export class ApplicationFormCardComponent {
  @Input() routerLink: string = '/form-generation';
  @Input() themeColor: string = '#6366f1';
  @Input() showSwatch: boolean = true;
  @Input() variant: 'default' | 'dashed' = 'default';

  @Input() selectable: boolean = false;
  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>;
  
  onSelectedChange(value: boolean) {
    this.selected = value;
    this.selectedChange.emit(value);
  }
  
  onCheckboxAreaClick(event: MouseEvent) {
    // Prevent card navigation khi click vào checkbox area
    event.stopPropagation();
    event.preventDefault();
    // Đảm bảo event không bubble lên thẻ <a>
    return false;
  }
}

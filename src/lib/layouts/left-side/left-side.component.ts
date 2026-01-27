import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from "ng-zorro-antd/button";

@Component({
  selector: 'app-left-side',
  imports: [CommonModule, RouterModule, NzIconModule, NzButtonComponent],
  templateUrl: './left-side.component.html',
  styleUrl: './left-side.component.scss'
})
export class LeftSideComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  toggle() {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }
}

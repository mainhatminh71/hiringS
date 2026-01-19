import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-logo',
  imports: [CommonModule, NzIconModule],
  templateUrl: './logo.component.html',
  standalone: true
})
export class LogoComponent {

}

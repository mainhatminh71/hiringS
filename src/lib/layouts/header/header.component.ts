import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LogoComponent } from '../../components/logo/logo.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, NzIconModule, NzInputModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LogoComponent } from '../../components/logo/logo.component';
import { RouterLink } from '@angular/router';
import {ApplicationSelectionComponent} from '../../../app/pages/application-selection/application-selection.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, NzIconModule, NzInputModule, LogoComponent, ApplicationSelectionComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {

}

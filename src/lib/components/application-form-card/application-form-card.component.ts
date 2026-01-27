import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzCardModule} from 'ng-zorro-antd/card';
import { Input } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-application-form-card',
  imports: [CommonModule, NzCardModule, RouterModule],
  templateUrl: './application-form-card.component.html',
  styleUrl: './application-form-card.component.scss'
})
export class ApplicationFormCardComponent {
  @Input() routerLink?: string;
}

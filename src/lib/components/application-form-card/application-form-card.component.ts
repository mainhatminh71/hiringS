import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-application-form-card',
  imports: [CommonModule, NzCardModule, RouterLink],
  templateUrl: './application-form-card.component.html',
  styleUrl: './application-form-card.component.scss',
  standalone: true
})
export class ApplicationFormCardComponent {
  @Input() routerLink: string = '/form-generation';
}

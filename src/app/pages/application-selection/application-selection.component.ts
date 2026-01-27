import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationFormCardComponent } from '../../../lib/components/application-form-card/application-form-card.component';
import {RouterModule} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-application-selection',
  imports: [CommonModule, ApplicationFormCardComponent, RouterModule, NzIconModule],
  templateUrl: './application-selection.component.html',
  styleUrl: './application-selection.component.scss'
})
export class ApplicationSelectionComponent {
  applications = [
    { title: 'Application Form 1', description: 'This is the first application form' },
    { title: 'Application Form 2', description: 'This is the second application form' },
    { title: 'Application Form 3', description: 'This is the third application form' },
    { title: 'Application Form 4', description: 'This is the fourth application form' },
  ];
}

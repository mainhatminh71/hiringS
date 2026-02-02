import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationFormCardComponent } from '../../../lib/components/application-form-card/application-form-card.component';
import {RouterModule} from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ApplicationForm} from '../../../lib/core/models/application-form.model';
import {ApplicationFormService} from '../../../lib/core/services/application-form.service';
import {inject} from '@angular/core';
import { OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-application-selection',
  imports: [CommonModule, ApplicationFormCardComponent, RouterModule, NzCardModule, NzIconModule, RouterLink],
  templateUrl: './application-selection.component.html',
  styleUrl: './application-selection.component.scss'
})
export class ApplicationSelectionComponent implements OnInit {
  private applicationFormService = inject(ApplicationFormService);
  applications: ApplicationForm[] = [];

  ngOnInit(): void {
    this.applicationFormService.getAllForms().subscribe((forms) => {
      this.applications = forms;
    });
  }
}

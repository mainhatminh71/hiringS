import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { JobCardComponent } from '../../../lib/components/job-card/job-card.component';
import { LifeCardComponent } from '../../../lib/components/life-card/life-card.component';
import {ApplicationFormService} from '../../../lib/core/services/application-form.service';
import {JobCard} from '../../../lib/core/models/job-card.model';
import {ApplicationForm} from '../../../lib/core/models/application-form.model';
import {OnInit} from '@angular/core';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, NzIconModule, JobCardComponent, LifeCardComponent],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})
export class CareersComponent implements OnInit {
  applicationFormService = inject(ApplicationFormService);

  jobOpenings: JobCard[] = [];

  ngOnInit(): void {
    this.loadJobOpenings();
  }

  loadJobOpenings(): void {
    this.applicationFormService.getAllForms().subscribe({
      next: (forms: ApplicationForm[]) => {
        this.jobOpenings = forms.map(form => this.mapFormToJobCard(form));
      },
      error: (error) => {
        console.error('Failed to load job openings:', error);
        // Fallback to empty array or show error message
        this.jobOpenings = [];
      }
    });
  }
  private mapFormToJobCard(form: ApplicationForm): JobCard {
    return {
      title: form.name || 'Untitled Position',
      department: form.department || 'General',
      location: form.location || 'Not specified',
      type: form.employmentType || 'Full-time',
      postedDate: form.postedDate || new Date().toISOString().split('T')[0],
      formId: form.id
    };
  }
  
  lifeAtMicrosoft = [
    {
      emoji: '💼',
      title: 'Benefits',
      description: 'Explore our world-class benefits designed to help you and your family live well.'
    },
    {
      emoji: '🤝',
      title: 'Culture',
      description: 'We will only achieve our mission if we live our culture, which starts with applying a growth mindset.'
    },
    {
      emoji: '🌍',
      title: 'Diversity and inclusion',
      description: 'We are committed to celebrating the diversity around us and its power to drive us forward together.'
    },
    {
      emoji: '💡',
      title: 'Hiring Tips',
      description: 'Explore resources to help you prepare—we are here to support your interview journey.'
    }
  ];
}

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobCard } from '../../core/models/job-card.model';




@Component({
  selector: 'app-job-card',
  imports: [CommonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class JobCardComponent {
  @Input() job!: JobCard;
}

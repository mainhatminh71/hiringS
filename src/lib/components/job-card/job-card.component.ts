import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Job {
  title: string,
  department: string,
  location: string,
  type: string,
  postedDate: string,
}


@Component({
  selector: 'app-job-card',
  imports: [CommonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class JobCardComponent {
  @Input() job!: Job;
}

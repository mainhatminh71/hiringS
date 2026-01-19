import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { JobCardComponent } from '../../../lib/components/job-card/job-card.component';
import { LifeCardComponent } from '../../../lib/components/life-card/life-card.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, NzIconModule, JobCardComponent, LifeCardComponent],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})
export class CareersComponent {
  jobOpenings = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      postedDate: '2024-01-15'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Hanoi, Vietnam',
      type: 'Full-time',
      postedDate: '2024-01-10'
    },
    {
      title: 'UX Designer',
      department: 'Design',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      postedDate: '2024-01-08'
    },
    {
      title: 'Data Scientist',
      department: 'Analytics',
      location: 'Remote',
      type: 'Full-time',
      postedDate: '2024-01-05'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      postedDate: '2024-01-03'
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Hanoi, Vietnam',
      type: 'Full-time',
      postedDate: '2023-12-28'
    }
  ];

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

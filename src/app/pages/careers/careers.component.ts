import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { JobCardComponent } from '../../../lib/components/job-card/job-card.component';
import { LifeCardComponent } from '../../../lib/components/life-card/life-card.component';
import { ThreeHeroComponent } from '../../../lib/components/three-hero/three-hero.component';
import { ApplicationFormService } from '../../../lib/core/services/application-form.service';
import { JobCard } from '../../../lib/core/models/job-card.model';
import { ApplicationForm } from '../../../lib/core/models/application-form.model';
import { ScrollAnimationService } from '../../../lib/core/services/scroll-animation.service';
import { ThemedPaginationComponent } from '../../../lib/components/themed-pagination/themed-pagination.component';
import { SEOService } from '../../../lib/core/services/seo.service';
@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, NzIconModule, JobCardComponent, LifeCardComponent, ThreeHeroComponent, ThemedPaginationComponent],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})
export class CareersComponent implements OnInit, AfterViewInit, OnDestroy {
  applicationFormService = inject(ApplicationFormService);
  private scrollAnimation: ScrollAnimationService = inject(ScrollAnimationService);
  private seoService = inject(SEOService);
  jobOpenings: JobCard[] = [];
  isLoading = true;
  currentPage: number = 1;
  pageSize: number = 5;

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Careers at HiringS - Join Our Mission-Driven Team',
      description: 'Explore career opportunities at HiringS. Join a mission-driven team and help empower every person and organization to achieve more. View open positions and apply today.',
      keywords: 'careers, jobs, employment, hiring, HiringS careers, job opportunities, software engineer, product manager, designer, mission-driven company',
      image: 'https://hiring-s-rho.vercel.app/assets/careers-og.jpg',
      structuredData: [
        this.seoService.generateOrganizationSchema(),
        this.seoService.generateBreadcrumbSchema([
          { name: 'Home', url: 'https://hiring-s-rho.vercel.app' },
          { name: 'Careers', url: 'https://hiring-s-rho.vercel.app/careers' }
        ])
      ]
    });
    this.loadJobOpenings();
  }

  ngAfterViewInit(): void {
    // Setup scroll animations
    setTimeout(() => {
      this.setupAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.scrollAnimation) {
      this.scrollAnimation.disconnect();
    }
  }

  private setupAnimations(): void {
    if (!this.scrollAnimation) return;

    // Animate sections on scroll
    this.scrollAnimation.observeElements('.fade-in-section', {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      animationClass: 'animate-in'
    });

    // Stagger animation for cards
    this.scrollAnimation.observeStagger('.stagger-item', {
      staggerDelay: 100,
      threshold: 0.1
    });

    // Animate counter numbers
    this.animateCounters();
  }

  private animateCounters(): void {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const count = parseInt(target.getAttribute('data-count') || '0');
            if (count > 0) {
              this.countUp(target, 0, count, 1000);
            }
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const counterElements = document.querySelectorAll('.stat-number[data-count]');
    counterElements.forEach((el) => observer.observe(el));
  }

  private countUp(element: HTMLElement, start: number, end: number, duration: number): void {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
      element.textContent = current.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = end.toString();
      }
    };
    requestAnimationFrame(animate);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  loadJobOpenings(): void {
    this.isLoading = true;
    this.applicationFormService.getAllForms().subscribe({
      next: (forms: ApplicationForm[]) => {
        this.jobOpenings = forms.map(form => this.mapFormToJobCard(form));
        const jobSchemas = this.jobOpenings.map(job => this.seoService.generateJobPostingSchema(job));
        this.seoService.updateSEO({
          structuredData: [
            this.seoService.generateOrganizationSchema(),
            ...jobSchemas
          ]
        })
        this.currentPage = 1; // Reset to first page when data loads
        this.isLoading = false;
        // Re-setup animations after data loads
        setTimeout(() => {
          this.setupAnimations();
        }, 100);
      },
      error: (error) => {
        console.error('Failed to load job openings:', error);
        this.jobOpenings = [];
        this.currentPage = 1;
        this.isLoading = false;
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

  get paginatedJobOpenings(): JobCard[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.jobOpenings.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.jobOpenings.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // Re-setup animations for new page cards
    setTimeout(() => {
      this.setupAnimations();
      // Scroll to jobs section when page changes
      const jobsSection = document.getElementById('jobs');
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  
  lifeAtMicrosoft = [
    {
      icon: 'dollar',
      title: 'Benefits',
      description: 'Explore our world-class benefits designed to help you and your family live well.'
    },
    {
      icon: 'usergroup-add',
      title: 'Culture',
      description: 'We will only achieve our mission if we live our culture, which starts with applying a growth mindset.'
    },
    {
      icon: 'global',
      title: 'Diversity and inclusion',
      description: 'We are committed to celebrating the diversity around us and its power to drive us forward together.'
    },
    {
      icon: 'bulb',
      title: 'Hiring Tips',
      description: 'Explore resources to help you prepare—we are here to support your interview journey.'
    }
  ];
}

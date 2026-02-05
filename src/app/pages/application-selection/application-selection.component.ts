import { Component, Input, AfterViewInit } from '@angular/core';
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
import {NzColorPickerModule} from 'ng-zorro-antd/color-picker';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzMessageService} from 'ng-zorro-antd/message';
import { throttleTime } from 'rxjs';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzModalService} from 'ng-zorro-antd/modal';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ScrollAnimationService } from '../../../lib/core/services/scroll-animation.service';
@Component({
  selector: 'app-application-selection',
  imports: [CommonModule, ApplicationFormCardComponent, 
    RouterModule, NzCardModule, 
    NzIconModule, RouterLink, NzButtonModule, NzModalModule, NzSpinModule],
  templateUrl: './application-selection.component.html',
  styleUrl: './application-selection.component.scss'
})
export class ApplicationSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  private applicationFormService = inject(ApplicationFormService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private router = inject(Router);
  private scrollAnimation: ScrollAnimationService = inject(ScrollAnimationService);
  
  applications: ApplicationForm[] = [];
  selectedIds = new Set<string>();
  private destroy$ = new Subject<void>();

  isLoading = false;
  private instanceCountCache = new Map<string, number>();

  ngOnInit(): void {
    this.loadApplications();
    this.router.events.
    pipe(
      filter((event => event instanceof NavigationEnd)),
      filter(() => this.router.url === '/application-selection'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadApplications();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupAnimations();
      // Force animate-in for create card (always visible at top)
      const createCard = document.querySelector('.create-card');
      if (createCard) {
        createCard.classList.add('animate-in');
      }
    }, 100);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.scrollAnimation) {
      this.scrollAnimation.disconnect();
    }
  }

  private setupAnimations(): void {
    if (!this.scrollAnimation) return;
    // Stagger animation for cards
    this.scrollAnimation.observeStagger('.stagger-item', {
      staggerDelay: 50,
      threshold: 0.1
    });
  }
  loadApplications() {
    this.isLoading = true;
    this.applicationFormService.getAllForms().subscribe((forms) => {
      this.applications = forms;
      this.selectedIds.clear();
      this.instanceCountCache.clear();
      forms.forEach(form => {
        const count = this.calculateInstanceCount(form);
        this.instanceCountCache.set(form.id, count);
      });
      this.isLoading = false;
    });
  }
  private calculateInstanceCount(form: ApplicationForm): number {
    if (form.pages && form.pages.length > 0) {
      return form.pages.reduce((total, page) => total + (page.instances?.length || 0), 0);
    }
    return form.instances?.length || 0;
  }
  getInstanceCount(form: ApplicationForm): number {
    if (this.instanceCountCache.has(form.id)) {
      return this.instanceCountCache.get(form.id)!;
    }
    const count = this.calculateInstanceCount(form);
    this.instanceCountCache.set(form.id, count);
    return count;
  }
  trackByFormId(index: number, form: ApplicationForm): string {
    return form.id;
  }
  toggleSelection(id: string, selected: boolean) {
    if (selected) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
  }
  deleteSelected() {
    if (this.selectedIds.size === 0) return;

    // Lấy danh sách tên các form được chọn
    const selectedForms = this.applications.filter(app => this.selectedIds.has(app.id));
    const formListHtml = selectedForms
      .map(app => `<li>${app.name || 'Application Form'}</li>`)
      .join('');

    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete these forms?',
      // Hiển thị danh sách trong nội dung modal
      nzContent: `
        <b style="color: red;">You are about to delete ${this.selectedIds.size} selected form(s):</b>
        <ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 20px; list-style-type: disc;">
          ${formListHtml}
        </ul>
        This action cannot be undone.
      `,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const deletedIds = Array.from(this.selectedIds);
        deletedIds.forEach(id => {
          this.applicationFormService.deleteForm(id).subscribe({
            next: () => {
              this.applications = this.applications.filter(app => app.id !== id);
              this.selectedIds.delete(id);
            }, 
            error: () => {
              this.message.error('Failed to delete form');
            }
          })
        });
        this.message.success(`Deleted ${deletedIds.length} forms successfully`);
      }
    });
  }
  
}

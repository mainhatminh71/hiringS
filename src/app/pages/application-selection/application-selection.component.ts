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
@Component({
  selector: 'app-application-selection',
  imports: [CommonModule, ApplicationFormCardComponent, 
    RouterModule, NzCardModule, 
    NzIconModule, RouterLink, NzButtonModule, NzModalModule],
  templateUrl: './application-selection.component.html',
  styleUrl: './application-selection.component.scss'
})
export class ApplicationSelectionComponent implements OnInit, OnDestroy {
  private applicationFormService = inject(ApplicationFormService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  applications: ApplicationForm[] = [];
  selectedIds = new Set<string>();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadApplications() {
    this.applicationFormService.getAllForms().subscribe((forms) => {
      this.applications = forms;
      this.selectedIds.clear();
    });
  }
  getInstanceCount(form: ApplicationForm): number {
    return form.instances.length;
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

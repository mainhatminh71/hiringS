import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {ComponentPaletteComponent} from '../../../lib/components/form-builders/component-palette/component-palette.component';
import {FormCanvasComponent} from '../../../lib/components/form-builders/form-canvas/form-canvas.component';
import { UIBlockInstance } from '../../../lib/core/models/ui-block-instance.model';
import { ThemeService } from '../../../lib/core/services/theme.service';
import { CommonModule } from '@angular/common';
import { RightPropertySideComponent } from '../../../lib/components/right-property-side/right-property-side.component';
import {ApplicationFormService} from '../../../lib/core/services/application-form.service';
import { ApplicationForm } from '../../../lib/core/models/application-form.model';
import { ActivatedRoute } from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {FormPage} from '../../../lib/core/models/form-page.model';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import { ThemedPaginationComponent } from '../../../lib/components/themed-pagination/themed-pagination.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subject, of } from 'rxjs';
import { takeUntil, switchMap, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-form-generation',
  imports: [ComponentPaletteComponent, FormCanvasComponent, CommonModule, RightPropertySideComponent, NzPaginationModule, NzButtonModule, NzIconModule, NzSelectModule, FormsModule, ThemedPaginationComponent, NzSpinModule],
  templateUrl: './form-generation.component.html',
  styleUrl: './form-generation.component.scss',
  standalone: true
})
export class FormGenerationComponent implements OnInit, OnDestroy {
  selectedInstanceId?: string;
  selectedInstance?: UIBlockInstance;
  optionsDrawerVisible = false;
  optionsEditingInstanceId?: string;
  themeService = inject(ThemeService);
  formService = inject(ApplicationFormService);
  formName: string = 'Application Form';
  isSaving = false;
  private route = inject(ActivatedRoute);
  notificationService = inject(NzNotificationService);
  department: string = '';
  location: string = '';
  employmentType: string = '';
  postedDate: string = '';
  pages: FormPage[] = [];
  currentPageId: string= '';
  isLoading = false;
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            // Tạo form mới - return empty observable và xử lý ngay
            this.pages = [this.createNewPage('Page 1')];
            this.currentPageId = this.pages[0].id;
            this.formName = 'Application Form';
            this.isLoading = false;
            return of(null); // Return observable để switchMap hoạt động
          }
          
          // Load form từ database
          this.isLoading = true;
          return this.formService.getForm(id).pipe(
            catchError(error => {
              this.isLoading = false;
              this.notificationService.error('Error', 'Failed to load form');
              return of(null);
            })
          );
        })
      )
      .subscribe({
        next: (form) => {
          if (!form) {
            // Đã xử lý form mới ở trên hoặc có lỗi
            return;
          }
          
          if (form.pages && form.pages.length > 0) {
            this.pages = form.pages.sort((a, b) => a.order - b.order);
          } else {
            this.pages = [{
              id: `page-${Date.now()}`,
              name: 'Page 1',
              instances: form.instances ?? [],
              order: 0
            }];
          }
          
          this.currentPageId = this.pages[0]?.id || '';
          this.formName = form.name ?? 'Application Form';
          this.department = form.department ?? '';
          this.location = form.location ?? '';
          this.employmentType = form.employmentType ?? '';
          this.postedDate = form.postedDate ?? '';
          if (form.themeKey) this.themeService.setTheme(form.themeKey);
          this.isLoading = false;
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get currentPageInstances() : UIBlockInstance[] {
    const page = this.pages.find(p => p.id === this.currentPageId);
    return page?.instances ?? [];
  }
  createNewPage(name?: string) : FormPage {
    return {
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || `Page ${this.pages.length + 1}`,
      instances: [],
      order: this.pages.length
    };
  }
  addPage() {
    const newPage = this.createNewPage();
    this.pages = [...this.pages, newPage];
    this.currentPageId = newPage.id;
  }
  removePage(pageId: string) {
    if (this.pages.length <= 1) {
      this.notificationService.error('Error', 'Cannot delete the last page');
      return;
    }
    this.pages = this.pages.filter(p => p.id !== pageId);
    if (this.currentPageId === pageId) this.currentPageId = this.pages[0].id || '';
    this.pages = this.pages.map((p, index) => ({...p, order: index}))
  }
  updatePageName(pageId: string, newName: string) {
    this.pages = this.pages.map(p => 
      p.id === pageId ? {...p, name: newName} : p
    )
  }
  get currentPageIndex(): number {
    const index = this.pages.findIndex(p => p.id === this.currentPageId);
    return index >= 0 ? index + 1 : 1; // Pagination bắt đầu từ 1
  }
  
  onPaginationChange(page: number) {
    if (page < 1 || page > this.pages.length) return;
    const targetPage = this.pages[page - 1];
    if (targetPage) {
      this.currentPageId = targetPage.id;
      this.selectedInstanceId = undefined;
      this.selectedInstance = undefined;
    }
  }
  
  onPageSelectChange(pageId: string) {
    this.currentPageId = pageId;
    this.selectedInstanceId = undefined;
    this.selectedInstance = undefined;
  }
  onInstanceAdded(instance: UIBlockInstance) {
    // this.instances = [...this.instances, instance];
    const page = this.pages.find(p => p.id === this.currentPageId);
    if (page) {
      page.instances = [...page.instances, instance]
      this.pages = [...this.pages]
    }
  }
  onInstanceSelected(id: string) {
    this.selectedInstanceId = id;
    const allInstances = this.pages.flatMap(p => p.instances);
    this.selectedInstance = allInstances.find(instance => instance.id === id);
  
    // Mở right side cho TẤT CẢ component types (không chỉ có options)
    // Required checkbox sẽ luôn hiển thị, options chỉ hiển thị khi component có options
    this.optionsEditingInstanceId = id;
    this.optionsDrawerVisible = true;
  }
  
  onInstanceRemoved(id: string) {
    // this.instances = this.instances.filter(instance => instance.id !== id);
    this.pages = this.pages.map(page => ({
      ...page,
      instances: page.instances.filter(i => i.id !== id)
    }));
    if (this.selectedInstanceId === id) {
      this.selectedInstanceId = undefined;
      this.selectedInstance = undefined;
    }
  
    // Nếu đang mở panel cho instance này thì đóng lại
    if (this.optionsEditingInstanceId === id) {
      this.optionsEditingInstanceId = undefined;
      this.optionsDrawerVisible = false;
    }
  }


  onInstanceUpdated(updated: UIBlockInstance) {
   this.pages = this.pages.map(page => ({
    ...page,
    instances: page.instances.map(instance => 
      instance.id === updated.id ? updated : instance
    )
   }))
    if (this.selectedInstanceId === updated.id) {
      this.selectedInstance = updated;
    }
  }
  onInstanceLabelUpdate(payload: {id: string, label: string}) {
    this.pages = this.pages.map(page => ({
      ...page,
      instances: page.instances.map(instance => 
        instance.id === payload.id
          ? {...instance, config: {...instance.config, label: payload.label}}
          : instance
      )
    }));
    
    if (this.selectedInstanceId === payload.id) {
      this.selectedInstance = this.pages
        .flatMap(p => p.instances)
        .find(instance => instance.id === payload.id);
    }
  }
  onOptionClicked(instanceId: string) {
    this.optionsEditingInstanceId = instanceId;
    this.optionsDrawerVisible = true;
  }
  
  onOptionsUpdated(payload: {instanceId: string, options: Array<{label: string, value: string}>}) {
    this.pages = this.pages.map(page => ({
      ...page,
      instances: page.instances.map(instance => {
        if (instance.id === payload.instanceId) {
          return {
            ...instance,
            config: {
              ...instance.config,
              options: payload.options
            }
          };
        }
        return instance;
      })
    }));
    
    const updated = this.pages
      .flatMap(p => p.instances)
      .find(i => i.id === payload.instanceId);
    if (updated) {
      this.onInstanceUpdated(updated);
    }
  }
  
  get optionsEditingInstance(): UIBlockInstance | undefined {
    return this.pages
    .flatMap(p => p.instances)
    .find(i => i.id === this.optionsEditingInstanceId);
  }
  onSurveyTitleUpdated(title: string) {
    this.formName = title;
  }
  onRequiredUpdated(payload: {id: string, required: boolean}) {
    this.pages = this.pages.map(page => ({
      ...page,
      instances: page.instances.map(instance => 
        instance.id === payload.id
          ? {...instance, config: {...instance.config, required: payload.required}}
          : instance
      )
    }));
    
    if (this.selectedInstanceId === payload.id) {
      this.selectedInstance = this.pages
        .flatMap(p => p.instances)
        .find(instance => instance.id === payload.id);
    }
  }

  async onFormComplete() {
    const allInstances = this.pages.flatMap(p => p.instances);
    if (allInstances.length === 0 || this.isSaving) return;
    this.isSaving = true;
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.formService.updateForm(id, {
          name: this.formName,
          instances: allInstances,
          pages: this.pages,
          themeKey: this.themeService.currentTheme(),
          department: this.department,
          location: this.location,
          employmentType: this.employmentType,
          postedDate: this.postedDate,
        }).subscribe({
          next: () => {
            this.isSaving = false;
            this.notificationService.success('Success', 'Form updated successfully');
          },
          error: () => {
            this.isSaving = false;
            this.notificationService.error('Error', 'Failed to update form');
          }
        });
      } else {
        const applicationForm: ApplicationForm = {
          id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: this.formName,
          instances: allInstances,
          pages: this.pages,
          themeKey: this.themeService.currentTheme(),
          themeColor: this.themeService.currentThemeColor(),
          department: this.department,
          location: this.location,
          employmentType: this.employmentType,
          postedDate: this.postedDate,
        } as ApplicationForm;
        this.formService.createForm(applicationForm).subscribe({
          next: () => {
            this.isSaving = false;
            this.notificationService.success('Success', 'Form created successfully');
          },
          error: () => {
            this.isSaving = false;
            this.notificationService.error('Error', 'Failed to create form');
           }
        });
      }
    } catch {
      this.isSaving = false;
      this.notificationService.error('Error', 'Failed to save form');
    }
  }
  getInstanceCount(): number {
    return this.pages.reduce((acc, page) => acc + page.instances.length, 0);
  }
  onDepartmentUpdated(value: string) {
    this.department = value;
  }
  onLocationUpdated(value: string) {
    this.location = value;
  }
  onEmploymentTypeUpdated(value: string) {
    this.employmentType = value;
  }
  onPostedDateUpdated(value: string) {
    this.postedDate = value;
  }
}

import { Component, inject } from '@angular/core';
import {ComponentPaletteComponent} from '../../../lib/components/form-builders/component-palette/component-palette.component';
import {FormCanvasComponent} from '../../../lib/components/form-builders/form-canvas/form-canvas.component';
import { UIBlockInstance } from '../../../lib/core/models/ui-block-instance.model';
import { ThemeService } from '../../../lib/core/services/theme.service';
import { CommonModule } from '@angular/common';
import { RightPropertySideComponent } from '../../../lib/components/right-property-side/right-property-side.component';
import {ApplicationFormService} from '../../../lib/core/services/application-form.service';
import { ApplicationForm } from '../../../lib/core/models/application-form.model';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-form-generation',
  imports: [ComponentPaletteComponent, FormCanvasComponent, CommonModule, RightPropertySideComponent],
  templateUrl: './form-generation.component.html',
  styleUrl: './form-generation.component.scss',
  standalone: true
})
export class FormGenerationComponent implements OnInit {
  selectedInstanceId?: string;
  selectedInstance?: UIBlockInstance;
  instances: UIBlockInstance[] = [];
  optionsDrawerVisible = false;
  optionsEditingInstanceId?: string;
  themeService = inject(ThemeService);
  formService = inject(ApplicationFormService);
  formName: string = 'Application Form';
  isSaving = false;
  private route = inject(ActivatedRoute);
  notificationService = inject(NzNotificationService);
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id)  {
        this.instances = [];
        this.formName = 'Application Form';
        return;
      }
      this.formService.getForm(id).subscribe({
        next: form => {
          if (!form) return;
          this.instances = form.instances ?? [];
          this.formName = form.name ?? 'Application Form';
          if (form.themeKey) this.themeService.setTheme(form.themeKey);
        }
      })
    })
  }
  onInstanceAdded(instance: UIBlockInstance) {
    this.instances = [...this.instances, instance];
  }
  onInstanceSelected(id: string) {
    this.selectedInstanceId = id;
    this.selectedInstance = this.instances.find(instance => instance.id === id);
  
    // Mở right side nếu component này có options (select, radio, checkbox)
    const selected = this.selectedInstance;
    const hasOptions =
      !!selected && ['select', 'radio', 'checkbox'].includes(selected.componentType);
  
    this.optionsEditingInstanceId = hasOptions ? id : undefined;
    this.optionsDrawerVisible = hasOptions;
  }
  
  onInstanceRemoved(id: string) {
    this.instances = this.instances.filter(instance => instance.id !== id);
  
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
    this.instances = this.instances.map(instance =>
      instance.id === updated.id ? updated : instance
    );
    if (this.selectedInstanceId === updated.id) {
      this.selectedInstance = updated;
    }
  }
  onInstanceLabelUpdate(payload: {id: string, label: string}) {
    this.instances = this.instances.map(instance => 
      instance.id === payload.id
      ? {...instance, config: {...instance.config, label: payload.label}}
      : instance
    )
    if (this.selectedInstanceId === payload.id) {
      this.selectedInstance = this.instances.find(instance => instance.id === payload.id);
    }
  }
  onOptionClicked(instanceId: string) {
    this.optionsEditingInstanceId = instanceId;
    this.optionsDrawerVisible = true;
  }
  
  onOptionsUpdated(payload: {instanceId: string, options: Array<{label: string, value: string}>}) {
    const instance = this.instances.find(i => i.id === payload.instanceId);
    if (instance) {
      const updated = {
        ...instance,
        config: {
          ...instance.config,
          options: payload.options
        }
      };
      this.onInstanceUpdated(updated);
    }
  }
  
  get optionsEditingInstance(): UIBlockInstance | undefined {
    return this.instances.find(i => i.id === this.optionsEditingInstanceId);
  }
  onSurveyTitleUpdated(title: string) {
    this.formName = title;
  }

  async onFormComplete() {
    if (this.instances.length === 0 || this.isSaving) return;
    this.isSaving = true;
    try {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.formService.updateForm(id, {
          name: this.formName,
          instances: this.instances,
          themeKey: this.themeService.currentTheme(),
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
          instances: this.instances,
          themeKey: this.themeService.currentTheme(),
          themeColor: this.themeService.currentThemeColor(),
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
}

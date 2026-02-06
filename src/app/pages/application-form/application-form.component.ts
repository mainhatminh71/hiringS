import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {UIBlockInstance} from '../../../lib/core/models/ui-block-instance.model';
import { Model as SurveyModel} from 'survey-core';
import {ApplicationFormService} from '../../../lib/core/services/application-form.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OnInit, inject} from '@angular/core';
import {ThemeService} from '../../../lib/core/services/theme.service';
import {ApplicationForm} from '../../../lib/core/models/application-form.model';
import { SurveyModule } from 'survey-angular-ui';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {RouterModule} from '@angular/router';
import {ApplicantService} from '../../../lib/core/services/applicant.service';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FormPage} from '../../../lib/core/models/form-page.model';
import { applySurveyTheme } from '../../../lib/core/helpers/theme-helper';
import { ThemedPaginationComponent } from '../../../lib/components/themed-pagination/themed-pagination.component';
@Component({
  selector: 'app-application-form',
  imports: [CommonModule, SurveyModule, RouterModule, NzPaginationModule, NzIconModule, ThemedPaginationComponent],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
  standalone: true
})
export class ApplicationFormComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formService = inject(ApplicationFormService);
  themeService = inject(ThemeService);
  private notificationService = inject(NzNotificationService);
  private applicantService = inject(ApplicantService);

  form?: ApplicationForm;
  surveyModel?: SurveyModel;
  isLoading = true;
  error?: string;
  formPages: FormPage[] = [];
  currentSurveyPageIndex: number = 1;

  private fieldMapping: Map<string, string> = new Map();
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.error = 'Form ID is required';
        this.isLoading = false;
        return;
      }
      this.loadForm(id);
    })

  }
  loadForm(id: string) {
    this.formService.getForm(id).subscribe({
      next: (form) => {
        if (!form) {
          this.error = 'Form not found';
          this.isLoading = false;
          return;
        }
        this.form = form;
        if ((form.themeKey)) this.themeService.setTheme(form.themeKey);
        
        // Load pages nếu có, nếu không thì tạo từ instances
        if (form.pages && form.pages.length > 0) {
          this.formPages = form.pages.sort((a, b) => a.order - b.order);
        } else {
          this.formPages = [{
            id: 'page1',
            name: 'Page 1',
            instances: form.instances || [],
            order: 0
          }];
        }
        
        this.buildSurveyModel(this.formPages);
        
        // Sử dụng requestAnimationFrame để đảm bảo DOM đã render trước khi bắt đầu animation
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.isLoading = false;
          });
        });
      },
      error: () => {
        this.error = 'Failed to load form';
        this.isLoading = false;
      }
    })
  }
  private buildSurveyModel(pages: FormPage[]) {
    this.fieldMapping.clear();
    const surveyJson = this.blocksToSurveyJson(pages);
    this.surveyModel = new SurveyModel(surveyJson);
    this.surveyModel.showCompleteButton = false;

    // Áp dụng theme từ form.themeKey
    if (this.form?.themeKey) {
      applySurveyTheme(this.surveyModel, this.form.themeKey);
    } else {
      applySurveyTheme(this.surveyModel, 'default-dark');
    }
    
    // Ẩn pagination mặc định của SurveyJS nếu có nhiều hơn 1 page
    if (pages.length > 1) {
      this.surveyModel.showProgressBar = 'off';
    }
    
    // Track current page changes
    this.surveyModel.onCurrentPageChanged.add((sender) => {
      this.currentSurveyPageIndex = sender.currentPageNo + 1; // SurveyJS uses 0-based index
    });
    
    // Set initial page index
    this.currentSurveyPageIndex = 1;

    // Binding event cho button submit sau khi survey render
    this.surveyModel.onAfterRenderQuestion.add((sender, options) => {
      if (options.question.getType() === 'html') {
        const htmlElement = options.htmlElement;
        if (htmlElement) {
          const submitButton = htmlElement.querySelector('button[data-submit-button="true"]');
          if (submitButton) {
            // Remove existing listeners để tránh duplicate
            const newButton = submitButton.cloneNode(true) as HTMLButtonElement;
            submitButton.parentNode?.replaceChild(newButton, submitButton);
            
            // Bind click event
            newButton.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.onSubmit();
            });
          }
        }
      }
    });
    
    this.surveyModel.onComplete.add((sender) => {
      this.submitApplication(sender.data);
    });
  }
  
  onSubmit() {
    if (!this.surveyModel) return;
    
    // Validate form trước khi submit
    if (this.surveyModel.hasErrors()) {
      this.surveyModel.validate();
      this.notificationService.warning('Validation', 'Please fill in all required fields');
      return;
    }
    
    // Trigger complete event
    this.surveyModel.doComplete();
  }
  private submitApplication(formData: Record<string, any>) {
    if (!this.form?.id) {
      this.notificationService.error('Error', 'Form not found');
      return;
    }
    const transformedData : Record<string, any> = {
      ...formData,
    _fieldMapping: Object.fromEntries(this.fieldMapping.entries()),
    }
    const applicantData = {
      formId: this.form.id,
      formName: this.form.name,
      data: transformedData
    };
    this.applicantService.createApplicant(applicantData).subscribe({
      next: () => {
        this.notificationService.success('Success', 'Application submitted successfully');
      },
      error: (error: any) => {
        this.notificationService.error('Error', error.message || 'Failed to submit application');
      }
    });
  }
  private blocksToSurveyJson(pages: FormPage[]) : any {
    return {
      title: this.form?.name  || 'Application Form',
      showQuestionNumbers: 'off',
      showCompleteButton: false,
      pages: pages.map((page, pageIndex) => ({
        name: `page${pageIndex + 1}`,
        title: page.name,
        elements: page.instances.map((b, index) => this.mapBlockToSurveyElement(b, index))
      }))
    }
  }
  
  onPaginationChange(page: number) {
    if (this.surveyModel && page >= 1 && page <= this.surveyModel.pageCount) {
      this.surveyModel.currentPageNo = page - 1; // SurveyJS uses 0-based index
      this.currentSurveyPageIndex = page;
    }
  }
  goBack() {
    this.router.navigate(['/careers']);
  }
  private mapBlockToSurveyElement(block: UIBlockInstance, index: number): any {
    const cfg: Record<string, any> = block.config || {};
    const fieldName = this.generateFieldName(cfg['label'] as string, block.componentType, index);

    this.fieldMapping.set(fieldName, block.id);

    const base = {
      id: block.id,
      name: fieldName,
      title: (cfg['label'] as string) || block.componentType,
      isRequired: !!cfg['required'],
    };

    switch (block.componentType) {
      case 'input-text':
        return { ...base, type: 'text', placeholder: (cfg['placeholder'] as string) || '' };

      case 'input-email':
        return {
          ...base,
          type: 'text',
          inputType: 'email',
          placeholder: (cfg['placeholder'] as string) || '',
        };

      case 'input-password':
        return {
          ...base,
          type: 'text',
          inputType: 'password',
          placeholder: (cfg['placeholder'] as string) || '',
          required: false
        };

      case 'input-number': {
        const min = cfg['min'] as number | null | undefined;
        const max = cfg['max'] as number | null | undefined;
        const step = cfg['step'] as number | null | undefined;
        return {
          ...base,
          type: 'text',
          inputType: 'number',
          placeholder: (cfg['placeholder'] as string) || '',
          min: min ?? undefined,
          max: max ?? undefined,
          step: step ?? undefined,
        };
      }

      case 'textarea':
        return {
          ...base,
          type: 'comment',
          placeholder: (cfg['placeholder'] as string) || '',
        };

      case 'select':
        return {
          ...base,
          type: 'dropdown',
          choices: (cfg['options'] as any[] | undefined || []).map(o => ({
            text: o.label,
            value: o.value,
          })),
        };

      case 'checkbox': {
        const options = (cfg['options'] as any[] | undefined || []);
        const isBinary = !!cfg['binary'] && options.length === 0;
        if (isBinary) {
          return {
            ...base,
            type: 'boolean',
          };
        }
        return {
          ...base,
          type: 'checkbox',
          choices: options.map(o => ({
            text: o.label,
            value: o.value,
          })),
        };
      }

      case 'radio':
        return {
          ...base,
          type: 'radiogroup',
          choices: (cfg['options'] as any[] | undefined || []).map(o => ({
            text: o.label,
            value: o.value,
          })),
        };

      case 'datepicker':
        return {
          ...base,
          type: 'text',
          inputType: 'date',
        };

      case 'file-upload':
        return {
          ...base,
          type: 'file',
          maxSize: cfg['maxFileSize'],
          allowMultiple: !!cfg['multiple'],
        };

      case 'image-upload':
        return {
          ...base,
          type: 'file',
          maxSize: cfg['maxFileSize'],
          allowMultiple: !!cfg['multiple'],
          acceptedFileTypes: cfg['accept'] || 'image/*',
        };

      case 'button':
        const buttonType = (cfg['type'] as string) || 'button';
        const buttonLabel = (cfg['label'] as string) || 'Submit';
        const isSubmitButton = buttonType === "submit";
        const submitAttr = isSubmitButton ? 'data-submit-button="true"' : '';
        return {
          ...base,
          type: 'html',
          html: `<button type="button" ${submitAttr}>${buttonLabel}</button>`,
        };

      case 'divider':
        return {
          type: 'html',
          name: `divider_${index}`,
          html: '<hr />',
        };
        case 'description-area':
          const descriptionContent = (cfg['content'] as string) || '';
          const descriptionLabel = (cfg['label'] as string) || 'Description';
          
          const themeKey = this.form?.themeKey || 'default-dark';
          const descColors = this.themeService.getDescriptionAreaColors(themeKey);
          
          return {
            ...base,
            type: 'html',
            html: `<div class="description-area" style="padding: 1rem; background: ${descColors.background}; border-radius: 4px; border-left: 3px solid ${descColors.border}; margin: 1rem 0;">
                     <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: ${descColors.labelColor};">${descriptionLabel}</p>
                     <p style="margin: 0; color: ${descColors.contentColor}; white-space: pre-wrap;">${descriptionContent}</p>
                   </div>`,
          };
      default:
        return {
          ...base,
          type: 'html',
          html: `<span>${base.title}</span>`,
        };
    }
  }
  private generateFieldName(label?: string, componentType?: string, index?: number) : string {
    if (label) {
      return label
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
      .replace(/[^a-z0-9]/g, '');
    }
    if (componentType) {
      const cleanType =  componentType.replace(/^input-/, '');
      return cleanType + (index !== undefined ? `_${index}` : '');
    }
    return `mewmew`;
  } 
}

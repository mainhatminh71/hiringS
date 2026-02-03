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
@Component({
  selector: 'app-application-form',
  imports: [CommonModule, SurveyModule, RouterModule],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
  standalone: true
})
export class ApplicationFormComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formService = inject(ApplicationFormService);
  private themeService = inject(ThemeService);
  private notificationService = inject(NzNotificationService);
  private applicantService = inject(ApplicantService);

  form?: ApplicationForm;
  surveyModel?: SurveyModel;
  isLoading = true;
  error?: string;
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
        this.buildSurveyModel(form.instances || []);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load form';
        this.isLoading = false;
      }
    })
  }
  private buildSurveyModel(instances: UIBlockInstance[]) {
    const surveyJson = this.blocksToSurveyJson(instances);
    this.surveyModel = new SurveyModel(surveyJson);
    this.surveyModel.showCompleteButton = false;

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
    const applicantData = {
      formId: this.form.id,
      formName: this.form.name,
      data: formData
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
  private blocksToSurveyJson(block: UIBlockInstance[]) : any {
    return {
      title: this.form?.name  || 'Application Form',
      showQuestionNumbers: 'off',
      showCompleteButton: false,
      pages: [
        {
          name: 'page1',
          elements: this.form?.instances.map((b, index) => this.mapBlockToSurveyElement(b, index)) || [],
        }
      ]
    }
  }
  private mapBlockToSurveyElement(block: UIBlockInstance, index: number): any {
    const cfg: Record<string, any> = block.config || {};

    const base = {
      name: block.id,
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

      default:
        return {
          ...base,
          type: 'html',
          html: `<span>${base.title}</span>`,
        };
    }
  }
}

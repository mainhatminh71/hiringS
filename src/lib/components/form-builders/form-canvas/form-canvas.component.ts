import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { setupDeleteButton,setupEditableTitle,
  setupEditableOptions,
  setupSelectable,
  applySelectedStateToElement,
  SetupContext,
  setupEditableSurveyTitle,
  SurveyTitleContext,
  setupEditableDescriptionContent} from '../../../core/helpers/canvas-setup.helper';
import { Model as SurveyModel } from 'survey-core';
import { SurveyModule } from 'survey-angular-ui';

import { UIBlockInstance } from '../../../core/models/ui-block-instance.model';
import { UIBlock } from '../../../core/models/ui-block.model';
import { applySurveyTheme, SurveyThemeKey } from '../../../core/helpers/theme-helper';
import { ThemeService } from '../../../core/services/theme.service';
import { inject } from '@angular/core';
@Component({
  selector: 'app-form-canvas',
  standalone: true,
  imports: [CommonModule, DragDropModule, SurveyModule, ScrollingModule],
  templateUrl: './form-canvas.component.html',
  styleUrl: './form-canvas.component.scss',
})
export class FormCanvasComponent implements OnChanges {
  @Input() blocks: UIBlockInstance[] = [];
  @Input() selectedInstanceId?: string;
  @Input() themeKey: SurveyThemeKey = 'default-dark';
  @Input() formName: string = 'Application Form';
  @Input() department: string = '';
  @Input() location: string = '';
  @Input() employmentType: string = '';
  @Input() postedDate: string = '';

  @Output() optionClicked = new EventEmitter<string>();
  @Output() formCompleted = new EventEmitter<void>();

  private questionEls = new Map<string, HTMLElement>();

  @Output() instanceAdded = new EventEmitter<UIBlockInstance>();
  @Output() instanceUpdated = new EventEmitter<UIBlockInstance>();
  @Output() instanceRemoved = new EventEmitter<string>();
  @Output() instanceSelected = new EventEmitter<string>();
  @Output() surveyTitleUpdated = new EventEmitter<string>();
  
  @Output() departmentUpdated = new EventEmitter<string>();
  @Output() locationUpdated = new EventEmitter<string>();
  @Output() employmentTypeUpdated = new EventEmitter<string>();
  @Output() postedDateUpdated = new EventEmitter<string>();

  themeService = inject(ThemeService);

  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  scrollToTop() {
    this.scrollable?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToBottom() {
    this.scrollable?.scrollTo({ bottom: 0, behavior: 'smooth' });
  }

  surveyModel?: SurveyModel;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blocks'] || changes['themeKey'] || changes['formName']) {
      this.updateSurveyModel();
    }
    if (changes['selectedInstanceId']) {
      this.applySelectedState();
    }
  }

  onDrop(event: CdkDragDrop<any>) {
    const block: UIBlock = event.item.data;
    if (block && typeof block.createInstance === 'function') {
      const newInstance = block.createInstance();
      this.instanceAdded.emit(newInstance);
    }
  }

  onSelect(instanceId: string) {
    this.instanceSelected.emit(instanceId);
  }

  onDelete(instanceId: string) {
    this.instanceRemoved.emit(instanceId);
  }

  onDepartmentChange(value: string) {
    this.departmentUpdated.emit(value);
  }
  onLocationChange(value: string) {
    this.locationUpdated.emit(value);
  }
  onEmploymentTypeChange(value: string) {
    this.employmentTypeUpdated.emit(value);
  }
  onPostedDateChange(value: string) {
    this.postedDateUpdated.emit(value);
  }

  private emitLabelUpdate(instanceId: string, label: string) {
    const instance = this.blocks.find(block => block.id === instanceId);
    if (!instance) {
      return;
    }
    this.instanceUpdated.emit({
      ...instance,
      config: { ...instance.config, label },
    });
  }

  private emitOptionsUpdate(instanceId: string, options: Array<{label: string, value: string}>) {
    const instance = this.blocks.find(block => block.id === instanceId);
    if (!instance) return;
    this.instanceUpdated.emit({
      ...instance,
      config: {...instance.config, options}
    })
  }

  trackByInstanceId(_index: number, instance: UIBlockInstance): string {
    return instance.id;
  }

  get themeColors() {
    return this.themeService.getThemeColors(this.themeKey);
  }

  private updateSurveyModel(): void {
    this.questionEls.clear();
    const json = this.blocksToSurveyJson(this.blocks);
    const model = new SurveyModel(json);
    applySurveyTheme(model, this.themeKey);

    model.showCompletedPage = false;
    model.completedHtml = '';
  
    model.onAfterRenderQuestion.add((_sender, options) => {
      const questionEl = options.htmlElement as HTMLElement;
      if (!questionEl) {
        return;
      }
  
      const id = options.question.name;
      this.questionEls.set(id, questionEl);

      const context: SetupContext = {
        instanceId: id,
        blocks: this.blocks,
        onDelete: (instanceId) => this.onDelete(instanceId),
        onSelect: (instanceId) => this.onSelect(instanceId),
        onLabelUpdate: (instanceId, label) => this.emitLabelUpdate(instanceId, label),
        onOptionsUpdate: (instanceId, options) => this.emitOptionsUpdate(instanceId, options),
        onContentUpdate: (instanceId, content) => this.emitContentUpdate(instanceId, content),
        onTitleUpdate: () => {}, 
        selectedInstanceId: this.selectedInstanceId,
        onOptionClick: (instanceId) => this.optionClicked.emit(instanceId),
      };

      setupDeleteButton(questionEl, context);
      setupEditableTitle(questionEl, options.question, context);
      setupEditableOptions(questionEl, options.question, context);
      setupEditableDescriptionContent(questionEl, options.question, context);
      setupSelectable(questionEl, context);
      applySelectedStateToElement(questionEl, context);
    });
    model.onAfterRenderSurvey.add((_sender, options) => {
      const surveyEl = options.htmlElement as HTMLElement;
      if (!surveyEl) return;
    
      const titleContext: SurveyTitleContext = {
        onTitleUpdate: (title) => this.surveyTitleUpdated.emit(title),
      };
    
      setupEditableSurveyTitle(surveyEl, titleContext);
    });   
    model.onCompleting.add((_sender, options) => {
      options.allowComplete = false;
      this.formCompleted.emit();
    })
  
    this.surveyModel = model;
  }
  private emitContentUpdate(instanceId: string, content: string) {
    const instance = this.blocks.find(b => b.id === instanceId);
    if (!instance) return;
    const updatedInstance: UIBlockInstance = {
      ...instance,
      config: {
        ...instance.config,
        content
      }
    }
    this.instanceUpdated.emit(updatedInstance);
  }
  private applySelectedState(): void {
    this.questionEls.forEach((el, id) => {
      el.classList.toggle('canvas-question-selected', this.selectedInstanceId === id);
    });
  }

  private blocksToSurveyJson(blocks: UIBlockInstance[]): any {
    return {
      title: this.formName,
      showQuestionNumbers: 'off',
      pages: [
        {
          name: 'page1',
          elements: blocks.map((b, index) => this.mapBlockToSurveyElement(b, index)),
        },
      ],
    };
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
        return {
          ...base,
          type: 'html',
          html: `<button type="button">${(cfg['label'] as string) || 'Submit'}</button>`,
        };

      case 'divider':
        return {
          type: 'html',
          name: `divider_${index}`,
          html: '<hr />',
        };
        case 'description-area':
          // Trong form builder, hiển thị như textarea để người tạo form có thể nhập description
          return {
            ...base,
            type: 'comment',
            placeholder: (cfg['content'] as string) || 'Enter description here',
            defaultValue: (cfg['content'] as string) || '', // Set value để có thể edit
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
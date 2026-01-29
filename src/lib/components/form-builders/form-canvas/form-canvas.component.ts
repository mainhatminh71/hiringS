import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';

import { Model as SurveyModel } from 'survey-core';
import { SurveyModule } from 'survey-angular-ui';

import { UIBlockInstance } from '../../../core/models/ui-block-instance.model';
import { UIBlock } from '../../../core/models/ui-block.model';
import { applySurveyTheme, SurveyThemeKey } from '../../../core/helpers/theme-helper';
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

  private questionEls = new Map<string, HTMLElement>();

  @Output() instanceAdded = new EventEmitter<UIBlockInstance>();
  @Output() instanceUpdated = new EventEmitter<UIBlockInstance>();
  @Output() instanceRemoved = new EventEmitter<string>();
  @Output() instanceSelected = new EventEmitter<string>();

  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  scrollToTop() {
    this.scrollable?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  scrollToBottom() {
    this.scrollable?.scrollTo({ bottom: 0, behavior: 'smooth' });
  }

  surveyModel?: SurveyModel;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blocks'] || changes['themeKey']) {
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

  trackByInstanceId(_index: number, instance: UIBlockInstance): string {
    return instance.id;
  }

  private updateSurveyModel(): void {
    this.questionEls.clear();
    const json = this.blocksToSurveyJson(this.blocks);
    const model = new SurveyModel(json);
    applySurveyTheme(model, this.themeKey);
  
    model.onAfterRenderQuestion.add((_sender, options) => {
      const questionEl = options.htmlElement as HTMLElement;
      if (!questionEl) {
        return;
      }
  
      const id = options.question.name;
      this.questionEls.set(id, questionEl);
  
      if (!questionEl.querySelector('.canvas-delete-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'canvas-delete-btn';
        btn.textContent = 'Delete';
        btn.setAttribute('aria-label', 'Delete');
        btn.setAttribute('style', 'color: #ef4444; padding-top: 10px; font-size: 16px;');
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          this.onDelete(id);
        });
        questionEl.appendChild(btn);
      }

      const titleEl =
        (questionEl.querySelector('.sv-question__title .sv-string-viewer') as HTMLElement | null) ||
        (questionEl.querySelector('.sv-question__title') as HTMLElement | null) ||
        (questionEl.querySelector('.sv-string-viewer') as HTMLElement | null);

      if (titleEl && titleEl.dataset['canvasEditable'] !== '1') {
        titleEl.dataset['canvasEditable'] = '1';
        titleEl.setAttribute('contenteditable', 'true');
        titleEl.setAttribute('role', 'textbox');
        titleEl.setAttribute('spellcheck', 'false');
        titleEl.classList.add('canvas-editable-label');

        titleEl.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            (event.target as HTMLElement).blur();
          }
        });

        titleEl.addEventListener('blur', () => {
          const nextLabel = (titleEl.textContent || '').trim();
          const fallback = options.question.title || options.question.name || '';
          const finalLabel = nextLabel || fallback;

          if (!nextLabel) {
            titleEl.textContent = finalLabel;
          }

          if (finalLabel && finalLabel !== options.question.title) {
            options.question.title = finalLabel;
            this.emitLabelUpdate(id, finalLabel);
          }
        });
      }

      if (questionEl.dataset['canvasSelectable'] !== '1') {
        questionEl.dataset['canvasSelectable'] = '1';
        questionEl.classList.add('canvas-question-clickable');
        questionEl.addEventListener('click', (event) => {
          event.stopPropagation();
          this.onSelect(id);
        });
        questionEl.addEventListener('focusin', () => {
          this.onSelect(id);
        });
      }
  
      questionEl.classList.toggle(
        'canvas-question-selected',
        this.selectedInstanceId === id
      );
    });
  
    this.surveyModel = model;
  }
  private applySelectedState(): void {
    this.questionEls.forEach((el, id) => {
      el.classList.toggle('canvas-question-selected', this.selectedInstanceId === id);
    });
  }

  private blocksToSurveyJson(blocks: UIBlockInstance[]): any {
    return {
      title: 'Application Form',
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
        };

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

      case 'checkbox':
        return {
          ...base,
          type: 'checkbox',
          choices: (cfg['options'] as any[] | undefined || []).map(o => ({
            text: o.label,
            value: o.value,
          })),
        };

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

      default:
        return {
          ...base,
          type: 'html',
          html: `<span>${base.title}</span>`,
        };
    }
  }
}
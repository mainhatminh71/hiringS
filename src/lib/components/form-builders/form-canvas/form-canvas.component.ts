import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
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
import Lenis from 'lenis';

import { UIBlockInstance } from '../../../core/models/ui-block-instance.model';
import { UIBlock } from '../../../core/models/ui-block.model';
import { applySurveyTheme, SurveyThemeKey } from '../../../core/helpers/theme-helper';
import { ThemeService } from '../../../core/services/theme.service';
import { inject } from '@angular/core';
import { CanvasHeaderComponent } from '../canvas-header/canvas-header.component';
@Component({
  selector: 'app-form-canvas',
  standalone: true,
  imports: [CommonModule, DragDropModule, SurveyModule, ScrollingModule, CanvasHeaderComponent],
  templateUrl: './form-canvas.component.html',
  styleUrl: './form-canvas.component.scss',
})
export class FormCanvasComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
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
  @Output() instanceAddedAt = new EventEmitter<{instance: UIBlockInstance, index: number}>();
  @Output() instanceUpdated = new EventEmitter<UIBlockInstance>();
  @Output() instanceRemoved = new EventEmitter<string>();
  @Output() instanceSelected = new EventEmitter<string>();
  @Output() surveyTitleUpdated = new EventEmitter<string>();
  
  @Output() departmentUpdated = new EventEmitter<string>();
  @Output() locationUpdated = new EventEmitter<string>();
  @Output() employmentTypeUpdated = new EventEmitter<string>();
  @Output() postedDateUpdated = new EventEmitter<string>();

  @Output() instancesReordered = new EventEmitter<{ previousIndex: number, currentIndex: number }>();

  themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;
  @ViewChild('canvasScrollWrapper', { static: false }) canvasScrollWrapper!: ElementRef<HTMLElement>;

  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  ngOnInit(): void {
    // Lenis sẽ được init trong ngAfterViewInit
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Delay để đảm bảo DOM và survey đã render
      setTimeout(() => {
        this.initLenis();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.destroyLenis();
  }

  private initLenis(): void {
    if (!this.isBrowser || !this.canvasScrollWrapper?.nativeElement) {
      return;
    }

    // Destroy existing Lenis instance nếu có
    if (this.lenis) {
      this.destroyLenis();
    }

    const container = this.canvasScrollWrapper.nativeElement;
    const content = container.querySelector('.canvas-drop-zone') as HTMLElement;
    
    if (!content) {
      return;
    }

    // Đảm bảo container có đúng styles cho Lenis
    container.style.overflow = 'hidden';
    container.style.position = 'relative';
    container.style.height = '100%';
    
    // Đảm bảo content có đúng height
    content.style.minHeight = '100%';
    
    // Add lenis class to container
    container.classList.add('lenis', 'lenis-smooth');
    
    // Setup Lenis với wrapper và content
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      wrapper: container,
      content: content,
    });

    // Update Lenis khi content thay đổi
    this.lenis.on('scroll', () => {
      // Lenis tự động update scroll position
    });

    // Setup RAF loop
    const raf = (time: number) => {
      if (this.lenis) {
        this.lenis.raf(time);
        this.rafId = requestAnimationFrame(raf);
      }
    };

    this.rafId = requestAnimationFrame(raf);
    
    // Recalculate scroll khi content thay đổi
    if (this.lenis) {
      this.lenis.resize();
    }
  }

  private destroyLenis(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    if (this.canvasScrollWrapper?.nativeElement) {
      this.canvasScrollWrapper.nativeElement.classList.remove('lenis', 'lenis-smooth');
    }
  }

  scrollToTop() {
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: false });
    } else {
      this.scrollable?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  scrollToBottom() {
    if (this.lenis && this.canvasScrollWrapper?.nativeElement) {
      const container = this.canvasScrollWrapper.nativeElement;
      const content = container.querySelector('.canvas-drop-zone') as HTMLElement;
      if (content) {
        const maxScroll = content.scrollHeight - container.clientHeight;
        this.lenis.scrollTo(maxScroll, { immediate: false });
      }
    } else {
      this.scrollable?.scrollTo({ bottom: 0, behavior: 'smooth' });
    }
  }

  surveyModel?: SurveyModel;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blocks'] || changes['themeKey'] || changes['formName']) {
      this.updateSurveyModel();
      // Re-init Lenis sau khi survey model update
      if (this.isBrowser && this.surveyModel) {
        setTimeout(() => {
          this.destroyLenis();
          this.initLenis();
        }, 400);
      }
    }
    if (changes['selectedInstanceId']) {
      this.applySelectedState();
    }
  }

  onDrop(event: CdkDragDrop<any>) {
    const block: UIBlock = event.item.data;
    if (block && typeof block.createInstance === 'function') {
      const newInstance = block.createInstance();
      
      // Nếu drop từ palette (previousContainer !== container)
      if (event.previousContainer !== event.container) {
        // Tính toán vị trí chèn dựa trên vị trí chuột
        const dropIndex = this.calculateDropIndex(event);
        
        if (dropIndex !== undefined && dropIndex >= 0 && dropIndex <= this.blocks.length) {
          this.instanceAddedAt.emit({ instance: newInstance, index: dropIndex });
        } else {
          // Fallback: thêm vào cuối
          this.instanceAdded.emit(newInstance);
        }
      } else {
        // Reorder trong canvas
        this.instanceAdded.emit(newInstance);
      }
    }
  }

  private calculateDropIndex(event: CdkDragDrop<any>): number {
    // Lấy vị trí drop từ event
    const dropPoint = event.dropPoint || { x: 0, y: 0 };
    
    // Tìm tất cả các question elements
    const questionElements: Array<{ element: HTMLElement, instanceId: string, y: number }> = [];
    
    this.questionEls.forEach((element, instanceId) => {
      const rect = element.getBoundingClientRect();
      questionElements.push({
        element,
        instanceId,
        y: rect.top + rect.height / 2 // Lấy điểm giữa của question
      });
    });
    
    // Sắp xếp theo thứ tự Y (từ trên xuống dưới)
    questionElements.sort((a, b) => a.y - b.y);
    
    // Tìm question gần nhất với vị trí drop
    const dropY = dropPoint.y;
    let insertIndex = this.blocks.length; // Mặc định chèn vào cuối
    
    for (let i = 0; i < questionElements.length; i++) {
      const question = questionElements[i];
      if (dropY < question.y) {
        // Nếu drop ở trên question này, chèn vào trước nó
        const instanceId = question.instanceId;
        insertIndex = this.blocks.findIndex(b => b.id === instanceId);
        break;
      }
    }
    
    return insertIndex;
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

  onInstanceReorder(event: CdkDragDrop<UIBlockInstance[]>) {
    if (event.previousIndex !== event.currentIndex) {
      this.instancesReordered.emit({
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex
      });
    }
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
            isRequired: false
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
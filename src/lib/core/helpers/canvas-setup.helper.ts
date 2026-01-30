export interface SetupContext {
    instanceId: string;
    blocks: any[];
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onLabelUpdate: (id: string, label: string) => void;
    onOptionsUpdate: (id: string, options: Array<{ label: string, value: string }>) => void;
    onTitleUpdate: (title: string) => void;
    selectedInstanceId?: string;
}
export interface SurveyTitleContext {
    onTitleUpdate: (title: string) => void;
}

export function setupDeleteButton(questionEl: HTMLElement, context: SetupContext): void {
    if (questionEl.querySelector('.canvas-delete-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'canvas-delete-btn';
    btn.textContent = 'Delete';
    btn.setAttribute('aria-label', 'Delete');
    btn.setAttribute('style', 'color: #ef4444; padding-top: 10px; font-size: 16px;');
    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        context.onDelete(context.instanceId);
    });
    questionEl.appendChild(btn);
}
export function setupEditableTitle(questionEl: HTMLElement, question: any, context: SetupContext) {
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
          const fallback = question.title || question.name || '';
          const finalLabel = nextLabel || fallback;

          if (!nextLabel) {
            titleEl.textContent = finalLabel;
          }

          if (finalLabel && finalLabel !== question.title) {
            question.title = finalLabel;
            context.onLabelUpdate(context.instanceId, finalLabel);
          }
        });
      }
}

export function setupEditableOptions(questionEl: HTMLElement, question: any, context: SetupContext) {
    const questionType = question.getType();
    if (questionType !== 'radiogroup' && questionType !== 'checkbox' && questionType !== 'dropdown') return;
    
    const setupOptions = () => {
        const choices = question.choices || [];
        if (choices.length === 0) return;

        let itemContainers = questionEl.querySelectorAll('.sd-item__control-label');

        itemContainers.forEach((itemEl, index) => {
            if (index >= choices.length) return;
            const labelEl = itemEl.querySelector('span.sv-string-viewer') as HTMLElement;
            
            if (!labelEl) {
                console.warn('Could not find .sv-string-viewer for choice', index, itemEl);
                return;
            }

            // Skip nếu đã setup rồi
            if (labelEl.dataset['canvasOptionEditable'] === '1') {
                return;
            }

            const choice = choices[index];
            const originalText = choice.text || choice.value || '';

            // Setup editable
            labelEl.dataset['canvasOptionEditable'] = '1';
            labelEl.dataset['optionIndex'] = index.toString();
            labelEl.setAttribute('contenteditable', 'true');
            labelEl.setAttribute('role', 'textbox');
            labelEl.setAttribute('spellcheck', 'false');
            labelEl.classList.add('canvas-editable-option');
            
            // Style để dễ nhận biết
            labelEl.style.cursor = 'text';
            labelEl.style.minWidth = '50px';
            labelEl.style.display = 'inline-block';
            labelEl.style.outline = 'none';

            labelEl.addEventListener('mousedown', (event) => {
                event.stopPropagation();
            });

            labelEl.addEventListener('click', (event) => {
                if (document.activeElement === labelEl || labelEl === event.target) {
                    event.stopPropagation();
                }
            });

            labelEl.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    labelEl.blur();
                }
                event.stopPropagation();
            });

            labelEl.addEventListener('blur', () => {
                const newText = (labelEl.textContent || '').trim();
                const finalText = newText || originalText;

                if (!newText) {
                    labelEl.textContent = finalText;
                    return;
                }

                // Update SurveyJS model
                if (choice && finalText !== choice.text) {
                    choice.text = finalText;
                    question.choices = [...question.choices];
                }

                // Update instance config
                const instance = context.blocks.find((block: any) => block.id === context.instanceId);
                if (instance) {
                    const currentOptions = (instance.config['options'] as any[] || []);
                    const updatedOptions = [...currentOptions];
                    
                    if (updatedOptions[index]) {
                        updatedOptions[index] = {
                            ...updatedOptions[index],
                            label: finalText,
                        };
                        context.onOptionsUpdate(context.instanceId, updatedOptions);
                    }
                }
            });
        });
    };

    // Setup ngay lập tức với delay nhỏ
    setTimeout(setupOptions, 150);
    
    // Dùng MutationObserver để setup lại khi SurveyJS re-render (Angular change detection)
    const observer = new MutationObserver((mutations) => {
        let shouldReSetup = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Kiểm tra xem có thêm sv-string-viewer mới không
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const el = node as HTMLElement;
                        if (el.querySelector?.('.sv-string-viewer') || el.classList?.contains('sv-string-viewer')) {
                            shouldReSetup = true;
                        }
                    }
                });
            }
        });
        if (shouldReSetup) {
            // Debounce để tránh setup quá nhiều lần
            setTimeout(setupOptions, 100);
        }
    });

    observer.observe(questionEl, {
        childList: true,
        subtree: true
    });
}
export function setupEditableSurveyTitle(surveyEl: HTMLElement, context: SurveyTitleContext) : void {
    const titleEl = surveyEl.querySelector('.sd-title span.sv-string-viewer') as HTMLElement;
    if (!titleEl || titleEl.dataset['canvasSurveyTitleEditable'] === '1') {
        return;
    }
    titleEl.dataset['canvasSurveyTitleEditable'] = '1';
    titleEl.setAttribute('contenteditable', 'true');
    titleEl.setAttribute('role', 'textbox');
    titleEl.setAttribute('spellcheck', 'false');
    titleEl.classList.add('canvas-editable-survey-title');
    titleEl.style.cursor = 'text';
    titleEl.style.outline = 'none';
    titleEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            titleEl.blur();
        }
    });
    titleEl.addEventListener('blur', () => {
        const newTitle = (titleEl.textContent || '').trim();
        const finalTitle = newTitle || 'Application Form';
        if (!newTitle) {
            titleEl.textContent = finalTitle;
        }
        if (finalTitle && finalTitle !== surveyEl.title) {
            surveyEl.title = finalTitle;
            context.onTitleUpdate(finalTitle);
        }
    })
}
export function setupSelectable(questionEl: HTMLElement, context: SetupContext) {
    if (questionEl.dataset['canvasSelectable'] !== '1') {
        questionEl.dataset['canvasSelectable'] = '1';
        questionEl.classList.add('canvas-question-clickable');
        questionEl.addEventListener('click', (event) => {
            event.stopPropagation();
            context.onSelect(context.instanceId);
        });
    }
}
export function applySelectedStateToElement(questionEl: HTMLElement, context: SetupContext) {
    questionEl.classList.toggle(
        'canvas-question-selected',
        context.selectedInstanceId === context.instanceId
    )
}


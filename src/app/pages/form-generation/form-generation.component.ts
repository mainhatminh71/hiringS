import { Component, OnDestroy, Inject, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeftSideComponent } from '../../../lib/layouts/left-side/left-side.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {RouterModule} from '@angular/router';
import {signal} from '@angular/core';
import * as yaml from 'js-yaml';
import { ResizeDirective } from '../../../lib/core/directives/resize.directive';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FieldRegistryService } from '../../../lib/core/services/field-registry.service';
import { GridHelper } from '../../../lib/core/helpers/grid-helper';
import {OnInit} from '@angular/core';
import { GridConfig, GridPosition } from '../../../lib/core/models/grid-config.model';
import { FormFieldWithGrid } from '../../../lib/core/models/grid-config.model';
import {FieldPreviewComponent} from '../../../lib/components/field-preview/field-preview.component';
@Component({
  selector: 'app-form-generation',
  imports: [CommonModule, LeftSideComponent, 
    NzButtonModule, NzIconModule, RouterModule, DragDropModule, FormsModule, FieldPreviewComponent, ResizeDirective],
  templateUrl: './form-generation.component.html',
  styleUrl: './form-generation.component.scss'
})
export class FormGenerationComponent implements OnDestroy, OnInit {
  sidebarVisible = false;
  droppedComponents: any[] = [];
  selectedField = signal<FormFieldWithGrid | null>(null);
  gridConfig = signal<GridConfig>({columns: 12, gap: 16, showGridLines: false, snapToGrid: true});
  formFields = signal<FormFieldWithGrid[]>([]);

  toolboxItems = computed(() => this.fieldRegistry.toolboxItems());
  isLoading = computed(() => this.fieldRegistry.isLoading());

  gridColumnsStyle = computed(() => 
    `repeat(${this.gridConfig().columns}, 1fr)`
  );

  toolboxData = computed(() => 
    this.toolboxItems().map(item => ({ type: item.componentType }))
  );
  ngOnInit(): void {
    this.fieldRegistry.loadRegistry().subscribe({
      next: () => {
        
      },
      error: (err) => {
        console.error('Failed to load field registry:', err);
      }
    });
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  public fieldRegistry: FieldRegistryService,
  private gridHelper: GridHelper) {}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.updateBodyClass();
  }
  
  onSidebarChange(visible: boolean) {
    this.sidebarVisible = visible;
    this.updateBodyClass();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'copy';
  }
  selectField(field: FormFieldWithGrid) {
    this.selectedField.set(field);
  }
  removeField(fieldId: string) {
    this.formFields.update(fields => fields.filter(field => field.id !== fieldId));
    if (this.selectedField()?.id === fieldId) {
      this.selectedField.set(null);
    }
  }


  updateGridPosition(start: number, span: number) {
    const field = this.selectedField();
    if (!field) return;
    
    const newPosition: GridPosition = { start, span };
    if (this.gridHelper.isValidPosition(newPosition, this.gridConfig())) {
      const updated = { 
        ...field, 
        gridPosition: newPosition,
        config: { ...field.config, gridPosition: newPosition }
      };
      this.updateFieldInList(updated);
    }
  }

  updateGridConfig(config: Partial<GridConfig>) {
    this.gridConfig.update(current => ({ ...current, ...config }));
  }
  private updateFieldInList(updated: FormFieldWithGrid) {
    this.formFields.update(fields => 
      fields.map(f => f.id === updated.id ? updated : f)
    );
    this.selectedField.set(updated);
  }

  onDrop(event: CdkDragDrop<FormFieldWithGrid[] | any[]>) {
    if (event.previousContainer === event.container) {
      const fields = [...this.formFields()];
      moveItemInArray(fields, event.previousIndex, event.currentIndex);
      this.formFields.set(fields);
    } else {
      const draggedData = event.previousContainer.data[event.previousIndex] as any;
      const fieldType = draggedData?.type;
      
      if (fieldType) {
        const newField = this.fieldRegistry.createNewFieldFromTemplate(fieldType);
        if (newField) {
          // Tính toán grid position từ config
          const gridPosition = newField.config['gridPosition'] || 
            this.gridHelper.calculateDropPosition(this.gridConfig());
          
          const fieldWithGrid: FormFieldWithGrid = {
            ...newField,
            gridPosition
          };
          
          const updated = [...this.formFields()];
          updated.splice(event.currentIndex, 0, fieldWithGrid);
          this.formFields.set(updated);
        }
      }
    }
  }

  private updateBodyClass() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.sidebarVisible) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('sidebar-open');
    }
  }
 

  updateFieldConfig(propName: string, value: any) {
    const field = this.selectedField();
    if (!field) return;
    
    const updated = { 
      ...field, 
      config: { ...field.config, [propName]: value } 
    };
    this.updateFieldInList(updated);
  }

  getGridItemStyle(field: FormFieldWithGrid): Record<string, string> {
    const styles: Record<string, string> = {};
    const canvasBounds = this.getCanvasBounds();
    
    if (field.width) {
      styles['grid-column'] = 'auto';
      const validWidth = Math.min(field.width, canvasBounds.width);
      styles['width'] = `${validWidth}px`;
      styles['min-width'] = `${validWidth}px`;
      styles['max-width'] = `${validWidth}px`;
    } else if (field.gridPosition) {
      Object.assign(styles, this.gridHelper.getGridItemStyle(field.gridPosition));
    } else {
      styles['grid-column'] = '1 / -1';
    }
  
    if (field.height) {
      styles['height'] = `${field.height}px`;
    }
    
    if (field.left !== undefined && field.left !== 0) {
      // Validate left position
      const validLeft = Math.max(0, Math.min(field.left, canvasBounds.width - (field.width || 0)));
      styles['position'] = 'relative';
      styles['left'] = `${validLeft}px`;
    }
    
    return styles;
  }

  toggleGridLines() {
    this.gridConfig.update(config => ({
      ...config,
      showGridLines: !config.showGridLines
    }));
  }
  onResize(field: FormFieldWithGrid, size: { width: number; height: number; leftOffset?: number }) {
    const canvasBounds = this.getCanvasBounds();
    const updated: FormFieldWithGrid = {
      ...field,
      width: size.width,
      height: size.height
    };
    updated.width = Math.min(updated.width || canvasBounds.width, canvasBounds.width);

    
    // Chỉ cập nhật left khi có leftOffset (từ onMouseUp với absolute position)
    // Set trực tiếp, không cộng dồn để tránh component bị văng xa
    if (size.leftOffset !== undefined) {
      updated.left = size.leftOffset;
      updated.left = Math.max(0, updated.left);
      updated.left = Math.min(updated.left, canvasBounds.width - (updated.width || 0));

    }
    
    this.updateFieldInList(updated);
  }

  private getCanvasBounds(): {width: number, left: number} {
    return {
      width: 1436,
      left: 32
    }
  }

}

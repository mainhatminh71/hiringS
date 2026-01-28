import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { UIBlockInstance } from '../../../core/models/ui-block-instance.model';
import { UIBlock } from '../../../core/models/ui-block.model';
@Component({
  selector: 'app-form-canvas',
  imports: [CommonModule, DragDropModule],
  templateUrl: './form-canvas.component.html',
  styleUrl: './form-canvas.component.scss',
  standalone: true
})
export class FormCanvasComponent {
  @Input() blocks: UIBlockInstance[] = [];
  @Input() selectedInstanceId?: string;

  @Output() instanceAdded = new EventEmitter<UIBlockInstance>();
  @Output() instanceUpdated = new EventEmitter<string>();
  @Output() instanceRemoved = new EventEmitter<string>();
  @Output() instanceSelected = new EventEmitter<string>();

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
    this.instanceRemoved.emit(instanceId)
  }
  trackByInstanceId(index: number, instance: UIBlockInstance): string {
    return instance.id;
  }
}

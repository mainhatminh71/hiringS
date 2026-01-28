import { Component } from '@angular/core';
import {ComponentPaletteComponent} from '../../../lib/components/form-builders/component-palette/component-palette.component';
import {FormCanvasComponent} from '../../../lib/components/form-builders/form-canvas/form-canvas.component';
import { UIBlockInstance } from '../../../lib/core/models/ui-block-instance.model';
@Component({
  selector: 'app-form-generation',
  imports: [ComponentPaletteComponent, FormCanvasComponent],
  templateUrl: './form-generation.component.html',
  styleUrl: './form-generation.component.scss',
  standalone: true
})
export class FormGenerationComponent {
  instances: UIBlockInstance[] = [];
  selectedInstanceId?: string;

  onInstanceAdded(instance: UIBlockInstance) {
    this.instances = [...this.instances, instance];
  }
  onInstanceSelected(id: string) {
    this.selectedInstanceId = id;
  }
  onInstanceRemoved(id: string) {
    this.instances = this.instances.filter(instance => instance.id !== id);
    if (this.selectedInstanceId === id) {
      this.selectedInstanceId = undefined;
    }
  }
}

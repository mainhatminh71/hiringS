import { Component, inject } from '@angular/core';
import {ComponentPaletteComponent} from '../../../lib/components/form-builders/component-palette/component-palette.component';
import {FormCanvasComponent} from '../../../lib/components/form-builders/form-canvas/form-canvas.component';
import { UIBlockInstance } from '../../../lib/core/models/ui-block-instance.model';
import { ThemeService } from '../../../lib/core/services/theme.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-generation',
  imports: [ComponentPaletteComponent, FormCanvasComponent, CommonModule],
  templateUrl: './form-generation.component.html',
  styleUrl: './form-generation.component.scss',
  standalone: true
})
export class FormGenerationComponent {
  selectedInstanceId?: string;
  selectedInstance?: UIBlockInstance;
  instances: UIBlockInstance[] = [];
  themeService = inject(ThemeService);
  onInstanceAdded(instance: UIBlockInstance) {
    this.instances = [...this.instances, instance];
  }
  onInstanceSelected(id: string) {
    this.selectedInstanceId = id;
    this.selectedInstance = this.instances.find(instance => instance.id === id);
  }
  onInstanceRemoved(id: string) {
    this.instances = this.instances.filter(instance => instance.id !== id);
    if (this.selectedInstanceId === id) {
      this.selectedInstanceId = undefined;
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
}

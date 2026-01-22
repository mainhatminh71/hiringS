import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormConfig, FormField } from '../../core/models/form-config.model';
import { LogoComponent } from '../logo/logo.component';
import { DecorativeShapesComponent } from '../decorative-shapes/decorative-shapes.component';
@Component({
  selector: 'app-entry-form',
  imports: [CommonModule, FormsModule, LogoComponent, DecorativeShapesComponent ],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.scss',
  standalone: true
})
export class EntryFormComponent  {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showLogo = true;
  @Input() maxWidth = 'max-w-xl';
  @Input() cardClasses = 'bg-white shadow-lg';
  @Input() containerClasses = 'min-h-screen bg-amber-50';
  @Input() formConfig?: FormConfig;
}

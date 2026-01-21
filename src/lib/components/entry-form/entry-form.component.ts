import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormConfig, FormField } from '../../core/models/form-config.model';

@Component({
  selector: 'app-entry-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.scss',
  standalone: true
})
export class EntryFormComponent  {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showLogo = true;
  @Input() maxWidth = 'max-w-md';
  @Input() cardClasses = 'bg-white/95 backdrop-blur-sm shadow-xl border border-white/10';
  @Input() containerClasses = 'min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500';
  @Input() formConfig?: FormConfig;
}

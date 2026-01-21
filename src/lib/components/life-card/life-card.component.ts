import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';
import { LifeCard } from '../../core/models/life-card.model';


@Component({
  selector: 'app-life-card',
  imports: [CommonModule],
  templateUrl: './life-card.component.html',
  styleUrl: './life-card.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class LifeCardComponent {
  @Input() lifeAtMicrosoft!: LifeCard[];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';

export interface LifeCard {
  emoji: string,
  title: string,
  description: string
}

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

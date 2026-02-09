import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OnDestroy, AfterViewInit } from '@angular/core';
import { LenisService } from '../lib/core/services/lenis.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'hiringS';
  private router = inject(Router);
  private lenisService = inject(LenisService);

  ngOnInit(): void {
    this.lenisService.init();
  }
  ngOnDestroy(): void {
    this.lenisService.destroy();
  }
}

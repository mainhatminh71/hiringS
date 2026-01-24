import { Component } from '@angular/core';
import { MainLayoutComponent } from '../lib/layouts/main-layout/main-layout.component';
import {OnInit} from '@angular/core';
import { AuthService } from '../lib/core/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'hiringS';
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.handleRedirectResult().subscribe({
      next: (result) => {
        if (result)
        this.router.navigate(['/']);
      }
    })
  }
}

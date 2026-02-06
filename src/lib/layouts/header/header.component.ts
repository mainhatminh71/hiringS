import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LogoComponent } from '../../components/logo/logo.component';
import { RouterLink } from '@angular/router';
import {ApplicationSelectionComponent} from '../../../app/pages/application-selection/application-selection.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, NzIconModule, NzInputModule, LogoComponent, ApplicationSelectionComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  animateIn = false;

  ngOnInit(): void {
    if (this.isBrowser) {
      // Sử dụng requestAnimationFrame để đảm bảo DOM đã render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.animateIn = true;
        });
      });
    } else {
      this.animateIn = true;
    }
  }
}

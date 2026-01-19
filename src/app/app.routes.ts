import { Routes } from '@angular/router';
import { CareersComponent } from './pages/careers/careers.component';
import { MainLayoutComponent } from '../lib/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/careers', pathMatch: 'full' },
  { path: 'careers', component: CareersComponent }
];

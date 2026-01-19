import { Routes } from '@angular/router';
import { CareersComponent } from './pages/careers.component';

export const routes: Routes = [
  { path: '', redirectTo: '/careers', pathMatch: 'full' },
  { path: 'careers', component: CareersComponent },
];

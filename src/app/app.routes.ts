import { Routes } from '@angular/router';
import { CareersComponent } from './pages/careers/careers.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

export const routes: Routes = [
  { path: '', redirectTo: '/careers', pathMatch: 'full' },
  { path: 'careers', component: CareersComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent}
];

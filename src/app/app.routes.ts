import { Routes } from '@angular/router';
import { CareersComponent } from './pages/careers/careers.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { formConfigResolver } from '../lib/core/resolver/form-config.resolver';
import { ApplicationSelectionComponent } from './pages/application-selection/application-selection.component';
import { FormGenerationComponent } from './pages/form-generation/form-generation.component';
export const routes: Routes = [
  { path: '', redirectTo: '/careers', pathMatch: 'full' },
  { path: 'careers', component: CareersComponent },
  { path: 'sign-in', 
    component: SignInComponent,
  resolve: { formConfig: formConfigResolver } ,
  data: { formType: 'signIn' }},
  { path: 'sign-up', component: SignUpComponent,
  resolve: { formConfig: formConfigResolver } ,
  data: { formType: 'signUp' }},
  {path: 'application-selection', component: ApplicationSelectionComponent,},
  {path: 'form-generation', component: FormGenerationComponent,},
];

import { Routes } from '@angular/router';
import { CareersComponent } from './pages/careers/careers.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { formConfigResolver } from '../lib/core/resolver/form-config.resolver';
import { ApplicationSelectionComponent } from './pages/application-selection/application-selection.component';
import {ComponentPaletteComponent} from '../lib/components/form-builders/component-palette/component-palette.component';
import {FormCanvasComponent} from '../lib/components/form-builders/form-canvas/form-canvas.component';
import { FormGenerationComponent } from './pages/form-generation/form-generation.component';
import { EmptyLayoutComponent } from '../lib/layouts/empty-layout/empty-layout.component';
import { MainLayoutComponent } from '../lib/layouts/main-layout/main-layout.component';
import { ApplicationFormComponent } from './pages/application-form/application-form.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/careers', pathMatch: 'full' },
      { path: 'careers', component: CareersComponent },
      { path: 'sign-in', 
        component: SignInComponent,
        resolve: { formConfig: formConfigResolver },
        data: { formType: 'signIn' }
      },
      { path: 'sign-up', 
        component: SignUpComponent,
        resolve: { formConfig: formConfigResolver },
        data: { formType: 'signUp' }
      },
      { path: 'application-selection', component: ApplicationSelectionComponent },
      { path: 'component-palette', component: ComponentPaletteComponent },
      { path: 'form-canvas', component: FormCanvasComponent },
      { path: 'application/:id', component: ApplicationFormComponent },
    ]
  },
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {path: 'form-generation', component: FormGenerationComponent},
      {path: 'form-generation/:id', component: FormGenerationComponent},
    ]
  },
];

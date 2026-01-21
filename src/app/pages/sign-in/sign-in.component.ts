import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryFormComponent } from '../../../lib/components/entry-form/entry-form.component';
import { CustomerConfig } from '../../../lib/core/models/customer-config.model';
import { FormConfig } from '../../../lib/core/models/form-config.model';
import { Observable, Subscription, of } from 'rxjs';
import { filter, map, catchError, tap, switchMap, shareReplay } from 'rxjs/operators';
import { transformToFormConfig } from '../../../lib/core/helpers/form-config-transformer';
import { FirebaseApiService } from '../../../lib/core/services/firebase-api.service';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../lib/components/input/input.component';
import {socialButton} from '../../../lib/core/helpers/form-helpers';
import { environment } from '../../../environments/environment';
import { testCustomerId } from '../../../environments/environment';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzIconConfig } from '../../../lib/core/models/button-config.model';
@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, EntryFormComponent, FormsModule, InputComponent, NzIconModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true
})
export class SignInComponent implements OnInit, OnDestroy {
  private firebaseApi = inject(FirebaseApiService);
  private testSubscription?: Subscription;
  private formConfigSubscription?: Subscription;
  formData: Record<string, any> = {};
  config: FormConfig | null = null;

  ngOnInit() {
    this.formConfigSubscription = this.formConfig$.subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy() {
    if (this.testSubscription) {
      this.testSubscription.unsubscribe();
    }
    if (this.formConfigSubscription) {
      this.formConfigSubscription.unsubscribe();
    }
  }

  onFieldValueChange(fieldId: string, value: any) {
    this.formData[fieldId] = value;
  }

  formConfig$: Observable<FormConfig> = this.firebaseApi.signIn(environment.firebase.firebaseEmail, environment.firebase.firebasePassword).pipe(
    switchMap(({ idToken }) =>
      this.firebaseApi.getCustomerConfigById(testCustomerId, idToken)
    ),
    filter((config): config is CustomerConfig => config !== null),
    map(config => transformToFormConfig(config, 'signIn', {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      submitLabel: 'Sign In'
    })),
    catchError(error => {
      console.error('Error loading form config:', error);
      return of({
        id: 'fallback-signin',
        title: 'Welcome Back',
        subtitle: 'Sign in to your account',
        maxWidth: 'max-w-md',
        fields: [],
        socialButtons: [],
        submitLabel: 'Sign In'
      } as FormConfig);
    }),
    shareReplay(1)
  );
  
  isIconObject(icon: NzIconConfig | string | undefined): icon is NzIconConfig {
    return typeof icon === 'object' && icon !== null && 'nzType' in icon;
  }
}

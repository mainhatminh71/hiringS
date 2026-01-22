import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { FirebaseApiService } from '../../../lib/core/services/firebase-api.service';
import { transformToFormConfig } from '../../../lib/core/helpers/form-config-transformer';
import { FormConfig } from '../../../lib/core/models/form-config.model';
import { environment } from '../../../environments/environment';
import { testCustomerId } from '../../../environments/environment';
import { switchMap, filter, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


export const formConfigResolver: ResolveFn<FormConfig | null> = (route: ActivatedRouteSnapshot) => {
  const firebaseApi = inject(FirebaseApiService);
  
  const formType = (route.data['formType'] || 'signIn') as 'signIn' | 'signUp';
  
  const defaultOptions = {
    signIn: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      submitLabel: 'Sign In',
      maxWidth: 'max-w-lg' as const
    },
    signUp: {
      title: 'Create an Account',
      subtitle: 'Sign up to get started',
      submitLabel: 'Sign Up',
      maxWidth: 'max-w-lg' as const
    }
  };

  const options = defaultOptions[formType];

  return firebaseApi.signIn(environment.firebase.firebaseEmail, environment.firebase.firebasePassword).pipe(
    switchMap(({ idToken }) =>
      firebaseApi.getCustomerConfigById(testCustomerId, idToken)
    ),
    filter((config): config is any => config !== null),
    map(config => transformToFormConfig(config, formType, options)),
    catchError(error => {
      console.error(`Error loading ${formType} form config:`, error);
      return of(null);
    })
  );
};
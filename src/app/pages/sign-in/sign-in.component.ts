import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryFormComponent } from '../../../lib/components/entry-form/entry-form.component';
import { FormConfig } from '../../../lib/core/models/form-config.model';
import { Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../lib/components/input/input.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzIconConfig } from '../../../lib/core/models/button-config.model';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ButtonConfig } from '../../../lib/core/models/button-config.model';
import { AuthProvider } from '../../../lib/core/models/user.model';
import { AuthService } from '../../../lib/core/services/auth.service';


@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, EntryFormComponent, FormsModule, InputComponent, NzIconModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  standalone: true
})
export class SignInComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formConfigSubscription?: Subscription;


  formData: Record<string, any> = {};
  formErrors: Record<string, string> = {};
  config: FormConfig | null = null;
  rememberMe: boolean = false;
  isSubmitting: boolean = false;

  ngOnInit() {
    this.formConfigSubscription = this.formConfig$.subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy() {
    if (this.formConfigSubscription) {
      this.formConfigSubscription.unsubscribe();
    }
  }

  onFieldValueChange(fieldId: string, value: any) {
    this.formData[fieldId] = value;
    if (this.formErrors[fieldId]) {
      delete this.formErrors[fieldId];
    }
  }

  validateForm() : boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.formData['email']) {
      this.formErrors['email'] = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.formData['email'])) {
      this.formErrors['email'] = 'Invalid email address';
      isValid = false;
    }

    if (!this.formData['password']) {
      this.formErrors['password'] = 'Password is required';
      isValid = false;
    } else if (this.formData['password'].length < 8) {
      this.formErrors['password'] = 'Password must be at least 8 characters long';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string) : boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getFieldError(fieldId: string) : string {
    return this.formErrors[fieldId] || '';
  }

  formConfig$: Observable<FormConfig> = this.route.data.pipe(
    map(data => data['formConfig']),
    filter((config): config is FormConfig => config !== null),
    shareReplay(1)
  );
  
  isIconObject(icon: NzIconConfig | string | undefined): icon is NzIconConfig {
    return typeof icon === 'object' && icon !== null && 'nzType' in icon;
  }

  getButtonLabel(button: ButtonConfig): string {
    if (button.label) {
      return button.label.replace(/^Continue with\s+/i, '');
    }
    
    // Map of provider names to display labels
    const providerLabels: Record<string, string> = {
      'google': 'Google',
      'facebook': 'Facebook',
      'github': 'GitHub',
      'twitter': 'Twitter',
      'linkedin': 'LinkedIn',
      'microsoft': 'Microsoft',
      'apple': 'Apple',
      'amazon': 'Amazon',
      'gitlab': 'GitLab',
      'bitbucket': 'Bitbucket',
      'slack': 'Slack',
      'twitch': 'Twitch',
      'youtube': 'YouTube',
      'discord': 'Discord',
      'spotify': 'Spotify',
      'tiktok': 'TikTok',
      'pinterest': 'Pinterest',
      'reddit': 'Reddit',
      'instagram': 'Instagram'
    };
    
    return providerLabels[button.provider] || button.provider.charAt(0).toUpperCase() + button.provider.slice(1);
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const email = this.formData['email'];
    const password = this.formData['password'];
  
    if (email && password) {
      this.isSubmitting = true;
      this.authService.signIn(email, password).subscribe({
        next: ({ token, user }) => {
          console.log('Token:', token);
          console.log('User:', user);
          this.isSubmitting = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Sign in error:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
  
  onSocialButtonClick(provider: string) {
    this.isSubmitting = true;
    this.authService.signInWithProvider(
      provider as AuthProvider
    ).subscribe({
      next: ({ token, user }) => {
        console.log('Token:', token);
        console.log('User:', user);
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Social sign in error:', err);
        this.isSubmitting = false;
      }
    });
  }
}

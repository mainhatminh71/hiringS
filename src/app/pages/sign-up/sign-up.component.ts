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
  selector: 'app-sign-up',
  imports: [CommonModule, EntryFormComponent, FormsModule, InputComponent, NzIconModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: true
})
export class SignUpComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private formConfigSubscription?: Subscription;
  formData: Record<string, any> = {};
  config: FormConfig | null = null;

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
    // If custom label is provided, use it (but remove "Continue with" prefix if present)
    if (button.label) {
      return button.label.replace(/^Continue with\s+/i, '');
    }
    
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
    const email = this.formData['email'];
    const password = this.formData['password'];
  
    if (email && password) {
      const userData: Record<string, any> = {};
      Object.keys(this.formData).forEach(key => {
        if (key !== 'email' && key !== 'password') {
          userData[key] = this.formData[key];
        }
      });
      
      this.authService.signUp(email, password, userData, this.config?.id).subscribe({
        next: ({ token, user }) => {
          console.log('Token:', token);
          console.log('User:', user);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Sign up error:', err)
      });
    }
  }
  
  onSocialButtonClick(provider: string) {
    const userData: Record<string, any> = {};
    Object.keys(this.formData).forEach(key => {
      if (key !== 'email' && key !== 'password') {
        userData[key] = this.formData[key];
      }
    });
  
    this.authService.signUpWithProvider(
      provider as AuthProvider, 
      Object.keys(userData).length > 0 ? userData : undefined, 
      this.config?.id
    ).subscribe({
      next: ({ token, user }) => {
        console.log('Token:', token);
        console.log('User:', user);
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Social sign up error:', err)
    });
  }
}

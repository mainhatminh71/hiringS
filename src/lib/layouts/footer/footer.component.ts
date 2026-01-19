import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface FooterLink {
  label: string;
  url: string;
}

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzLayoutModule,
    NzSpaceModule,
    NzSelectModule,
    NzTypographyModule,
    NzToolTipModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true
})
export class FooterComponent {
  selectedLanguage = 'en';

  footerLinks: FooterLink[] = [
    { label: 'Support', url: '/support' },
    { label: 'Accessibility', url: '/accessibility' },
    { label: 'Data Privacy Notice', url: '/privacy-notice' },
    { label: 'Transparency FAQ', url: '/transparency' },
    { label: 'Legal policies', url: '/legal' },
    { label: 'Contractor roles', url: '/contractors' }
  ];

  socialLinks: SocialLink[] = [
    { label: 'LinkedIn', url: 'https://linkedin.com/company/hirings', icon: 'linkedin' },
    { label: 'Instagram', url: 'https://instagram.com/hirings', icon: 'instagram' },
    { label: 'Twitter', url: 'https://twitter.com/hirings', icon: 'twitter' }
  ];

  legalLinks: FooterLink[] = [
    { label: 'Your Privacy Choices', url: '/privacy-choices' },
    { label: 'Privacy', url: '/privacy' },
    { label: 'Trademarks', url: '/trademarks' },
    { label: 'Terms of use', url: '/terms' }
  ];

  onLanguageChange(value: string): void {
    this.selectedLanguage = value;
    console.log('Language changed to:', value);
  }
}

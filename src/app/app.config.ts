import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { PlusOutline, DollarOutline, UsergroupAddOutline, GlobalOutline, BulbOutline } from '@ant-design/icons-angular/icons';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp, getApps } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { SEOService } from '../lib/core/services/seo.service';

  
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideNzIcons([PlusOutline, DollarOutline, UsergroupAddOutline, GlobalOutline, BulbOutline]),
    provideHttpClient(), 
    {
      provide: SEOService,
      useClass: SEOService
    },
    provideFirebaseApp(() => {
      const apps = getApps();
      if (apps.length === 0) {
        return initializeApp(environment.firebase);
      }
      return apps[0];
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    
    ScreenTrackingService,
    UserTrackingService,
  ]
};

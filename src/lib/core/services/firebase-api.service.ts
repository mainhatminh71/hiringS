import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { 
  Auth, 
  getRedirectResult
} from '@angular/fire/auth';
import { Observable, from, throwError, of } from 'rxjs';
import { switchMap, map, catchError, shareReplay, tap } from 'rxjs/operators';
import { AuthProvider, AuthResponse } from '../models/user.model';
import { User } from '../classes/user.class';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CustomerConfig } from '../models/customer-config.model';

  export interface FireStoreDocument {
    name: string;
    fields: any;
    createTime?: string;
    updateTime?: string;
  }

  export interface FireStoreListResponse {
    documents: FireStoreDocument[];
    nextPageToken?: string;
  }
@Injectable({
    providedIn: 'root'
})


export class FirebaseApiService {
    private http = inject(HttpClient);
    private auth = inject(Auth);
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);
    private apiKey = environment.firebase.apiKey || 'FIREBASE_API_KEY';
    private projectId = environment.firebase.projectId;





handleRedirectResult(userData?: Record<string, any>, customerConfigId?: string): Observable<AuthResponse | null> {
    if (!this.isBrowser) {
      return of(null);
    }

    return from(getRedirectResult(this.auth)).pipe(
      switchMap((credential) => {
        if (!credential) {
          return of(null);
        }
        
        const providers = this.getProvidersWithIds(credential.user);
        const user = new User(
          credential.user.uid, 
          credential.user.email || '', 
          providers, 
          customerConfigId, 
          userData
        );
        
        return this.saveUser(user).pipe(
          switchMap(() => from(credential.user.getIdToken())),
          map(token => ({ token, user }))
        );
      }),
      catchError(err => {
        // Ignore operation-not-supported-in-this-environment error (SSR)
        if (err.code === 'auth/operation-not-supported-in-this-environment') {
          return of(null);
        }
        console.error('Redirect result error:', err);
        return of(null);
      })
    );
  }


    private getProvidersWithIds(firebaseUser: any): Partial<Record<AuthProvider, string>> {
        const providers: Partial<Record<AuthProvider, string>> = {};
        
        firebaseUser.providerData.forEach((p: any) => {
            const providerId = p.providerId.split('.')[0];
            const providerName = providerId === 'password' ? 'password' : providerId as AuthProvider;
            
            // Với password, dùng Firebase UID làm provider ID
            // Với OAuth providers, dùng providerData.uid (đây chính là provider ID)
            if (providerName === 'password') {
                providers[providerName] = firebaseUser.uid; 
            } else {
                providers[providerName] = p.uid;
            }
        });
        
        return providers;
    }


}

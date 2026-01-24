import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, linkWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, OAuthProvider, GithubAuthProvider, getRedirectResult } from '@angular/fire/auth';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthProvider, AuthResponse } from '../models/user.model';
import { User } from '../classes/user.class';
import { FirebaseApiService } from './firebase-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firebaseApi = inject(FirebaseApiService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private getProvider(providerName: AuthProvider) {
    const map: Record<AuthProvider, any> = {
      google: () => new GoogleAuthProvider(),
      facebook: () => new FacebookAuthProvider(),
      twitter: () => new TwitterAuthProvider(),
      microsoft: () => {
        const p = new OAuthProvider('microsoft.com');
        p.setCustomParameters({ tenant: 'common' });
        return p;
      },
      github: () => new GithubAuthProvider(),
      password: null
    };
    return map[providerName]?.();
  }

  signUp(email: string, password: string, userData: Record<string, any>, customerConfigId?: string): Observable<AuthResponse> {
    if (!this.isBrowser) {
      return throwError(() => new Error('Authentication chỉ có thể thực hiện trên browser'));
    }

    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => {
        const providers: Partial<Record<AuthProvider, string>> = {
          password: credential.user.uid
        };
        const user = new User(credential.user.uid, email, providers, customerConfigId, userData);
        return this.firebaseApi.saveUser(user).pipe(
          switchMap(() => credential.user.getIdToken()),
          map(token => ({ token, user }))
        );
      }),
      catchError(err => throwError(() => this.handleError(err)))
    );
  }

  signIn(email: string, password: string): Observable<AuthResponse> {
    if (!this.isBrowser) {
      return throwError(() => new Error('Authentication chỉ có thể thực hiện trên browser'));
    }

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => {
        const providers = this.getProvidersWithIds(credential.user);
        const user = new User(credential.user.uid, credential.user.email!, providers);
        return from(credential.user.getIdToken()).pipe(
          map(token => ({ token, user }))
        );
      }),
      catchError(err => throwError(() => this.handleError(err)))
    );
  }

  signInWithProvider(providerName: AuthProvider): Observable<AuthResponse> {
    if (!this.isBrowser) {
      return throwError(() => new Error('Authentication chỉ có thể thực hiện trên browser'));
    }

    const provider = this.getProvider(providerName);
    if (!provider) {
      return throwError(() => new Error(`Provider ${providerName} not supported`));
    }
  
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credential) => {
        const providers = this.getProvidersWithIds(credential.user);
        const user = new User(credential.user.uid, credential.user.email || '', providers);
        return from(credential.user.getIdToken()).pipe(
          map(token => ({ token, user }))
        );
      }),
      catchError(err => throwError(() => this.handleError(err)))
    );
  }
  
  signUpWithProvider(providerName: AuthProvider, userData?: Record<string, any>, customerConfigId?: string): Observable<AuthResponse> {
    if (!this.isBrowser) {
      return throwError(() => new Error('Authentication chỉ có thể thực hiện trên browser'));
    }

    const provider = this.getProvider(providerName);
    if (!provider) {
      return throwError(() => new Error(`Provider ${providerName} not supported`));
    }
  
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((credential) => {
        const providers = this.getProvidersWithIds(credential.user);
        const user = new User(credential.user.uid, credential.user.email || '', providers, customerConfigId, userData);
        
        return this.firebaseApi.saveUser(user).pipe(
          switchMap(() => credential.user.getIdToken()),
          map(token => ({ token, user }))
        );
      }),
      catchError(err => throwError(() => this.handleError(err)))
    );
  }
  handleRedirectResult(userData?: Record<string, any>, customerConfigId?: string): Observable<AuthResponse | null> {
    // Chỉ chạy trên browser, không chạy trên server-side
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
        
        return this.firebaseApi.saveUser(user).pipe(
          switchMap(() => credential.user.getIdToken()),
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

  linkProvider(providerName: AuthProvider): Observable<User> {
    if (!this.isBrowser) {
      return throwError(() => new Error('Authentication chỉ có thể thực hiện trên browser'));
    }

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('No user signed in'));
    }

    const provider = this.getProvider(providerName);
    if (!provider) {
      return throwError(() => new Error(`Provider ${providerName} not supported`));
    }

    return from(linkWithPopup(currentUser, provider)).pipe(
      switchMap((credential) => {
        const providers = this.getProvidersWithIds(credential.user);
        const user = new User(currentUser.uid, currentUser.email || '', providers);
        return this.firebaseApi.saveUser(user).pipe(map(() => user));
      }),
      catchError(err => throwError(() => this.handleError(err)))
    );
  }

  private getProvidersWithIds(firebaseUser: any): Partial<Record<AuthProvider, string>> {
    const providers: Partial<Record<AuthProvider, string>> = {};
    
    firebaseUser.providerData.forEach((p: any) => {
      const providerId = p.providerId.split('.')[0];
      const providerName = providerId === 'password' ? 'password' : providerId as AuthProvider;
      
      
      if (providerName === 'password') {
        providers[providerName] = firebaseUser.uid; 
      } else {
        providers[providerName] = p.uid;
      }
    });
    
    return providers;
  }

  private handleError(error: any): Error {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Email đã được sử dụng',
      'auth/invalid-email': 'Email không hợp lệ',
      'auth/weak-password': 'Mật khẩu quá yếu',
      'auth/user-not-found': 'Không tìm thấy tài khoản',
      'auth/wrong-password': 'Sai mật khẩu',
      'auth/popup-closed-by-user': 'Đã đóng cửa sổ đăng nhập'
    };
    return new Error(messages[error.code] || error.message || 'Lỗi xác thực');
  }
}
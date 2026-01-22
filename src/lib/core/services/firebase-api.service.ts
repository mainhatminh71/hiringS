import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CustomerConfig } from '../models/customer-config.model';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { from } from 'rxjs';
import {QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import {shareReplay} from 'rxjs/operators';

export interface SignInRequest {
    email: string;
    password: string;
    returnSecureToken: boolean;
  }

  export interface SignInResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
  }

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
    private apiKey = environment.firebase.apiKey || 'FIREBASE_API_KEY';
    private projectId = environment.firebase.projectId;

    private cachedToken$?: Observable<{ idToken: string; expiresIn: string }>;
    private cachedConfigs = new Map<string, Observable<CustomerConfig | null>>();


    signIn(email: string, password: string): Observable<{ idToken: string; expiresIn: string }> {
      if (!this.cachedToken$) {
          const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
          const headers = new HttpHeaders({
              'Content-Type': 'application/json'
          });
          const requestBody: SignInRequest = {
              email,
              password,
              returnSecureToken: true
          };

          this.cachedToken$ = this.http.post<SignInResponse>(url, requestBody, { headers }).pipe(
              map(response => ({
                  idToken: response.idToken,
                  expiresIn: response.expiresIn
              })),            
              catchError(error => {
                  // Clear cache on error
                  this.cachedToken$ = undefined;
                  const errorCode = error.error?.error?.message;
                  if (errorCode?.includes('TOO_MANY_ATTEMPTS_TRY_LATER') || errorCode?.includes('TOO_MANY_REQUESTS')) {
                      console.error('❌ Too many requests. Please try again later.');
                      return throwError(() => new Error('Too many sign-in attempts. Please wait a few minutes before trying again.'));
                  }
                  if (errorCode?.includes('INVALID_PASSWORD') || errorCode?.includes('EMAIL_NOT_FOUND') || errorCode?.includes('INVALID_EMAIL')) {
                      console.error('❌ Invalid credentials');
                      return throwError(() => new Error('Invalid email or password.'));
                  }
                  console.error('❌ Sign-in error:', error);
                  return throwError(() => error);
              }),
              shareReplay(1) // Cache và share token
          );
      }
      return this.cachedToken$;
  }


  getCustomerConfigById(configId: string, idToken: string): Observable<CustomerConfig | null> {
    // Cache config để không phải fetch lại
    if (!this.cachedConfigs.has(configId)) {
        console.log('🔍 Requesting config with ID:', configId);
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:runQuery`;
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        });
        const requestBody = {
            structuredQuery: {
                from: [{ collectionId: 'customer-form-config' }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: 'id' },
                        op: 'EQUAL',
                        value: { stringValue: configId }
                    }
                },
                limit: 1
            }
        };

        const config$ = this.http.post<any>(url, requestBody, { headers }).pipe(
            map(response => {
                if (!response || !response.length || !response[0].document) {
                    console.warn(`⚠️ Customer config with id "${configId}" not found`);
                    return null;
                }
                return this.convertFirestoreRestDocumentToCustomerConfig(response[0].document);
            }),
            tap(config => {
                if (config) {
                    console.log(`✅ Loaded config "${configId}"`, config);
                }
            }),
            catchError(err => {
                // Clear cache on error
                this.cachedConfigs.delete(configId);
                console.error('❌ Failed to load config:', err);
                return throwError(() => err);
            }),
            shareReplay(1) // Cache config
        );
        
        this.cachedConfigs.set(configId, config$);
    }
    
    return this.cachedConfigs.get(configId)!;
}




    private convertFirestoreRestDocumentToCustomerConfig(document: any): CustomerConfig {
        const fields = document.fields || {};

        const getFieldValue = (field: any): any => {
            if (!field) return null;
            if (field.stringValue !== undefined) return field.stringValue;
            if (field.integerValue !== undefined) return parseInt(field.integerValue);
            if (field.booleanValue !== undefined) return field.booleanValue;
            if (field.doubleValue !== undefined) return parseFloat(field.doubleValue);
            if (field.arrayValue?.values) {
                return field.arrayValue.values.map((v: any) => getFieldValue(v));
            }

            //Chuyển response sang object CustomerConfig
            if (field.mapValue?.fields) {
                const result: any = {};
                Object.keys(field.mapValue.fields).forEach(key => {
                    result[key] = getFieldValue(field.mapValue.fields[key]);
                });
                return result;
            }
            return null;
        };



        const signInData = getFieldValue(fields['signIn']);
        const signUpData = getFieldValue(fields['signUp']);

        return {
            id: getFieldValue(fields['id']) || '',
            signIn: {
                fields: signInData?.fields || [],
                socialButtons: signInData?.socialButtons || []
            },
            signUp: {
                fields: signUpData?.fields || [],
                socialButtons: signUpData?.socialButtons || [],
                gridLayout: signUpData?.gridLayout || false,
                passwordMatch: signUpData?.passwordMatch || false
            }
        };
    }



}

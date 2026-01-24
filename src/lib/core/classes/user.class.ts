import {IUser, AuthProvider} from '../models/user.model';

export class User implements IUser {
    id?: string;
    email: string;
    providers: Partial<Record<AuthProvider, string>>;
    customerConfigId?: string;
    [key: string]: any;

      constructor(
        id?: string, 
        email: string = '', 
        providers: Partial<Record<AuthProvider, string>> = {},
        customerConfigId?: string,
        data?: Record<string, any>
      ) {
        this['id'] = id;
        this['email'] = email;
        this['providers'] = providers;
        this['customerConfigId'] = customerConfigId;
        if (data) {
          Object.assign(this, data);
        }
      }
      addProvider(provider: AuthProvider, providerId: string): void {
        this['providers'][provider] = providerId;
      }

      getProviderIds(): string[] {
        return Object.values(this['providers']);
      }

      getProviderNames(): AuthProvider[] {
        return Object.keys(this['providers']) as AuthProvider[];
      }

      getProviderId(provider: AuthProvider): string | undefined {
        return this['providers'][provider];
      }

      toFirestore(): { fields: Record<string, any> } {
        const fields: Record<string, any> = {};
        const email = this['email'];
        const providers = this['providers'];
        const customerConfigId = this['customerConfigId'];
        
        if (email) fields['email'] = { stringValue: email };
        
        // Lưu providers dưới dạng map trong Firestore
        if (providers && Object.keys(providers).length > 0) {
          const providerMap: Record<string, any> = {};
          Object.entries(providers).forEach(([provider, providerId]) => {
            providerMap[provider] = { stringValue: providerId };
          });
          fields['providers'] = {
            mapValue: { fields: providerMap }
          };
        }
        
        if (customerConfigId) {
          fields['customerConfigId'] = { stringValue: customerConfigId };
        }
        
        Object.keys(this).forEach(key => {
          if (['id', 'email', 'providers', 'customerConfigId'].includes(key)) return;
          const value = this[key];
          if (value !== undefined && value !== null) {
            fields[key] = { stringValue: String(value) };
          }
        });
  
        return { fields };
      }
}
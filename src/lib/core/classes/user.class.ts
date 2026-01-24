import {IUser, AuthProvider} from '../models/user.model';

export class User implements IUser {
    id?: string;
    email: string;
    providers: AuthProvider[];
    customerConfigId?: string;
    [key: string]: any;

      constructor(
        id?: string, 
        email: string = '', 
        providers: AuthProvider[] = ['password'],
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
      addProvider(provider: AuthProvider) : void {
        if (!this['providers'].includes(provider)) {
            this['providers'].push(provider);
        }
      }
      toFirestore(): { fields: Record<string, any> } {
        const fields: Record<string, any> = {};
        const email = this['email'];
        const providers = this['providers'];
        const customerConfigId = this['customerConfigId'];
        
        if (email) fields['email'] = { stringValue: email };
        if (providers?.length > 0) {
          fields['providers'] = {
            arrayValue: { values: providers.map(p => ({ stringValue: p })) }
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
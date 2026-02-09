import { environmentSecret } from './environment.secret';

export const environment = {
    production: false,
    mongodb: {
      connectionString: environmentSecret.mongodb.connectionString
    }
  };
export const testCustomerId = 'tech-v3';

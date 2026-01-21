export interface CustomerConfig {
    id: string;
    signIn: {
      fields: string[];
      socialButtons: string[];
    };
    signUp: {
      fields: string[];
      socialButtons: string[];
      gridLayout?: boolean;
      passwordMatch?: boolean;
    };
  }
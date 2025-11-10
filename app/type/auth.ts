export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refreshtoken: string;
  data: User;
}

export interface User {
  id: string;
  aud: string; 
  role: string; 
  email: string;
  email_confirmed_at: string | null; 
  phone: string | null;
  confirmation_sent_at: string | null; 
  confirmed_at: string | null; 
  last_sign_in_at: string | null; 
  app_metadata: {
    provider: string; 
    providers: string[]; 
  };
}

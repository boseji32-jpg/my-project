// Patient type definition
export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // Format: YYYY-MM-DD
  gender: string;
  email: string;
  phone: string;
  address: string;
  medical_history?: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  owner_id: number;
}

// User type definition
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string; // ISO date string
}

// Form types
export interface PatientFormValues {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  medical_history?: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface SignupFormValues {
  username: string;
  email: string;
  password: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface TokenPayload {
  sub: string; // username
  exp: number; // expiration timestamp
}
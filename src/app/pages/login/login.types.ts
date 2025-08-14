// Login ekranı tipleri ve sabitler

export interface UserLoginModel {
  userName: string;   // formdaki "username" alanını service tarafında userName'e map edeceğiz
  password: string;
}

export interface SignInSuccess {
  success: true;
  token: string;      // JWT benzeri string
  message?: string;
}

export interface SignInError {
  success: false;
  message: string;
}

export type SignInResult = SignInSuccess | SignInError;

// LocalStorage anahtarı
export const USER_INFO_KEY = 'user_info';

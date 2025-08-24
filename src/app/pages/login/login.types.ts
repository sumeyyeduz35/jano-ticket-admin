// Bu dosya, Login ekranı için kullanılan tipleri ve sabitleri içerir.

export interface UserLoginModel {
  userName: string;   // formdaki "username" alanı
  password: string;   //kullanıcı sifresi
}

//başarılı giriş sonucu
export interface SignInSuccess {
  success: true;      //giris başarılı
  token: string;      // JWT benzeri string
  message?: string;   //bilgi mesajı
}

//başarısız giriş sonucu
export interface SignInError {
  success: false;   //giris başarısız
  message: string;  //hata mesajı
}

export type SignInResult = SignInSuccess | SignInError;
// LocalStorage anahtarı
export const USER_INFO_KEY = 'user_info';

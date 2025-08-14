import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SignInResult, UserLoginModel, USER_INFO_KEY } from '../pages/login/login.types';

@Injectable({ providedIn: 'root' })
export class LoginService {

  /**
   * Simüle giriş:
   * - userName === 'admin' && password === '12345' → success + fake JWT üret, localStorage'a yaz
   * - Aksi → { success:false, message:'Kullanıcı bulunamadı' }
   */
  signIn(model: UserLoginModel): Observable<SignInResult> {
    const { userName, password } = model;

    // Basit doğrulama
    if (!userName?.trim() || !password?.trim()) {
      return of<SignInResult>({ success: false, message: 'Kullanıcı bulunamadı' }).pipe(delay(200));
    }

    // Doğru bilgiler
    if (userName === 'admin' && password === '12345') {
      // Demo "JWT benzeri" string (gerçek imza yok)
      // Gerçek JWT için istersen: https://www.javainuse.com/jwtgenerator
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ userName: 'admin', role: 'admin' }));
      const signature = 'demo-signature';
      const fakeJwt = `${header}.${payload}.${signature}`;

      // localStorage'a kaydet
      localStorage.setItem(
        USER_INFO_KEY,
        JSON.stringify({ token: fakeJwt, userName: 'admin', role: 'admin' })
      );

      return of<SignInResult>({ success: true, token: fakeJwt, message: 'Giriş başarılı' }).pipe(delay(400));
    }

    // Yanlış bilgiler
    return of<SignInResult>({ success: false, message: 'Kullanıcı bulunamadı' }).pipe(delay(200));
  }
}

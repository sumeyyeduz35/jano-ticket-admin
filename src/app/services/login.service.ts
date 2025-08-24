// Bu servis, sahte (mock) giriş akışını yönetir: admin/12345 için fake JWT üretir, localStorage’a yazar ve oturumu sonlandırmayı sağlar.
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserLoginModel, SignInResult, USER_INFO_KEY } from '../pages/login/login.types';

//----------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class LoginService {
  // Basit bir fake JWT üretici
  private createFakeJwt(payloadObj: Record<string, unknown>): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const b64url = (obj: unknown) =>
      btoa(JSON.stringify(obj))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const headerPart = b64url(header);
    const payloadPart = b64url(payloadObj);
    const signaturePart = 'fake-signature';
    return `${headerPart}.${payloadPart}.${signaturePart}`;
  }


 //giriş işlemi (admin/12345 doğrulaması) 
  signIn(model: UserLoginModel): Observable<SignInResult> {
    const { userName, password } = model;

    if (!userName || !password) {
      //zorunlu alanlar yoksa hata döndür
      return throwError(() => ({
        success: false,
        message: 'Kullanıcı bulunamadı'
      } as SignInResult));
    }

    if (userName === 'admin' && password === '12345') {
      const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 saatlik süre
      const token = this.createFakeJwt({ userName, role: 'Admin', exp });
      
      //başarılı giriş - token üret, kısa gecikme ver, localStorage'a yaz
      return of({ success: true, token } as SignInResult).pipe(
        delay(300),
        tap((res) => {
          if (res.success) {
            // token + userName + role bilgilerini sakla
            const userInfo = {
              token: res.token,
              userName: model.userName,
              role: 'Admin'
            };
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
          }
        })
      );
    }

    //yanlış kullanıcı adı/sifre
    return throwError(() => ({
      success: false,
      message: 'Kullanıcı bulunamadı'
    } as SignInResult));
  }

  // Token'ı çekmek için yardımcı method
  getToken(): string | null {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed?.token ?? null;
    } catch {
      return null;
    }
  }

  // Çıkış - oturum bilgisini temizle
  signOut(): void {
    localStorage.removeItem(USER_INFO_KEY);
  }
}

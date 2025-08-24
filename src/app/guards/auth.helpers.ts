/**Bu dosya, oturum kontrolü için yardımcı fonksiyonları içerir.
Buradaki hasValidSession() fonksiyonu, localStorage’daki JWT token’ı kontrol ederek
oturumun geçerli olup olmadığını belirler.*/

import { USER_INFO_KEY } from '../pages/login/login.types';


// geçerli bir oturum var mı kontrol eder
export function hasValidSession(): boolean {
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);  //json parse edilir
    const token: string | undefined = parsed?.token;
    if (!token) return false;         //token yoksa oturum geçersiz

    // exp kontrolü (JWT payload decode)
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return false;

    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const payload = JSON.parse(json);

    if (payload?.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        // oturum süresi bitmiş -> temizle
        localStorage.removeItem(USER_INFO_KEY);
        return false;
      }
    }
    return true;  //token geçerli - oturum var
  } catch {
    return false; //parse hatası - oturum geçersiz
  }
}

import { USER_INFO_KEY } from '../pages/login/login.types';

export function hasValidSession(): boolean {
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw);
    const token: string | undefined = parsed?.token;
    if (!token) return false;

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
    return true;
  } catch {
    return false;
  }
}

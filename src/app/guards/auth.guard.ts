//home gibi giriş yapılmış kullanıcı gerektiren sayfalar için

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { USER_INFO_KEY } from '../pages/login/login.types';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const raw = localStorage.getItem(USER_INFO_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token){
        return true;  //giriş yapıldı, erişime izi verir
      }
    } catch {
      //parse hatası, login sayfasına yönlendirir
    }
  }

  //kullanıcı giriş yapmamış, login sayfasına yönlendir
  router.navigateByUrl('/login');  // router ile login sayfasına git
  return false;
};

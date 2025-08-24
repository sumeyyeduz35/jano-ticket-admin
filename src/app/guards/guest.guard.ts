/*Bu dosya, sadece oturum açmamış (misafir) kullanıcıların erişimine izin verir.
Eğer geçerli bir oturum varsa kullanıcıyı otomatik olarak home sayfasına yönlendirir.*/ 

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { hasValidSession } from './auth.helpers';

//-------------------------------------------------------------
//misafir kullanıcılar için guard
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (hasValidSession()) {
    router.navigateByUrl('/home');  //giris yapılmıs - home sayfasına yönlendir
    return false;                   //misafir erisimi engellenir
  }
  return true;                      //geçerli oturum yok - erisime izin ver
};

/* Bu dosya, kullanıcı giriş yapmış mı kontrol eder. 
Eğer geçerli oturum yoksa kullanıcıyı login sayfasına yönlendirir.*/
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { hasValidSession } from './auth.helpers';

//-----------------------------------------------------------------------

//sadece giriş yapmış kullanıcıların erişimine izin veren guard
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);   //yönlendirme servisi alır

  if (hasValidSession()) {
    return true;                  //geçerli oturum varsa erişime izin ver
  }

  router.navigateByUrl('/login'); //oturum yok - login sayfasına yönlendir
  return false;
};

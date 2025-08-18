import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { hasValidSession } from './auth.helpers';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (hasValidSession()) {
    router.navigateByUrl('/home');
    return false;
  }
  return true;
};

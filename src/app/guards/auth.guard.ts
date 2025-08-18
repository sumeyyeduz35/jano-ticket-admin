import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { hasValidSession } from './auth.helpers';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (hasValidSession()) {
    return true;
  }

  router.navigateByUrl('/login');
  return false;
};

import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { USER_INFO_KEY } from "../pages/login/login.types";

export const guestGuard: CanActivateFn = () => {
    
    const router = inject(Router);
    const raw = localStorage.getItem(USER_INFO_KEY);

    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (parsed?.token) {
                router.navigateByUrl('/home'); //giris yapılmış. home alanına yönlendirir.
                return false;
            }
        } catch {
            //parse hatası, giriş yapmamış kabul et
        }
    }

    return true;  //giriş yapmamış, erişim izni

};
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] }, 
  { path: 'home', component: Home, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' },
];

import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { TicketList } from './pages/ticket-list/ticket-list';
import { TicketDetail } from './pages/ticket-detail/ticket-detail';
import { TicketNew } from './pages/ticket-new/ticket-new';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

//---------------------------------------------------------------

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'tickets', component: TicketList, canActivate: [authGuard] },
  { path: 'tickets/new', component: TicketNew, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];

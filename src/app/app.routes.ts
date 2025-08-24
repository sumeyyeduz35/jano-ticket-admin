// Bu dosya, uygulamanın sayfa yönlendirmelerini (router) ve erişim kurallarını tanımlar.
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
  { path: '', pathMatch: 'full', redirectTo: 'login' },                   //bos url - login sayfasına yönlendirme
  { path: 'login', component: Login, canActivate: [guestGuard] },         //sadece msafir kullanıcılar girebilir
  { path: 'register', component: Register, canActivate: [guestGuard] },   //kayıt sayfası(misafirler için)
  { path: 'home', component: Home, canActivate: [authGuard] },            //ana sayfa (giris yapmıs kullanıcılar)
  { path: 'tickets', component: TicketList, canActivate: [authGuard] },   //ticket listesi
  { path: 'tickets/new', component: TicketNew, canActivate: [authGuard] },//yeni ticket oluşturma
  { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard] }, // ticket detay sayfası(ıd ile)
  { path: '**', redirectTo: 'login' },        //tanımsız rota - login sayfasına yönlendirme
];

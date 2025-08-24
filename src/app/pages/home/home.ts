// Bu bileşen, giriş sonrası ana sayfayı yönetir: JWT içinden kullanıcı adını okur ve çıkış işlemini SweetAlert2 ile onaylar.
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { USER_INFO_KEY } from '../login/login.types';

//---------------------------------------------------------------------------------

@Component({
  selector: 'jta-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  userName = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
     // localStorage'dan kullanıcı bilgisi çek ve JWT payload'ından userName'i al
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw);
      if (!stored?.token) return;
      const payload = this.decodeJwtPayload(stored.token);
      if (payload?.userName) this.userName = String(payload.userName);
    } catch {
      /* ignore */
    }
  }

  // Çıkış akışı (onay → temizle → yönlendir → bilgilendir)
  logout(): void {
    Swal.fire({
      title: 'Çıkış yapmak istiyor musun?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, çıkış yap',
      cancelButtonText: 'İptal'
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.removeItem(USER_INFO_KEY);
        this.router.navigateByUrl('/login');
        Swal.fire({ title: 'Çıkış yapıldı', icon: 'success', timer: 1200, showConfirmButton: false });
      }
    });
  }

  private decodeJwtPayload(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}

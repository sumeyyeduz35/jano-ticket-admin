import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { USER_INFO_KEY } from '../login/login.types';

@Component({
  selector: 'jta-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  userName: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem(USER_INFO_KEY);
    if (!raw) return;

    try {
      const stored = JSON.parse(raw);
      const payload = this.decodeJwtPayload(stored.token);
      if (payload?.userName) {
        this.userName = String(payload.userName);
      }
    } catch {
      // ignore
    }
  }

  logout(): void {
    Swal.fire({
      title: 'Çıkış yapmak istediğinize emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, çıkış yap',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(USER_INFO_KEY);
        this.router.navigateByUrl('/login');
        Swal.fire({
          title: 'Çıkış yapıldı',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  private decodeJwtPayload(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonString = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }
}

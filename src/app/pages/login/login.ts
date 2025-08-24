// Bu bileşen, kullanıcı giriş ekranını yönetir: form doğrulama, LoginService üzerinden giriş ve başarılı giriş sonrası yönlendirme.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { UserLoginModel } from './login.types';

//------------------------------------------------------------------------------------

@Component({
  selector: 'jta-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);

  loading = false;

  //form tanımı
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        title: 'Hata',
        text: 'Kullanıcı bulunamadı',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
      return;
    }

    this.loading = true;

    const payload: UserLoginModel = {
      userName: this.form.value.username as string,
      password: this.form.value.password as string
    };

    this.loginService.signIn(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          Swal.fire({
            title: 'Giriş Başarılı',
            text: `Hoş geldin, ${payload.userName}!`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigateByUrl('/home');
          });
        } else {
          Swal.fire({
            title: 'Hata',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'Tamam'
          });
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          title: 'Hata',
          text: 'Bir hata oluştu',
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
      }
    });
  }
}

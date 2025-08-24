// Bu bileşen, kullanıcı kayıt formunu yönetir: şifre eşleşmesi doğrulaması, uyarılar ve başarılı kayıt sonrası yönlendirme.
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

//---------------------------------------------------------------------------

// Şifre eşleşme kontrolü
const passwordMatchValidator = (): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!pass || !confirm) return null; // required'lar ayrı kontrol ediliyor
    return pass === confirm ? null : { passwordMismatch: true };
  };
};

@Component({
  selector: 'jta-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading = false;

  //form tanımı + grup seviyesinde şifre eşlemesi doğrulaması
  form = this.fb.group({
    username: ['', Validators.required],        //kullanıcı adı(zorunlu)
    password: ['', Validators.required],        //şifre(zorunlu)
    confirmPassword: ['', Validators.required], //şifre tekrar(zorunlu)
  }, { validators: passwordMatchValidator() });

  get f() { return this.form.controls; }
  get passwordMismatch() { return this.form.errors?.['passwordMismatch']; }

  submit() {
    // Form geçersizse uyarı ver
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      if (this.passwordMismatch) {
        Swal.fire({
          title: 'Hata',
          text: 'Şifreler eşleşmiyor.',
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
      } else {
        Swal.fire({
          title: 'Hata',
          text: 'Lütfen tüm alanları doldurun.',
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
      }
      return;
    }

    // Simülasyon: API isteği yerine 1sn bekleme
    this.loading = true;
    setTimeout(() => {
      this.loading = false;

      Swal.fire({
        title: 'Kayıt Başarılı',
        text: 'Giriş yapabilmek için lütfen oturum açın.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigateByUrl('/login');  //login sayfasına yönlendir
      });

    }, 1000);

  }
}

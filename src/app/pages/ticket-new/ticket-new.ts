// Amaç: Formdan gelen veriyi backend'e POST ederek yeni ticket oluşturmak.
// - Success: ID bilgisini göster, liste sayfasına yönlendir
// - Error: Backend'den gelen mesajı göster

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';                // *ngIf, *ngFor vb.
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

// Servis ve tipler
import { TicketService } from '../../services/tickets.service'; 
import { CreateTicketRequest, Ticket, ApiError } from '../../ticket.types';

@Component({
  selector: 'jta-ticket-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ticket-new.html',
  styleUrls: ['./ticket-new.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketNew {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(TicketService);
  private readonly router = inject(Router);

  // Gönderim butonu ve input'ların kontrolü için
  loading = false;

  // Basit form validasyonları
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    senderFullName: ['', [Validators.required, Validators.maxLength(100)]],
    senderEmail: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
  });

  // Form gönderildiğinde çalışır
  submit() {
    // 1) Geçersizse uyar ve dur
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({ icon: 'warning', title: 'Eksik alanlar var', text: 'Lütfen formu kontrol edin.' });
      return;
    }

    // 2) Yükleniyor durumunu aç
    this.loading = true;

    // 3) Payload'ı hazırla ve servise gönder
    const payload: CreateTicketRequest = this.form.value as CreateTicketRequest;

    this.svc.create(payload).subscribe({
      // Başarı: Ticket döner
      next: (created: Ticket) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Ticket oluşturuldu',
          text: `ID: ${created.ticketID}`
        }).then(() => this.router.navigateByUrl('/tickets'));
      },

      // Hata: Serviste ortak format ApiError'a çevriliyor
      error: (err: ApiError | unknown) => {
        this.loading = false;
        const message =
          (err as ApiError)?.message || 'İstek sırasında bir hata oluştu.'; // güvenli fallback
        Swal.fire({
          icon: 'error',
          title: 'Oluşturma başarısız',
          text: message
        });
      }
    });
  }
}

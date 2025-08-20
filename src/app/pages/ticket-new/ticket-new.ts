// src/app/pages/ticket-new/ticket-new.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';                // *ngIf vs. için
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { TicketService } from '../../services/tickets.service';  // ✅ tekil dosya/isim
import { CreateTicketRequest, Ticket } from '../../ticket.types';

@Component({
  selector: 'jta-ticket-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],   // ✅ CommonModule eklendi
  templateUrl: './ticket-new.html',
  styleUrls: ['./ticket-new.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketNew {
  private readonly fb = inject(FormBuilder);
  private readonly svc: TicketService = inject(TicketService);  // ✅ tip net
  private readonly router = inject(Router);

  loading = false;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    senderFullName: ['', [Validators.required, Validators.maxLength(100)]],
    senderEmail: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({ icon: 'warning', title: 'Eksik alanlar var', text: 'Lütfen formu kontrol edin.' });
      return;
    }

    this.loading = true;
    const payload: CreateTicketRequest = this.form.value as CreateTicketRequest;

    // ✅ create() artık Ticket döndürüyor
    this.svc.create(payload).subscribe({
      next: (created: Ticket) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Ticket oluşturuldu',
          text: `ID: ${created.ticketID}`
        }).then(() => this.router.navigateByUrl('/tickets'));
      },
      error: (err: unknown) => {
        this.loading = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Oluşturma başarısız',
          text: 'İstek sırasında bir hata oluştu.'
        });
      }
    });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

import { TicketsService } from '../../services/tickets.service';
import { CreateTicketRequest } from '../../ticket.types';

@Component({
  selector: 'jta-ticket-new',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './ticket-new.html',
  styleUrls: ['./ticket-new.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketNew {
  private fb = inject(FormBuilder);
  private svc = inject(TicketsService);
  private router = inject(Router);

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
    const payload = this.form.value as CreateTicketRequest;

    this.svc.create(payload).subscribe(res => {
      this.loading = false;

      if (res.status === 'Success' && res.data) {
        Swal.fire({
          icon: 'success',
          title: 'Ticket oluşturuldu',
          text: `ID: ${res.data.ticketID}`
        }).then(() => this.router.navigateByUrl('/tickets'));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oluşturma başarısız',
          text: res.message ?? 'Bilinmeyen hata'
        });
      }
    });
  }
}

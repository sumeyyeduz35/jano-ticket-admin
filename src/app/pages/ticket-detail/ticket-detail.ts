/**Amaç:
- Route param ile ticket detayını çek (GET)
- Durum güncelle (PUT) → SweetAlert ile geri bildirim
- Sil (DELETE) → onay popup, başarıda listeye dön*/
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TicketService } from '../../services/tickets.service';
import { Ticket, TICKET_STATUS_OPTIONS, statusLabel } from '../../ticket.types';

//--------------------------------------------------------------------------------

@Component({
  selector: 'jta-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetail {
  // DI
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly srv: TicketService = inject(TicketService);

  // UI state
  ticket: Ticket | null = null;
  loading = true;          // detay yükleniyor
  saving = false;          // durum güncelle/sil işlemi
  errorMsg: string | null = null;

  form = this.fb.group({ ticketStatus: [0] });// Form (yalnızca durum güncelleme için)

  options = TICKET_STATUS_OPTIONS;
  label = statusLabel;

  /** İlk yüklemede route param ile kayıt çek */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'Geçersiz ticket id';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.srv.getData(id)
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (t: Ticket) => {
          this.ticket = t;
          this.form.patchValue({ ticketStatus: t.ticketStatus });
          this.cdr.markForCheck();
        },
        error: (e: unknown) => {
          console.error(e);
          this.errorMsg = 'Detay alınamadı';
          this.cdr.markForCheck();
        }
      });
  }

  /** Durumu güncelle (PUT) */
  save() {
    if (!this.ticket) return;
    const id = this.ticket.ticketID;
    const status = Number(this.form.value.ticketStatus ?? 0);

    this.saving = true;
    this.srv.updateStatus(id, status)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (updated: Ticket) => {
          // UI'yı senkron tut
          this.ticket = { ...this.ticket!, ticketStatus: updated.ticketStatus ?? status };
          this.cdr.markForCheck();

          Swal.fire({ icon: 'success', title: 'Durum güncellendi', timer: 1300, showConfirmButton: false });
        },
        error: (e: unknown) => {
          console.error(e);
          Swal.fire({ icon: 'error', title: 'Güncelleme başarısız', text: 'Lütfen tekrar deneyin.' });
        }
      });
  }

  /** Sağ üst 'Sil' butonu - onay popup */
  confirmDelete() {
    if (!this.ticket) return;

    Swal.fire({
      icon: 'warning',
      title: "Ticket'ı silmek istediğinizden emin misiniz?",
      text: `#${this.ticket.ticketID} - ${this.ticket.title}`,
      showCancelButton: true,
      confirmButtonText: 'Onayla',
      cancelButtonText: 'Vazgeç',
      confirmButtonColor: '#d33'
    }).then(r => {
      if (r.isConfirmed) this.delete(this.ticket!.ticketID);
    });
  }

  /** Sil (DELETE), başarıda listeye dön */
  private delete(id: string) {
    this.saving = true;
    this.srv.delete(id)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: ({ ticketID, message }) => {
          Swal.fire({
            icon: 'success',
            title: 'Silindi',
            text: message || `Ticket başarıyla silindi (#${ticketID}).`
          }).then(() => this.router.navigateByUrl('/tickets'));
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Silinemedi',
            text: err?.message || 'Kayıt silinemedi! Lütfen tekrar deneyiniz.'
          });
        }
      });
  }
}

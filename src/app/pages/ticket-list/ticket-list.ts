// Liste sayfası
// - OnPush + Http istekleri: finalize() içinde markForCheck() ile UI'yı yenile
// - confirmDelete(): onay popup → delete()
// - delete(): başarıda listeyi yenile

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { TicketService } from '../../services/tickets.service';
import { Ticket, statusLabel } from '../../ticket.types';

@Component({
  selector: 'jta-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketList {
  private readonly svc = inject(TicketService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;           // spinner/disable
  errorMsg = '';             // üst uyarı alanı
  tickets: Ticket[] = [];
  label = statusLabel;       // durum etiketleyici

  /** Listeyi yenile */
  load() {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.markForCheck(); // ilk state değişimini bildir

    this.svc.getList()
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (list) => {
          this.tickets = list;
          // finalize() zaten loading=false + markForCheck yapıyor
        },
        error: (err) => {
          this.errorMsg = (err?.message ?? 'Liste alınamadı');
          // finalize() zaten markForCheck yapıyor
        }
      });
  }

  ngOnInit() { this.load(); }

  /** Satırdaki Sil butonu → onay penceresi */
  confirmDelete(ticket: Ticket) {
    Swal.fire({
      icon: 'warning',
      title: "Ticket'ı silmek istediğinizden emin misiniz?",
      text: `#${ticket.ticketID} - ${ticket.title}`,
      showCancelButton: true,
      confirmButtonText: 'Onayla',
      cancelButtonText: 'Vazgeç',
      confirmButtonColor: '#d33'
    }).then(r => { if (r.isConfirmed) this.delete(ticket.ticketID); });
  }

  /** API'ye DELETE çağrısı; başarıda listeyi yenile */
  private delete(id: string) {
    this.loading = true;
    this.cdr.markForCheck();

    this.svc.delete(id)
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: ({ ticketID, message }) => {
          Swal.fire({ icon: 'success', title: 'Silindi', text: message || `#${ticketID} silindi.` });
          this.load(); // yeniden çek
        },
        error: (err) => {
          Swal.fire({ icon: 'error', title: 'Silinemedi', text: err?.message || 'Kayıt silinemedi!' });
        }
      });
  }
}

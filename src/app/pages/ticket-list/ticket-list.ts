// Bu bileşen, ticket listesini çeker/gösterir; satırdan silme ve "Resolved (3)" durum güncelleme işlemlerini yönetir.

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TicketService } from '../../services/tickets.service';
import { Ticket, statusLabel } from '../../ticket.types';

//-------------------------------------------------------------------

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

  /** Satır bazlı güncelleme sırasında disable etmek için */
  updatingIds = new Set<string>();

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

  ngOnInit() { this.load(); }  //ilk açılışta listeyi çek

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

  /** Satırdan durum güncelle (Resolved = 3) – optimistic update */
  setResolved(row: Ticket) {
    if (!row?.ticketID) return;

    if (row.ticketStatus === 3) {
      Swal.fire({ icon: 'info', title: 'Bilgi', text: 'Bu ticket zaten Resolved (3).' });
      return;
    }

    this.updatingIds.add(row.ticketID);
    const prev = row.ticketStatus;
    row.ticketStatus = 3; 
    this.cdr.markForCheck();

    this.svc.updateStatus(row.ticketID, 3)
      .pipe(finalize(() => { this.updatingIds.delete(row.ticketID); this.cdr.markForCheck(); }))
      .subscribe({
        next: (updated) => {
          
          const idx = this.tickets.findIndex(t => t.ticketID === row.ticketID);
          if (idx > -1 && updated) this.tickets[idx] = { ...row, ...updated };
          Swal.fire({ icon: 'success', title: 'Güncellendi', text: 'Durum Resolved (3) olarak güncellendi.' });
        },
        error: (err) => {
          //hata durumunda eski değere geri döner
          row.ticketStatus = prev;
          Swal.fire({ icon: 'error', title: 'Güncelleme başarısız', text: err?.message || 'Lütfen tekrar deneyiniz.' });
        }
      });
  }

  /** Satır güncelleniyorsa UI’da butonu kilitlemek için yardımcı */
  isUpdating(id: string): boolean {
    return this.updatingIds.has(id);
  }
}

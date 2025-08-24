// Bu bileşen, ticket listesini çeker; basit bir arama filtresiyle ekranda gösterir.

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../services/tickets.service';
import { Ticket, statusLabel } from '../../ticket.types';

//-------------------------------------------------------------------------

@Component({
  selector: 'jta-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tickets {
  private readonly svc: TicketService = inject(TicketService);
  private readonly cdr = inject(ChangeDetectorRef);

  loading = false;
  error: string | null = null;
  items: Ticket[] = [];
  q = '';                // arama metni

  ngOnInit(): void {
    this.load();         //ilk açılışta listeyi çek
  }

  
  //Listeyi API'den çek ve ekrana bağla
  load(): void {
    this.loading = true;
    this.error = null;

    this.svc.getList()
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))  // UI'ı yenile
      .subscribe({
        next: (arr: Ticket[]) => {
          this.items = arr ?? [];           //Listeyi bağla
        },
        error: (e: unknown) => {
          console.error(e);
          this.items = [];                  //Boşalt ve hata yaz
          this.error = 'Liste alınamadı';
        }
      });
  }

  /** Durum kodunu etikete çevirir.
  * (0: Yeni, 1: Aktif, 2: İptal Edildi, 3: Çözüldü) */
  statusName(code: number): string {
    return statusLabel(code);
  }

  short(id: string): string {
    return id?.slice(0, 8) ?? '';
  }

  /** Arama filtresi */
  get filtered(): Ticket[] {
    const s = this.q.trim().toLowerCase();
    if (!s) return this.items;
    return this.items.filter(x =>
      (x.title ?? '').toLowerCase().includes(s) ||
      (x.senderFullName ?? '').toLowerCase().includes(s) ||
      (x.senderEmail ?? '').toLowerCase().includes(s) ||
      (x.description ?? '').toLowerCase().includes(s)
    );
  }
}

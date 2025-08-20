// src/app/pages/ticket-list/ticket-list.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { TicketService } from '../../services/tickets.service';
import { Ticket, statusLabel } from '../../ticket.types';

@Component({
  selector: 'jta-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketList {
  private readonly srv: TicketService = inject(TicketService);
  private readonly cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];
  loading = false;
  errorMsg: string | null = null;

  ngOnInit() {
    this.fetch();
  }

  private fetch() {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.markForCheck(); // 🔔 ilk değişikliği de bildir

    this.srv.getList()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.markForCheck(); // 🔔 her durumda loading=false yansısın
      }))
      .subscribe({
        next: (list: Ticket[]) => {
          this.tickets = list ?? [];
          this.cdr.markForCheck(); // 🔔 veri yansısın
          // console.log('tickets length:', this.tickets.length);
        },
        error: (e: unknown) => {
          console.error('getList error', e);
          this.errorMsg = 'Liste alınamadı';
          this.cdr.markForCheck(); // 🔔 hata yansısın
        },
      });
  }

  label(s: number) { return statusLabel(s); }
}

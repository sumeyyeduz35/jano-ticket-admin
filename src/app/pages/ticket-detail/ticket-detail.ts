import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../services/tickets.service';
import { Ticket, TICKET_STATUS_OPTIONS, statusLabel } from '../../ticket.types';


@Component({
  selector: 'jta-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketDetail {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly srv: TicketService = inject(TicketService);

  ticket: Ticket | null = null;
  loading = true;
  saving = false;
  errorMsg: string | null = null;

  form = this.fb.group({ ticketStatus: [0] });

  options = TICKET_STATUS_OPTIONS;
  label = statusLabel;

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

  save() {
    if (!this.ticket) return;
    const id = this.ticket.ticketID;
    const status = Number(this.form.value.ticketStatus ?? 0);

    this.saving = true;
    this.srv.updateStatus(id, status)
      .pipe(finalize(() => { this.saving = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (updated: Ticket) => {
          this.ticket = { ...this.ticket!, ticketStatus: updated.ticketStatus ?? status };
          this.cdr.markForCheck();
          alert('Durum güncellendi (mock).');
        },
        error: (e: unknown) => {
          console.error(e);
          alert('Güncelleme başarısız (mock API).');
        }
      });
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketsService } from '../../services/tickets.service';
import { TicketDTO } from '../../ticket.types';

@Component({
  selector: 'jta-tickets',
  standalone: true,
  imports: [RouterModule, NgIf, NgFor, FormsModule, DatePipe],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tickets implements OnInit {
  private svc = inject(TicketsService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  error = '';
  items: TicketDTO[] = [];
  q = ''; // arama

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.svc.list().subscribe(res => {
      this.loading = false;
      if (res.status === 'Success' && res.data) {
        this.items = res.data;
      } else {
        this.error = res.message ?? 'Liste alınamadı';
      }
      this.cdr.markForCheck();
    });
  }

  // basit durum adı
  statusName(code: number) {
    switch (code) {
      case 0: return 'Open';
      case 1: return 'In Progress';
      case 2: return 'Resolved';
      case 3: return 'Closed';
      default: return `#${code}`;
    }
  }

  short(id: string) { return id?.slice(0, 8); }

  get filtered() {
    const s = this.q.trim().toLowerCase();
    if (!s) return this.items;
    return this.items.filter(x =>
      x.title.toLowerCase().includes(s) ||
      x.senderFullName.toLowerCase().includes(s) ||
      x.senderEmail.toLowerCase().includes(s) ||
      x.description.toLowerCase().includes(s)
    );
  }
}

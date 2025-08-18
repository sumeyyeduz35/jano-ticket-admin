import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { API_HOST } from '../api.config';
import { ApiEnvelope, CreateTicketRequest, TicketDTO } from '../ticket.types';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private http = inject(HttpClient);

  // POST /api/tickets
  create(body: CreateTicketRequest): Observable<ApiEnvelope<TicketDTO>> {
    const url = `${API_HOST}/api/tickets`;
    return this.http.post<ApiEnvelope<TicketDTO>>(url, body).pipe(
      catchError((err) =>
        of<ApiEnvelope<TicketDTO>>({
          status: 'Error',
          message: err?.error?.message || 'İstek sırasında bir hata oluştu',
          data: null
        })
      )
    );
  }

  // GET /api/tickets
  list(): Observable<ApiEnvelope<TicketDTO[]>> {
    const url = `${API_HOST}/api/tickets`;
    return this.http.get<ApiEnvelope<TicketDTO[]>>(url).pipe(
      catchError((err) =>
        of<ApiEnvelope<TicketDTO[]>>({
          status: 'Error',
          message: err?.error?.message || 'Liste alınırken bir hata oluştu',
          data: null
        })
      )
    );
  }
}

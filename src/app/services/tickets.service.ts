import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiItemResponse, ApiListResponse, CreateTicketRequest, Ticket } from '../ticket.types';

const BASE = 'https://40368fbe-667d-4d7d-b6f6-4bea2bc79a27.mock.pstmn.io';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  getList(): Observable<Ticket[]> {
    return this.http
      .get<ApiListResponse<Ticket>>(`${BASE}/api/tickets`)
      .pipe(map(res => res.data));
  }

  getData(id: string): Observable<Ticket> {
    return this.http
      .get<ApiItemResponse<Ticket>>(`${BASE}/api/tickets/${id}`)
      .pipe(map(res => res.data));
  }

  create(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http
      .post<ApiItemResponse<Ticket>>(`${BASE}/api/tickets`, payload)
      .pipe(map(res => res.data));
  }

  // Mock’ta persist etmeyebilir; UI akışı için var.
  updateStatus(id: string, ticketStatus: number): Observable<Ticket> {
    return this.http
      .put<ApiItemResponse<Ticket>>(`${BASE}/api/tickets/${id}`, { ticketStatus })
      .pipe(map(res => res.data));
  }
}

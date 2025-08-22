/**
 * TicketService
 * - Liste/Detay: GET
 * - Oluşturma:   POST (Success/Error sözleşmesi)
 * - Durum:       PUT   (item/Success sarmalayıcılarını tolere eder)
 * - Silme:       DELETE (Success/Error sözleşmesi)
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

import {
  ApiItemResponse,
  ApiListResponse,
  ApiResponse,
  CreateTicketRequest,
  Ticket,
  ApiSuccess,
  ApiError,
} from '../ticket.types';

// Mock API kök adresi
const BASE = 'https://40368fbe-667d-4d7d-b6f6-4bea2bc79a27.mock.pstmn.io';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  /** Ortak HTTP hata işleyici (network/4xx/5xx → ApiError) */
  private handleHttpError = (e: HttpErrorResponse | Error) => {
    const message =
      e instanceof HttpErrorResponse
        ? (e.error?.message || e.message || 'İstek sırasında bir hata oluştu')
        : (e.message || 'İşlem başarısız');
    const err: ApiError = { status: 'Error', message, data: null };
    return throwError(() => err);
  };

  /** Liste: GET /api/tickets */
  getList(): Observable<Ticket[]> {
    return this.http
      .get<ApiListResponse<Ticket>>(`${BASE}/api/tickets`)
      .pipe(
        map((res) => {
          // Beklenen: { status, message, data: Ticket[] }
          if (Array.isArray(res?.data)) return res.data;
          throw new Error('Liste verisi beklenen formatta değil');
        }),
        catchError(this.handleHttpError)
      );
  }

  /** Detay: GET /api/tickets/:id */
  getData(id: string): Observable<Ticket> {
    return this.http
      .get<ApiItemResponse<Ticket>>(`${BASE}/api/tickets/${id}`)
      .pipe(
        map((res) => {
          // Beklenen: { status, message, data: Ticket }
          if (res?.data) return res.data;
          throw new Error('Kayıt bulunamadı');
        }),
        catchError(this.handleHttpError)
      );
  }

  /** Oluştur: POST /api/tickets (Success/Error sözleşmesi) */
  create(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http
      .post<ApiResponse<Ticket>>(`${BASE}/api/tickets`, payload)
      .pipe(
        map((res) => {
          // Success: { status:'Success', data: Ticket }
          if ((res as ApiSuccess<Ticket>)?.status === 'Success') {
            return (res as ApiSuccess<Ticket>).data;
          }
          // Error: { status:'Error', message }
          const err = res as ApiError;
          throw new Error(err?.message || 'Ticket oluşturulamadı');
        }),
        catchError(this.handleHttpError)
      );
  }

  /** Durum güncelle: PUT /api/tickets/:id (item/Success formatlarını destekler) */
  updateStatus(id: string, ticketStatus: number): Observable<Ticket> {
    return this.http
      .put<ApiItemResponse<Ticket> | ApiResponse<Ticket>>(
        `${BASE}/api/tickets/${id}`,
        { ticketStatus }
      )
      .pipe(
        map((res) => {
          // 1) Success sarmalayıcı
          if ((res as ApiSuccess<Ticket>)?.status === 'Success') {
            return (res as ApiSuccess<Ticket>).data;
          }
          // 2) Item sarmalayıcı
          const item = res as ApiItemResponse<Ticket>;
          if (item?.data) return item.data;

          // 3) Error sarmalayıcı
          const err = res as ApiError;
          throw new Error(err?.message || 'Durum güncellenemedi');
        }),
        catchError(this.handleHttpError)
      );
  }

  /** Sil: DELETE /api/tickets/:id (Success/Error sözleşmesi) */
  delete(id: string): Observable<{ ticketID: string; message: string | null }> {
    return this.http
      .delete<ApiResponse<{ ticketID: string }>>(`${BASE}/api/tickets/${id}`)
      .pipe(
        map((res) => {
          // Success: { status:'Success', message, data:{ ticketID } }
          if ((res as ApiSuccess<{ ticketID: string }>).status === 'Success') {
            const ok = res as ApiSuccess<{ ticketID: string }>;
            return { ticketID: ok.data.ticketID, message: ok.message };
          }
          // Error: { status:'Error', message }
          const err = res as ApiError;
          throw new Error(err?.message || 'Kayıt silinemedi! Lütfen tekrar deneyiniz.');
        }),
        catchError(this.handleHttpError)
      );
  }
}

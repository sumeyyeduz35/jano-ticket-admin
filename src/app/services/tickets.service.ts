/** Bu servis, Ticket API ile CRUD işlemlerini (Listeleme, Detay, Oluşturma, Güncelleme, Silme) gerçekleştirir.
 * TicketService
 * - Liste/Detay: GET
 * - Oluşturma:   POST (Success/Error sözleşmesi)
 * - Durum:       PUT   (item/Success sarmalayıcılarını tolere eder)
 * - Silme:       DELETE (Success/Error sözleşmesi)
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ConfigService } from './config.service'; // ⬅️ dinamik base URL için
import {
  ApiItemResponse,
  ApiListResponse,
  ApiResponse,
  CreateTicketRequest,
  Ticket,
  ApiSuccess,
  ApiError,
} from '../ticket.types';

//----------------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private cfg = inject(ConfigService); // ⬅️ serviceURL buradan gelecek

  /** Ortak HTTP hata işleyici (network/4xx/5xx → ApiError) */
  private handleHttpError = (e: HttpErrorResponse | Error) => {
    const message =
      e instanceof HttpErrorResponse
        ? (e.error?.message || e.message || 'İstek sırasında bir hata oluştu')
        : (e.message || 'İşlem başarısız');
    const err: ApiError = { status: 'Error', message, data: null };
    return throwError(() => err);
  };

  /** Liste: GET /tickets  (config.serviceURL: .../api) */
  getList(): Observable<Ticket[]> {
    return this.http
      .get<ApiListResponse<Ticket>>(`${this.cfg.serviceURL}/tickets`)
      .pipe(
        map((res) => {
          // Beklenen: { status, message, data: Ticket[] }
          if (Array.isArray(res?.data)) return res.data;
          throw new Error('Liste verisi beklenen formatta değil');
        }),
        catchError(this.handleHttpError)
      );
  }

  /** Detay: GET /tickets/:id */
  getData(id: string): Observable<Ticket> {
    return this.http
      .get<ApiItemResponse<Ticket>>(`${this.cfg.serviceURL}/tickets/${id}`)
      .pipe(
        map((res) => {
          // Beklenen: { status, message, data: Ticket }
          if (res?.data) return res.data;
          throw new Error('Kayıt bulunamadı');
        }),
        catchError(this.handleHttpError)
      );
  }

  /** Oluştur: POST /tickets (Success/Error sözleşmesi) */
  create(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http
      .post<ApiResponse<Ticket>>(`${this.cfg.serviceURL}/tickets`, payload)
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

  /** Durum güncelle: PUT /tickets/:id (item/Success formatlarını destekler) */
  updateStatus(id: string, ticketStatus: number): Observable<Ticket> {
    const url = `${this.cfg.serviceURL}/tickets/${id}`;
    const body = { ticketStatus };

    return this.http
      .put<ApiItemResponse<Ticket> | ApiResponse<Ticket> | Ticket>(url, body)
      .pipe(
        map((res) => {
          // 0) Bazı mock senaryolarında düz Ticket dönebiliyor
          if (res && typeof res === 'object' && 'ticketID' in res && 'ticketStatus' in res) {
            return res as Ticket;
          }
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

  /** Sil: DELETE /tickets/:id (Success/Error sözleşmesi) */
  delete(id: string): Observable<{ ticketID: string; message: string | null }> {
    return this.http
      .delete<ApiResponse<{ ticketID: string }>>(`${this.cfg.serviceURL}/tickets/${id}`)
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

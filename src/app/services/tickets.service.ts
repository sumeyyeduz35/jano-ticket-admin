/**
 * TicketService
 * - Liste / detay: mock API'nin standart list/item sarmalayıcılarını okur
 * - Oluşturma (POST): Success/Error ayrımını yapar, hatada anlamlı mesaj üretir
 * - Durum güncelleme (PUT): mock item veya Success sarmalayıcısını tolere eder
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

// Tipler tek merkezden: src/app/ticket.types.ts
import {
  ApiItemResponse,
  ApiListResponse,
  ApiResponse,
  CreateTicketRequest,
  Ticket,
  ApiSuccess,
  ApiError,
} from '../ticket.types';

// Mock API kök adresi (aynı kaldı)
const BASE = 'https://40368fbe-667d-4d7d-b6f6-4bea2bc79a27.mock.pstmn.io';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);

  /**
   * Genel HTTP hata yakalayıcı (network/4xx/5xx)
   */
  private handleHttpError = (e: HttpErrorResponse | Error) => {
    const message =
      e instanceof HttpErrorResponse
        ? (e.error?.message || e.message || 'İstek sırasında bir hata oluştu')
        : (e.message || 'İşlem başarısız');
    const err: ApiError = { status: 'Error', message, data: null };
    return throwError(() => err);
  };

  /**
   * Ticket listesini çeker: GET /api/tickets
   */
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

  /**
   * Tek ticket detayını çeker: GET /api/tickets/:id
   */
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

  /**
   * Yeni ticket oluşturur: POST /api/tickets
   * Backend sözleşmesi: Success/Error ayrımı
   */
  create(payload: CreateTicketRequest): Observable<Ticket> {
    return this.http
      .post<ApiResponse<Ticket>>(`${BASE}/api/tickets`, payload)
      .pipe(
        map((res) => {
          // Success: { status: 'Success', data: Ticket }
          if ((res as ApiSuccess<Ticket>)?.status === 'Success') {
            return (res as ApiSuccess<Ticket>).data;
          }
          // Error: { status: 'Error', message, data: null }
          const err = res as ApiError;
          throw new Error(err?.message || 'Ticket oluşturulamadı');
        }),
        catchError(this.handleHttpError)
      );
  }

  /**
   * Ticket durumunu günceller: PUT /api/tickets/:id
   * Mock bazen item sarmalar, bazen Success döndürebilir; iki durumu da işler.
   */
  updateStatus(id: string, ticketStatus: number): Observable<Ticket> {
    return this.http
      .put<ApiItemResponse<Ticket> | ApiResponse<Ticket>>(
        `${BASE}/api/tickets/${id}`,
        { ticketStatus }
      )
      .pipe(
        map((res: ApiItemResponse<Ticket> | ApiResponse<Ticket>) => {
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
}

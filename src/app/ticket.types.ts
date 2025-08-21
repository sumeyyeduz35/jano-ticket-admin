/**
 * Tek bir ticket kaydının tip tanımı
 */
export interface Ticket {
  ticketID: string;
  title: string;
  description: string;
  senderFullName: string;
  senderEmail: string;
  ticketStatus: number;           // 0: Yeni, 1: Aktif, 2: İptal Edildi, 3: Çözüldü
  assignedUserId?: string | null; // Opsiyonel atanmış kullanıcı
  createdAt: string;              // ISO datetime
  updatedAt?: string | null;      // ISO datetime | null
}

/**
 * Mock API yanıt sarmalayıcıları
 * - Liste için: ApiListResponse<T>
 * - Tek kayıt için: ApiItemResponse<T>
 */
export type ApiListResponse<T> = { status: string; message: string | null; data: T[] };
export type ApiItemResponse<T> = { status: string; message: string | null; data: T };

/**
 * Yeni ticket oluşturma isteği (form gönderimi)
 * – Var olan isim korunuyor (geri uyumluluk)
 */
export interface CreateTicketRequest {
  title: string;
  description: string;
  senderFullName: string;
  senderEmail: string;
}

/**
 * Servis tarafında daha okunaklı olsun diye alias.
 * (İstersen ilerde CreateTicketRequest yerine bunu kullanırsın.)
 */
export type NewTicketRequest = CreateTicketRequest;

/**
 * API success/error tipleri (POST dönüşlerini ayırmak için)
 */
export interface ApiSuccess<T> {
  status: 'Success';
  message: string | null;
  data: T;
}
export interface ApiError {
  status: 'Error';
  message: string;
  data: null;
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Durum seçenekleri ve yardımcı label fonksiyonu
 */
export const TICKET_STATUS_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Yeni' },
  { value: 1, label: 'Aktif' },
  { value: 2, label: 'İptal Edildi' },
  { value: 3, label: 'Çözüldü' },
];

export const statusLabel = (s: number) =>
  TICKET_STATUS_OPTIONS.find(x => x.value === s)?.label ?? String(s);

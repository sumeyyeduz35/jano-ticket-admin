export interface Ticket {
  ticketID: string;
  title: string;
  description: string;
  senderFullName: string;
  senderEmail: string;
  ticketStatus: number;           // 0: Yeni, 1: Aktif, 2: İptal Edildi, 3: Çözüldü
  assignedUserId?: string | null;
  createdAt: string;              // ISO
  updatedAt?: string | null;      // ISO | null
}

// List/Item response sarmalayıcıları (mock API için)
export type ApiListResponse<T> = { status: string; message: string | null; data: T[] };
export type ApiItemResponse<T> = { status: string; message: string | null; data: T };

// Yeni ticket oluşturma isteği (ticket-new için)
export interface CreateTicketRequest {
  title: string;
  description: string;
  senderFullName: string;
  senderEmail: string;
}

export const TICKET_STATUS_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: 'Yeni' },
  { value: 1, label: 'Aktif' },
  { value: 2, label: 'İptal Edildi' },
  { value: 3, label: 'Çözüldü' },
];

export const statusLabel = (s: number) =>
  TICKET_STATUS_OPTIONS.find(x => x.value === s)?.label ?? String(s);

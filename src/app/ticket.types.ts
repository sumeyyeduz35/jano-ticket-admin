export type ApiStatus = 'Success' | 'Error';

export interface CreateTicketRequest {
  title: string;
  description: string;
  senderFullName: string;
  senderEmail: string;
}

export interface TicketDTO {
  ticketID: string;
  title: string;
  description: string;
  senderFullName: string;
  senderEmail: string;
  ticketStatus: number;       // 0: Open vb. (ileride enum yaparız)
  assignedUserId: string | null;
  createdAt: string;          // ISO
  updatedAt: string | null;   // ISO | null
}

export interface ApiEnvelope<T> {
  status: ApiStatus;
  message: string | null;
  data: T | null;
}

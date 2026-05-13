export type CustomerType =
  | "rural_producer"
  | "seed_producer"
  | "laboratory"
  | "warehouse"
  | "technical_assistance"
  | "accounting_office";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_customer"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Customer {
  id: number;
  name: string;
  document?: string;
  customer_type: CustomerType;
  city: string;
  state: string;
}

export interface ProductArea {
  id: number;
  name: string;
  description?: string;
}

export interface TicketComment {
  id: number;
  author_name: string;
  message: string;
  internal: boolean;
  created_at: string;
}

export interface RequestTicket {
  id: number;
  customer_id: number;
  product_area_id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  due_date?: string;
  customer: Customer;
  product_area: ProductArea;
  ticket_comments: TicketComment[];
  created_at: string;
  updated_at: string;
}

export interface CustomerPayload {
  name: string;
  document: string;
  customer_type: CustomerType;
  city: string;
  state: string;
}

export interface TicketPayload {
  customer_id: number;
  product_area_id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  due_date: string;
}

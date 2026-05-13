import type { CustomerPayload, RequestTicket, TicketPayload } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = Array.isArray(errorBody?.error)
      ? errorBody.error.join(", ")
      : errorBody?.error ?? "Unexpected API error";

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const agroconnectApi = {
  getCustomers: () => request("/customers"),
  createCustomer: (customer: CustomerPayload) =>
    request("/customers", {
      method: "POST",
      body: JSON.stringify({ customer })
    }),

  getProductAreas: () => request("/product_areas"),

  getTickets: (filters: { status?: string; productAreaId?: string }) => {
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.productAreaId) params.set("product_area_id", filters.productAreaId);

    const query = params.toString();
    return request<RequestTicket[]>(`/request_tickets${query ? `?${query}` : ""}`);
  },

  createTicket: (requestTicket: TicketPayload) =>
    request<RequestTicket>("/request_tickets", {
      method: "POST",
      body: JSON.stringify({ request_ticket: requestTicket })
    }),

  advanceTicketStatus: (ticketId: number) =>
    request<RequestTicket>(`/request_tickets/${ticketId}/advance_status`, {
      method: "PATCH"
    }),

  deleteTicket: (ticketId: number) =>
    request<void>(`/request_tickets/${ticketId}`, {
      method: "DELETE"
    }),

  createComment: (ticketId: number, message: string) =>
    request<RequestTicket>(`/request_tickets/${ticketId}/ticket_comments`, {
      method: "POST",
      body: JSON.stringify({
        ticket_comment: {
          author_name: "AgroConnect Team",
          message,
          internal: false
        }
      })
    })
};

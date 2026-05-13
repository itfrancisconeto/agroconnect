import axios from "axios";
import type { CustomerPayload, RequestTicket, TicketPayload } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const errorBody = error.response?.data;

    if (Array.isArray(errorBody?.error)) {
      return errorBody.error.join(", ");
    }

    if (typeof errorBody?.error === "string") {
      return errorBody.error;
    }

    return error.message || "Unexpected API error";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected API error";
}

async function request<T>(callback: () => Promise<{ data: T }>): Promise<T> {
  try {
    const response = await callback();
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const agroconnectApi = {
  getCustomers: () =>
    request(() => api.get("/customers")),

  createCustomer: (customer: CustomerPayload) =>
    request(() =>
      api.post("/customers", {
        customer
      })
    ),

  getProductAreas: () =>
    request(() => api.get("/product_areas")),

  getTickets: (filters: { status?: string; productAreaId?: string }) =>
    request<RequestTicket[]>(() =>
      api.get("/request_tickets", {
        params: {
          status: filters.status || undefined,
          product_area_id: filters.productAreaId || undefined
        }
      })
    ),

  createTicket: (requestTicket: TicketPayload) =>
    request<RequestTicket>(() =>
      api.post("/request_tickets", {
        request_ticket: {
          customer_id: Number(requestTicket.customer_id),
          product_area_id: Number(requestTicket.product_area_id),
          title: requestTicket.title,
          description: requestTicket.description,
          priority: requestTicket.priority,
          status: requestTicket.status,
          due_date: requestTicket.due_date
        }
      })
    ),

  advanceTicketStatus: (ticketId: number) =>
    request<RequestTicket>(() =>
      api.patch(`/request_tickets/${ticketId}/advance_status`)
    ),

  deleteTicket: async (ticketId: number) => {
    try {
      await api.delete(`/request_tickets/${ticketId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  createComment: (ticketId: number, message: string) =>
    request<RequestTicket>(() =>
      api.post(`/request_tickets/${ticketId}/ticket_comments`, {
        ticket_comment: {
          author_name: "AgroConnect Team",
          message,
          internal: false
        }
      })
    )
};
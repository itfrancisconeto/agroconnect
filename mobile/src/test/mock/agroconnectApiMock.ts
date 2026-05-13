import { vi } from "vitest";

export const mockCustomers = [
  {
    id: 1,
    name: "Sítio da Vivi",
    document: "123.456.789-09",
    customer_type: "rural_producer",
    city: "Cataguases",
    state: "MG",
  },
];

export const mockProductAreas = [
  {
    id: 1,
    name: "Agro Sementes",
    description: "Gestão de sementes",
  },
];

export const mockTickets = [
  {
    id: 1,
    customer_id: 1,
    product_area_id: 1,
    title: "Solicitação de sementes",
    description: "Novo pedido de sementes",
    priority: "high",
    status: "open",
    due_date: "2026-05-11",
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    customer: {
      id: 1,
      name: "Sítio da Vivi",
      document: "123.456.789-09",
      customer_type: "rural_producer",
      city: "Cataguases",
      state: "MG",
    },
    product_area: {
      id: 1,
      name: "Agro Sementes",
      description: "Gestão de sementes",
    },
    ticket_comments: [
      {
        id: 1,
        author_name: "Equipe de Suporte",
        message: "Solicitação recebida.",
        internal: false,
        created_at: "2026-05-01T00:00:00Z",
      },
    ],
  },
];

export const agroconnectApiMock = {
  getCustomers: vi.fn().mockResolvedValue(mockCustomers),
  getProductAreas: vi.fn().mockResolvedValue(mockProductAreas),
  getTickets: vi.fn().mockResolvedValue(mockTickets),

  advanceTicketStatus: vi.fn(),
  createComment: vi.fn(),
  createCustomer: vi.fn(),
  createTicket: vi.fn(),
};
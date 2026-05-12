import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./api/agroconnectApi", () => {
  return {
    agroconnectApi: {
      getProductAreas: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: "Agro Sementes",
          description: "Gestão de sementes"
        }
      ]),

      getTickets: vi.fn().mockResolvedValue([
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
            state: "MG"
          },
          product_area: {
            id: 1,
            name: "Agro Sementes",
            description: "Gestão de sementes"
          },
          ticket_comments: [
            {
              id: 1,
              author_name: "Equipe de Suporte",
              message: "Solicitação recebida.",
              internal: false,
              created_at: "2026-05-01T00:00:00Z"
            }
          ]
        }
      ]),

      advanceTicketStatus: vi.fn(),
      createComment: vi.fn()
    }
  };
});

describe("AgroConnect Mobile App", () => {
  it("renders tickets returned from the API", async () => {
    render(<App />);

    expect(await screen.findByText("Solicitação de sementes")).toBeInTheDocument();
    expect(screen.getByText("Novo pedido de sementes")).toBeInTheDocument();
    expect(screen.getByText("Solicitação recebida.")).toBeInTheDocument();

    const openLabels = await screen.findAllByText("Aberta");
    expect(openLabels.length).toBeGreaterThan(0);

    const highPriorityLabels = await screen.findAllByText("Alta");
    expect(highPriorityLabels.length).toBeGreaterThan(0);
  });
});
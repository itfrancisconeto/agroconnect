import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TicketCard } from "./TicketCard";
import type { RequestTicket } from "../types";

const ticket: RequestTicket = {
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
  ticket_comments: []
};

describe("TicketCard", () => {
  it("renders ticket information with formatted labels", () => {
    render(
      <TicketCard
        ticket={ticket}
        commentValue=""
        onCommentChange={vi.fn()}
        onAddComment={vi.fn()}
        onAdvanceStatus={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Solicitação de sementes")).toBeInTheDocument();
    expect(screen.getByText("Aberta")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Sítio da Vivi • Agro Sementes • Prazo 2026-05-11")).toBeInTheDocument();
  });

  it("calls onAdvanceStatus when clicking advance status", () => {
    const onAdvanceStatus = vi.fn();

    render(
      <TicketCard
        ticket={ticket}
        commentValue=""
        onCommentChange={vi.fn()}
        onAddComment={vi.fn()}
        onAdvanceStatus={onAdvanceStatus}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /avançar status/i }));

    expect(onAdvanceStatus).toHaveBeenCalledTimes(1);
  });

    it("asks for confirmation before deleting", () => {
    const onDelete = vi.fn();

    render(
        <TicketCard
        ticket={ticket}
        commentValue=""
        onCommentChange={vi.fn()}
        onAddComment={vi.fn()}
        onAdvanceStatus={vi.fn()}
        onDelete={onDelete}
        />
    );

    fireEvent.click(screen.getByLabelText("Excluir solicitação"));

    const dialog = screen.getByRole("dialog", {
        name: /excluir solicitação/i
    });

    expect(dialog).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(
        within(dialog).getByRole("button", {
        name: /excluir solicitação/i
        })
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { agroconnectApiMock } from "./test/mock/agroconnectApiMock";

vi.mock("@shared/agroconnectApi", () => ({
  agroconnectApi: agroconnectApiMock,
}));

vi.mock("./components/CustomerModal", () => ({
  CustomerModal: () => null,
}));

vi.mock("./components/TicketModal", () => ({
  TicketModal: () => null,
}));

import App from "./App";

describe("AgroConnect Mobile App", () => {
  it("renderiza os tickets retornados pela API", async () => {
    render(<App />);

    expect(await screen.findByText("Solicitação de sementes")).toBeInTheDocument();
    expect(screen.getByText("Novo pedido de sementes")).toBeInTheDocument();
    expect(screen.getByText("Solicitação recebida.")).toBeInTheDocument();
  });

  it("renderiza os badges de status e prioridade corretamente", async () => {
    render(<App />);

    await screen.findByText("Solicitação de sementes");

    expect(screen.getAllByText("Aberta").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Alta").length).toBeGreaterThan(0);
  });

  it("renderiza o resumo de solicitações", async () => {
    render(<App />);

    await screen.findByText("Solicitação de sementes");

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Abertas")).toBeInTheDocument();
    expect(screen.getAllByText("Em andamento").length).toBeGreaterThan(0);
  });

  it("renderiza o subtítulo com cliente e área do produto", async () => {
    render(<App />);

    await screen.findByText("Solicitação de sementes");

    expect(
      screen.getByText(/Sítio da Vivi.*Agro Sementes/i)
    ).toBeInTheDocument();
  });
});
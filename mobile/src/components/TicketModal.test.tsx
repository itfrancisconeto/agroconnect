import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { TicketModal } from "./TicketModal";
import type { Customer, ProductArea, TicketPayload } from "@shared/types";

describe("TicketModal", () => {
  const baseValue: TicketPayload = {
    customer_id: 0,
    product_area_id: 0,
    title: "",
    description: "",
    priority: "low",
    status: "open",
    due_date: "",
  };

  const mockCustomers: Customer[] = [
    { id: 1, name: "João Silva", state: "MG" } as Customer,
    { id: 2, name: "Maria Souza", state: "SP" } as Customer,
  ];

  const mockProductAreas: ProductArea[] = [
    { id: 1, name: "Sementes" } as ProductArea,
    { id: 2, name: "Defensivos" } as ProductArea,
  ];

  const onChange = vi.fn();
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup(value: TicketPayload = baseValue) {
    return render(
      <TicketModal
        isOpen={true}
        value={value}
        customers={mockCustomers}
        productAreas={mockProductAreas}
        onChange={onChange}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
  }

  it("renderiza título e botões principais", () => {
    setup();
    expect(screen.getByText("Nova solicitação")).toBeInTheDocument();
    expect(screen.getByText("Salvar solicitação")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("renderiza os clientes no select", () => {
    setup();
    expect(screen.getByText("João Silva - MG")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza - SP")).toBeInTheDocument();
  });

  it("renderiza as áreas no select", () => {
    setup();
    expect(screen.getByText("Sementes")).toBeInTheDocument();
    expect(screen.getByText("Defensivos")).toBeInTheDocument();
  });

  it("chama onChange ao selecionar um cliente", () => {
    setup();
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "1" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ customer_id: 1 })
    );
  });

  it("chama onChange ao selecionar uma área", () => {
    setup();
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ product_area_id: 2 })
    );
  });

  it("chama onChange ao alterar o título", () => {
    setup();
    const input = screen.getByPlaceholderText("Título da solicitação");
    fireEvent.change(input, { target: { value: "Problema na lavoura" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Problema na lavoura" })
    );
  });

  it("chama onChange ao alterar a descrição", () => {
    setup();
    const textarea = screen.getByPlaceholderText("Descreva a solicitação");
    fireEvent.change(textarea, { target: { value: "Detalhes do problema" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Detalhes do problema" })
    );
  });

  it("chama onChange ao alterar a prioridade", () => {
    setup();
    const selects = screen.getAllByRole("combobox");
    const prioritySelect = selects[2];
    fireEvent.change(prioritySelect, { target: { value: "urgent" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ priority: "urgent" })
    );
  });

  it("chama onChange ao alterar o prazo", () => {
    const { container } = setup();
    const dateInput = container.querySelector('input[type="date"]')!;
    fireEvent.change(dateInput, { target: { value: "2025-12-31" } });
    expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ due_date: "2025-12-31" })
    );
  });

  it("chama onSubmit ao clicar em Salvar solicitação", () => {
    setup();
    const saveButton = screen.getByText("Salvar solicitação");
    fireEvent.click(saveButton);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("chama onClose ao clicar em Cancelar", () => {
    setup();
    const buttons = screen.getAllByRole("button");
    const cancelButton = buttons.find((btn) =>
      btn.textContent?.includes("Cancelar")
    );
    expect(cancelButton).toBeTruthy();
    fireEvent.click(cancelButton!);
    expect(onClose).toHaveBeenCalled();
  });

  it("chama onClose ao clicar em Fechar", () => {
    setup();
    const buttons = screen.getAllByRole("button");
    const closeButton = buttons.find((btn) =>
      btn.textContent?.includes("Fechar")
    );
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton!);
    expect(onClose).toHaveBeenCalled();
  });

  it("não renderiza quando isOpen é false", () => {
    render(
      <TicketModal
        isOpen={false}
        value={baseValue}
        customers={mockCustomers}
        productAreas={mockProductAreas}
        onChange={onChange}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
    expect(screen.queryByText("Nova solicitação")).not.toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { CustomerModal } from "./CustomerModal";
import type { CustomerPayload } from "@shared/types";

describe("CustomerModal", () => {
  const baseValue: CustomerPayload = {
    name: "",
    document: "",
    customer_type: "rural_producer",
    city: "",
    state: "",
  };

  const onChange = vi.fn();
  const onClose = vi.fn();
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function setup(value: CustomerPayload = baseValue) {
    return render(
      <CustomerModal
        isOpen={true}
        value={value}
        onChange={onChange}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );
  }

  it("renderiza título e botões principais", () => {
    setup();
    expect(screen.getByText("Novo cliente")).toBeInTheDocument();
    expect(screen.getByText("Salvar cliente")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("chama onChange ao alterar o nome", () => {
    setup();
    const input = screen.getByPlaceholderText("Nome do cliente");
    fireEvent.change(input, { target: { value: "João" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "João" })
    );
  });

  it("mostra erro ao tentar salvar com CPF inválido", () => {
    setup({ ...baseValue, document: "12345678900" });
    const saveButton = screen.getByText("Salvar cliente");
    fireEvent.click(saveButton);
    expect(
      screen.getByText("Informe um CPF ou CNPJ válido.")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("chama onSubmit com CPF válido", () => {
    setup({ ...baseValue, document: "39053344705" });
    const saveButton = screen.getByText("Salvar cliente");
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
});
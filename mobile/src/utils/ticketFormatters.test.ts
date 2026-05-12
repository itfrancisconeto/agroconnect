import { describe, expect, it } from "vitest";
import {
  formatTicketPriority,
  formatTicketStatus
} from "./ticketFormatters";

describe("ticketFormatters", () => {
  it("formats ticket status labels", () => {
    expect(formatTicketStatus("open")).toBe("Aberta");
    expect(formatTicketStatus("in_progress")).toBe("Em andamento");
    expect(formatTicketStatus("waiting_customer")).toBe("Aguardando cliente");
    expect(formatTicketStatus("resolved")).toBe("Resolvida");
    expect(formatTicketStatus("closed")).toBe("Fechada");
  });

  it("formats ticket priority labels", () => {
    expect(formatTicketPriority("low")).toBe("Baixa");
    expect(formatTicketPriority("medium")).toBe("Média");
    expect(formatTicketPriority("high")).toBe("Alta");
    expect(formatTicketPriority("urgent")).toBe("Urgente");
  });
});
import type { TicketPriority, TicketStatus } from "../types";

const ticketStatusLabels: Record<TicketStatus, string> = {
  open: "Aberta",
  in_progress: "Em andamento",
  waiting_customer: "Aguardando cliente",
  resolved: "Resolvida",
  closed: "Fechada"
};

const ticketPriorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente"
};

export function formatTicketStatus(status: TicketStatus): string {
  return ticketStatusLabels[status];
}

export function formatTicketPriority(priority: TicketPriority): string {
  return ticketPriorityLabels[priority];
}
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Leaf, RefreshCw } from "lucide-react";
import { agroconnectApi } from "./api/agroconnectApi";
import { CustomerForm } from "./components/CustomerForm";
import { Snackbar } from "./components/Snackbar";
import { SummaryCard } from "./components/SummaryCard";
import { TicketCard } from "./components/TicketCard";
import { TicketForm } from "./components/TicketForm";
import type {
  Customer,
  CustomerPayload,
  ProductArea,
  RequestTicket,
  TicketPayload
} from "./types";

import {
  formatTicketStatus
} from "./utils/ticketFormatters";

const initialCustomerForm: CustomerPayload = {
  name: "",
  document: "",
  customer_type: "rural_producer",
  city: "",
  state: ""
};

const initialTicketForm: TicketPayload = {
  customer_id: 0,
  product_area_id: 0,
  title: "",
  description: "",
  priority: "medium",
  status: "open",
  due_date: ""
};

type SnackbarState = {
  message: string;
  type: "success" | "error";
} | null;

function formatStatus(status: string) {
  const statusLabels: Record<string, string> = {
    open: "Aberta",
    in_progress: "Em andamento",
    waiting_customer: "Aguardando cliente",
    resolved: "Resolvida",
    closed: "Fechada"
  };

  return statusLabels[status] ?? status;
}

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productAreas, setProductAreas] = useState<ProductArea[]>([]);
  const [tickets, setTickets] = useState<RequestTicket[]>([]);
  const [customerForm, setCustomerForm] = useState<CustomerPayload>(initialCustomerForm);
  const [ticketForm, setTicketForm] = useState<TicketPayload>(initialTicketForm);
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [commentByTicketId, setCommentByTicketId] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarState>(null);

  const showSnackbar = useCallback((message: string, type: "success" | "error" = "success") => {
    setSnackbar({ message, type });

    window.setTimeout(() => {
      setSnackbar(null);
    }, 3600);
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [customersResponse, areasResponse, ticketsResponse] = await Promise.all([
        agroconnectApi.getCustomers() as Promise<Customer[]>,
        agroconnectApi.getProductAreas() as Promise<ProductArea[]>,
        agroconnectApi.getTickets({ status: statusFilter, productAreaId: areaFilter })
      ]);

      setCustomers(customersResponse);
      setProductAreas(areasResponse);
      setTickets(ticketsResponse);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Não foi possível carregar os dados.";
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [areaFilter, showSnackbar, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const summary = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "open").length,
      inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length,
      waitingCustomer: tickets.filter((ticket) => ticket.status === "waiting_customer").length,
      resolved: tickets.filter((ticket) => ticket.status === "resolved" || ticket.status === "closed").length
    };
  }, [tickets]);

  async function handleCreateCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await agroconnectApi.createCustomer(customerForm);
      setCustomerForm(initialCustomerForm);
      showSnackbar(`Cliente '${customerForm.name}' criado com sucesso.`);
      await loadData();
    } catch (apiError) {
      showSnackbar(apiError instanceof Error ? apiError.message : "Não foi possível criar o cliente.", "error");
    }
  }

  async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await agroconnectApi.createTicket(ticketForm);
      setTicketForm(initialTicketForm);
      showSnackbar(`Solicitação '${ticketForm.title}' criada com sucesso.`);
      await loadData();
    } catch (apiError) {
      showSnackbar(apiError instanceof Error ? apiError.message : "Não foi possível criar a solicitação.", "error");
    }
  }

  async function handleAdvanceStatus(ticket: RequestTicket) {
    try {
      const updatedTicket = await agroconnectApi.advanceTicketStatus(ticket.id);

      setTickets((currentTickets) =>
        currentTickets.map((item) => (item.id === ticket.id ? updatedTicket : item))
      );

      showSnackbar(`Solicitação '${ticket.title}' movida para ${formatTicketStatus(updatedTicket.status)}.`);
    } catch (apiError) {
      showSnackbar(apiError instanceof Error ? apiError.message : "Não foi possível atualizar a solicitação.", "error");
    }
  }

  async function handleDeleteTicket(ticket: RequestTicket) {
    try {
      await agroconnectApi.deleteTicket(ticket.id);

      setTickets((currentTickets) => currentTickets.filter((item) => item.id !== ticket.id));

      showSnackbar(`Solicitação '${ticket.title}' excluída com sucesso.`);
    } catch (apiError) {
      showSnackbar(apiError instanceof Error ? apiError.message : "Não foi possível excluir a solicitação.", "error");
    }
  }

  async function handleAddComment(ticket: RequestTicket) {
    const message = commentByTicketId[ticket.id]?.trim();

    if (!message) return;

    try {
      const updatedTicket = await agroconnectApi.createComment(ticket.id, message);

      setTickets((currentTickets) =>
        currentTickets.map((item) => (item.id === ticket.id ? updatedTicket : item))
      );

      setCommentByTicketId((current) => ({ ...current, [ticket.id]: "" }));

      showSnackbar(`Comentário adicionado à solicitação '${ticket.title}'.`);
    } catch (apiError) {
      showSnackbar(apiError instanceof Error ? apiError.message : "Não foi possível adicionar o comentário.", "error");
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Ruby on Rails + React + PostgreSQL</span>
          <h1>AgroConnect</h1>
          <p>
            Um portal de solicitações de clientes pensado como ponto de entrada transversal para o ecossistema Agro:
            gestão, operações de campo, produção de sementes, fluxos laboratoriais, análise de dados e integrações.
          </p>
        </div>

        <div className="hero-icon" aria-hidden="true">
          <Leaf size={48} />
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard label="Total de solicitações" value={summary.total} />
        <SummaryCard label="Abertas" value={summary.open} />
        <SummaryCard label="Em andamento" value={summary.inProgress} />
        <SummaryCard label="Aguardando cliente" value={summary.waitingCustomer} />
        <SummaryCard label="Resolvidas / fechadas" value={summary.resolved} />
      </section>

      <section className="content-grid">
        <div className="side-panels">
          <CustomerForm
            value={customerForm}
            onChange={setCustomerForm}
            onSubmit={handleCreateCustomer}
          />

          <TicketForm
            value={ticketForm}
            customers={customers}
            productAreas={productAreas}
            onChange={setTicketForm}
            onSubmit={handleCreateTicket}
          />
        </div>

        <section className="panel requests-panel">
          <div className="panel-header">
            <div>
              <h2>Solicitações de clientes</h2>
              <p>
                Filtre, avance status, comente e remova solicitações por meio da API Rails.
              </p>
            </div>

            <button type="button" className="secondary-button" onClick={loadData} disabled={isLoading}>
              <RefreshCw size={16} /> {isLoading ? "Carregando..." : "Atualizar"}
            </button>
          </div>

          <div className="filter-row">
            <label>
              Área do produto
              <select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>
                <option value="">Todas</option>
                {productAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">Todos</option>
                <option value="open">Aberta</option>
                <option value="in_progress">Em andamento</option>
                <option value="waiting_customer">Aguardando cliente</option>
                <option value="resolved">Resolvida</option>
                <option value="closed">Fechada</option>
              </select>
            </label>
          </div>

          <div className="ticket-list">
            {tickets.length === 0 ? (
              <div className="empty-state">Nenhuma solicitação encontrada.</div>
            ) : (
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  commentValue={commentByTicketId[ticket.id] ?? ""}
                  onCommentChange={(value) =>
                    setCommentByTicketId((current) => ({ ...current, [ticket.id]: value }))
                  }
                  onAddComment={() => handleAddComment(ticket)}
                  onAdvanceStatus={() => handleAdvanceStatus(ticket)}
                  onDelete={() => handleDeleteTicket(ticket)}
                />
              ))
            )}
          </div>
        </section>
      </section>

      {snackbar ? (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      ) : null}
    </main>
  );
}

export default App;
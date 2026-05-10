import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import type { Customer, ProductArea, TicketPayload, TicketPriority } from "../types";

type TicketFormProps = {
  value: TicketPayload;
  customers: Customer[];
  productAreas: ProductArea[];
  onChange: (value: TicketPayload) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function TicketForm({ value, customers, productAreas, onChange, onSubmit }: TicketFormProps) {
  return (
    <aside className="panel">
      <h2>Nova solicitação</h2>
      <p>Crie uma solicitação conectada a uma área do ecossistema Agro.</p>

      <form onSubmit={onSubmit} className="form-stack">
        <select
          value={value.customer_id}
          onChange={(event) => onChange({ ...value, customer_id: Number(event.target.value) })}
          required
        >
          <option value={0} disabled>
            Selecione o cliente
          </option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.state}
            </option>
          ))}
        </select>

        <select
          value={value.product_area_id}
          onChange={(event) => onChange({ ...value, product_area_id: Number(event.target.value) })}
          required
        >
          <option value={0} disabled>
            Selecione a área do produto
          </option>

          {productAreas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Título da solicitação"
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />

        <textarea
          placeholder="Descreva a solicitação do cliente"
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          required
        />

        <select
          value={value.priority}
          onChange={(event) => onChange({ ...value, priority: event.target.value as TicketPriority })}
        >
          <option value="low">Prioridade baixa</option>
          <option value="medium">Prioridade média</option>
          <option value="high">Prioridade alta</option>
          <option value="urgent">Urgente</option>
        </select>

        <input
          type="date"
          value={value.due_date}
          onChange={(event) => onChange({ ...value, due_date: event.target.value })}
        />

        <button type="submit" disabled={!customers.length || !productAreas.length}>
          <Plus size={16} /> Adicionar solicitação
        </button>
      </form>
    </aside>
  );
}
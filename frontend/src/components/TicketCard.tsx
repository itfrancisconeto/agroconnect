import { useState } from "react";
import { MessageSquare, Trash2, TrendingUp, X } from "lucide-react";
import type { RequestTicket } from "../types";
import {
  formatTicketPriority,
  formatTicketStatus
} from "../utils/ticketFormatters";

type TicketCardProps = {
  ticket: RequestTicket;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  onAdvanceStatus: () => void;
  onDelete: () => void;
};

export function TicketCard({
  ticket,
  commentValue,
  onCommentChange,
  onAddComment,
  onAdvanceStatus,
  onDelete
}: TicketCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleConfirmDelete() {
    setIsDeleteDialogOpen(false);
    onDelete();
  }

  return (
    <>
      <article className="ticket-card">
        <div className="ticket-main">
          <div className="ticket-title-row">
            <h3>{ticket.title}</h3>

            <span className={`badge ${ticket.status}`}>
              {formatTicketStatus(ticket.status)}
            </span>

            <span className={`priority priority-${ticket.priority}`}>
              {formatTicketPriority(ticket.priority)}
            </span>
          </div>

          <p>{ticket.description}</p>

          <small>
            {ticket.customer.name} • {ticket.product_area.name}
            {ticket.due_date ? ` • Prazo ${ticket.due_date}` : ""}
          </small>

          <div className="comments-box">
            <strong>Comentários</strong>

            {ticket.ticket_comments.length === 0 ? (
              <small>Nenhum comentário ainda.</small>
            ) : (
              ticket.ticket_comments.map((comment) => (
                <small key={comment.id}>
                  <b>{comment.author_name}:</b> {comment.message}
                </small>
              ))
            )}
          </div>

          <div className="comment-row">
            <input
              placeholder="Adicionar um comentário rápido"
              value={commentValue}
              onChange={(event) => onCommentChange(event.target.value)}
            />

            <button
              type="button"
              className="secondary-button"
              onClick={onAddComment}
              disabled={!commentValue.trim()}
            >
              <MessageSquare size={16} /> Comentar
            </button>
          </div>
        </div>

        <div className="ticket-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onAdvanceStatus}
            disabled={ticket.status === "closed"}
          >
            <TrendingUp size={16} /> Avançar status
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Excluir solicitação"
            title="Excluir solicitação"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </article>

      {isDeleteDialogOpen ? (
        <div className="dialog-overlay" role="presentation">
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-ticket-title-${ticket.id}`}
          >
            <button
              type="button"
              className="dialog-close-button"
              onClick={() => setIsDeleteDialogOpen(false)}
              aria-label="Fechar confirmação"
              title="Fechar confirmação"
            >
              <X size={18} />
            </button>

            <h2 id={`delete-ticket-title-${ticket.id}`}>
              Excluir solicitação?
            </h2>

            <p>
              Esta ação removerá a solicitação{" "}
              <strong>{ticket.title}</strong> permanentemente.
            </p>

            <p className="dialog-warning">
              Essa operação não poderá ser desfeita.
            </p>

            <div className="dialog-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={16} /> Excluir solicitação
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}